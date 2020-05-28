import {
  fork,
  all,
  call,
  put,
  take,
  takeEvery,
  select
} from 'redux-saga/effects';
import { isArray, noop } from 'lodash';

import { modules } from 'veritone-redux-common';
const { auth: authModule, config: configModule, getExtraHeaders } = modules;

import { helpers } from 'veritone-redux-common';
const { fetchGraphQLApi } = helpers;
import uploadFilesChannel from '../../../shared/uploadFilesChannel';
import {
  ABORT_REQUEST,
  UPLOAD_REQUEST,
  RETRY_REQUEST,
  RETRY_DONE,
  uploadProgress,
  uploadComplete,
  endPick,
  failedFiles,
  uploadResult
} from './';

let requestMap;

function* finishUpload(id, result, { warning, error }, callback) {
  yield put(uploadComplete(id, result, { warning, error }));

  if (warning || error) {
    // There are failed uploads, don't close out and display error screen
    return;
  }
  yield put(endPick(id));
  // Get accumulated results, not just what's in the current upload/retry request
  // If there's no results, then the user must have aborted them all
  const totalResults = yield select(uploadResult, id);
  yield call(callback, totalResults, {
    warning,
    error,
    cancelled: !totalResults.length
  });
}

function* uploadFileSaga(id, fileOrFiles, callback = noop) {
  const files = isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
  const getUrlQuery = `query urls($name: String!){
        getSignedWritableUrl(key: $name) {
          url
          key
          bucket
          expiresInSeconds
          getUrl
          unsignedUrl
        }
      }`;

  const config = yield select(configModule.getConfig);
  const extraHeaders = yield select(getExtraHeaders);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const sessionToken = yield select(authModule.selectSessionToken);
  const oauthToken = yield select(authModule.selectOAuthToken);

  // get a signed URL for each object to be uploaded
  let signedWritableUrlResponses;
  try {
    signedWritableUrlResponses = yield all(
      files.map(({ name }) =>
        call(fetchGraphQLApi, {
          endpoint: graphQLUrl,
          query: getUrlQuery,
          // todo: add uuid to $name to prevent naming conflicts
          variables: { name },
          extraHeaders,
          token: sessionToken || oauthToken
        })
      )
    );
  } catch (error) {
    return yield* finishUpload(id, null, { error }, callback);
  }

  let uploadDescriptors; // { url, key, bucket, etc }
  try {
    uploadDescriptors = signedWritableUrlResponses.map(
      ({ data: { getSignedWritableUrl }, errors }) => {
        if (errors && errors.length) {
          throw new Error(
            `Call to getSignedWritableUrl returned error: ${errors[0].message}`
          );
        }

        return getSignedWritableUrl;
      }
    );
  } catch (e) {
    return yield* finishUpload(id, null, { error: e.message }, callback);
  }

  let resultChan;
  try {
    const uploadChannelResult = yield call(
      uploadFilesChannel,
      uploadDescriptors,
      files
    );
    resultChan = uploadChannelResult.channel;
    requestMap = uploadChannelResult.requestMap;
  } catch (error) {
    return yield* finishUpload(id, null, { error }, callback);
  }

  let result = [];

  while (result.length !== files.length) {
    const {
      progress = 0,
      aborted,
      error,
      success,
      file,
      descriptor: { key, bucket, expiresInSeconds, getUrl, unsignedUrl }
    } = yield take(resultChan);

    if (success || error) {
      yield put(
        uploadProgress(id, key, {
          name: file.name,
          type: file.type,
          size: file.size,
          error,
          aborted,
          percent: 100
        })
      );

      result.push({
        key,
        bucket,
        expiresInSeconds,
        fileName: file.name,
        size: file.size,
        type: file.type,
        aborted,
        error: error || false,
        unsignedUrl: error ? null : unsignedUrl,
        getUrl: error ? null : getUrl,
        file
      });

      continue;
    }

    yield put(
      uploadProgress(id, key, {
        name: file.name,
        type: file.type,
        size: file.size,
        percent: progress
      })
    );
  }

  // Remove aborted requests
  result = result.filter(r => !r.aborted);

  const isError = result.length && result.every(e => e.error);
  const isWarning = !isError && result.some(e => e.error);

  yield* finishUpload(
    id,
    result,
    {
      warning: isWarning ? 'Some files failed to upload.' : false,
      error: isError ? 'All files failed to upload.' : false
    },
    callback
  );
}

function* watchUploadRequest() {
  yield takeEvery(UPLOAD_REQUEST, function*(action) {
    const { files, callback } = action.payload;
    const { id } = action.meta;
    yield call(uploadFileSaga, id, files, callback);
  });
}

function* watchRetryRequest() {
  yield takeEvery(RETRY_REQUEST, function*(action) {
    const { callback } = action.payload;
    const { id } = action.meta;
    const erroredFiles = yield select(failedFiles, id) || [];
    yield call(uploadFileSaga, id, erroredFiles, callback);
  });
}

function* watchRetryDone() {
  yield takeEvery(RETRY_DONE, function*(action) {
    const { callback } = action.payload;
    const { id } = action.meta;
    const uploads = yield select(uploadResult, id) || [];
    const completedUploads = uploads.filter(upload => !upload.error);

    yield put(endPick(id));
    yield call(callback, completedUploads, {
      cancelled: !completedUploads.length
    });
  });
}

function* watchAbortions() {
  yield takeEvery(ABORT_REQUEST, function*(action) {
    if (!requestMap) {
      return;
    }
    const { fileKey } = action.meta;
    // Abort requests somehow
    if (fileKey && requestMap[fileKey]) {
      yield requestMap[fileKey].abort && requestMap[fileKey].abort();
      delete requestMap[fileKey];
    } else {
      Object.keys(requestMap).forEach(fileKey => {
        requestMap[fileKey].abort && requestMap[fileKey].abort();
        delete requestMap[fileKey];
      });
    }
  });
}

export default function* root() {
  yield all([
    fork(watchUploadRequest),
    fork(watchRetryRequest),
    fork(watchRetryDone),
    fork(watchAbortions)
  ]);
}
