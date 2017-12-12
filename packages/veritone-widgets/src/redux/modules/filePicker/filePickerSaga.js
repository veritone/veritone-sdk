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
const { user: userModule, config: configModule } = modules;

import callGraphQLApi from '../../../shared/callGraphQLApi';
import uploadFilesChannel from '../../../shared/uploadFilesChannel';
import { UPLOAD_REQUEST, uploadProgress, uploadComplete, endPick } from '.';

function* finishUpload(result, { warn, error }, callback) {
  yield put(uploadComplete(result, { warn, error }));
  yield call(callback, result);
}

export function* uploadFileSaga(fileOrFiles, callback = noop) {
  const files = isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
  const getUrlQuery = `query urls($name: String!){
        getSignedWritableUrl(key: $name) {
          url
          key
          bucket
        }
      }`;

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(userModule.selectSessionToken);

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
    return yield* finishUpload(null, { error }, callback);
  }

  let uploadDescriptors; // { url, key, bucket }
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
    return yield* finishUpload(null, { error: e.message }, callback);
  }

  let resultChan;
  try {
    resultChan = yield call(uploadFilesChannel, uploadDescriptors, files);
  } catch (error) {
    return yield* finishUpload(null, { error }, callback);
  }

  let result = [];

  while (result.length !== files.length) {
    const {
      progress = 0,
      error,
      success,
      file,
      descriptor: { key, bucket }
    } = yield take(resultChan);

    if (success || error) {
      yield put(uploadProgress(key, 100));

      result.push({
        name: key,
        size: file.size,
        type: file.type,
        error: error || false,
        url: error ? null : `https://${bucket}.s3.amazonaws.com/${key}`
      });
      continue;
    }

    yield put(uploadProgress(key, progress));
  }

  const isError = result.every(e => e.error);
  const isWarning = !isError && result.some(e => e.error);

  yield* finishUpload(
    result,
    {
      warn: isWarning ? 'Some files failed to upload.' : false,
      error: isError ? 'All files failed to upload.' : false
    },
    callback
  );

  // fixme -- only do this on success. on failure, wait for user to ack.
  yield call(delay, 3000);
  yield put(endPick());
}

export function* watchUploadRequest() {
  yield takeEvery(UPLOAD_REQUEST, function*(action) {
    const { files, callback } = action.payload;
    yield call(uploadFileSaga, files, callback);
  });
}

export default function* root() {
  yield all([fork(watchUploadRequest)]);
}
