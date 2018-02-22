import {
  fork,
  all,
  call,
  put,
  take,
  takeEvery,
  select
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { isArray, noop } from 'lodash';

import { modules } from 'veritone-redux-common';
const { auth: authModule, config: configModule } = modules;

import callGraphQLApi from '../../../shared/callGraphQLApi';
import uploadFilesChannel from '../../../shared/uploadFilesChannel';
import { UPLOAD_REQUEST, uploadProgress, uploadComplete, endPick } from '.';

function* finishUpload(id, result, { warning, error }, callback) {
  yield put(uploadComplete(id, result, { warning, error }));
  // fixme -- handle this better
  yield call(delay, warning || error ? 1500 : 500);
  yield put(endPick(id));
  yield call(callback, result, { warning, error, cancelled: false });
}

function* uploadFileSaga(id, fileOrFiles, callback = noop) {
  const files = isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
  const getUrlQuery = `query urls($name: String!){
        getSignedWritableUrl(key: $name) {
          url
          key
          bucket
          expires
          getUrl
          unsignedUrl
        }
      }`;

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  // get a signed URL for each object to be uploaded
  let signedWritableUrlResponses;
  try {
    signedWritableUrlResponses = yield all(
      files.map(({ name }) =>
        call(callGraphQLApi, {
          endpoint: graphQLUrl,
          query: getUrlQuery,
          // todo: add uuid to $name to prevent naming conflicts
          variables: { name },
          token
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
    resultChan = yield call(uploadFilesChannel, uploadDescriptors, files);
  } catch (error) {
    return yield* finishUpload(id, null, { error }, callback);
  }

  let result = [];

  while (result.length !== files.length) {
    const {
      progress = 0,
      error,
      success,
      file,
      descriptor: { key, bucket, expires, getUrl, unsignedUrl }
    } = yield take(resultChan);

    if (success || error) {
      yield put(uploadProgress(id, key, 100));

      result.push({
        key,
        bucket,
        expires,
        fileName: file.name,
        size: file.size,
        type: file.type,
        error: error || false,
        unsignedUrl: error ? null : unsignedUrl,
        getUrl: error ? null : getUrl
      });

      continue;
    }

    yield put(uploadProgress(id, key, progress));
  }

  const isError = result.every(e => e.error);
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

export default function* root() {
  yield all([fork(watchUploadRequest)]);
}
