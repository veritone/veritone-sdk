import {
  fork,
  all,
  call,
  put,
  take,
  takeEvery,
  select,
  join
} from 'redux-saga/effects';
import { END } from 'redux-saga';
import { isArray } from 'lodash';

import { modules } from 'veritone-redux-common';
const { user: userModule, config: configModule } = modules;

import callGraphQLApi from '../../../shared/callGraphQLApi';
import { uploadFiles } from '../../../shared/createUploadFileChannel';
import {
  UPLOAD_REQUEST,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
  progressPercentByFileKey
} from '.';

function resultObject({ name, size, type }, url, error = false) {
  return {
    name,
    size,
    type,
    error,
    url
  };
}

function* setAllFilesProgress(uploadDescriptors, percentage) {
  for (const { key } of uploadDescriptors) {
    yield put(uploadProgress(key, percentage));
  }
}

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
  const signedWritableUrlResponses = yield all(
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

  // todo: handle graphql errors
  const uploadDescriptors = signedWritableUrlResponses.map(
    ({ data: { getSignedWritableUrl: { url, key, bucket } }, errors }) => ({
      url,
      key,
      bucket
    })
  );

  yield* setAllFilesProgress(uploadDescriptors, 20);

  let resultChan;
  try {
    resultChan = yield call(uploadFiles, uploadDescriptors, files);
  } catch (e) {
    yield put(uploadFailure(e));
  }

  let result = [];

  while (true) {
    if (result.length === files.length) {
      break;
    }

    const {
      progress = 0,
      err,
      success,
      file,
      descriptor: { key, bucket }
    } = yield take(resultChan);

    if (success || err) {
      yield put(uploadProgress(key, 100));

      // todo: figure out how to get object URL from descriptor.key/bucket
      result.push(resultObject(file, null, !!err));
      continue;
    }

    yield put(uploadProgress(key, progress));
  }

  yield put(uploadSuccess(result)); // fixme -- verify result val
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
