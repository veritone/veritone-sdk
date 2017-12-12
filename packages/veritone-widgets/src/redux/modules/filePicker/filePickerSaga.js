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
import { isArray } from 'lodash';

import { modules } from 'veritone-redux-common';
const { user: userModule, config: configModule } = modules;

import callGraphQLApi from '../../../shared/callGraphQLApi';
import uploadFilesChannel from '../../../shared/uploadFilesChannel';
import { UPLOAD_REQUEST, uploadProgress, uploadComplete, endPick } from '.';

export function* uploadFileSaga(fileOrFiles) {
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
    return yield put(uploadComplete(null, { error }));
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
    return yield put(uploadComplete(null, { error: e.message }));
  }

  let resultChan;
  try {
    resultChan = yield call(uploadFilesChannel, uploadDescriptors, files);
  } catch (error) {
    return yield put(uploadComplete(null, { error }));
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

  yield put(
    uploadComplete(result, {
      warn: isWarning ? 'Some files failed to upload.' : false,
      error: isError ? 'All files failed to upload.' : false
    })
  );

  // fixme -- only do this on success. on failure, wait for user to ack.
  yield call(delay, 3000);
  yield put(endPick());
}

export function* watchUploadRequest() {
  yield takeEvery(UPLOAD_REQUEST, function*(action) {
    const files = action.payload;
    yield call(uploadFileSaga, files);
  });
}

export default function* root() {
  yield all([fork(watchUploadRequest)]);
}
