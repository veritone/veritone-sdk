import {
  call,
  put,
  takeEvery,
  select
} from 'redux-saga/effects';
import { modules, helpers } from 'veritone-redux-common';
import { get } from 'lodash';
import {
  getGqlParams,
  TDO_FRAGMENTS
} from './helper';
import {
  PICK_END,
  INIT_UPLOAD,
  UPLOAD_TO_TDO,
  RETRY_REQUEST,
  RETRY_DONE,
  getCurrentNode
} from './';

// Leverage filepicker redux
import {
  UPLOAD_REQUEST,
  RETRY_REQUEST as FP_RETRY_REQUEST,
  RETRY_DONE as FP_RETRY_DONE,
  CLEAR_FILEPICKER_DATA
} from '../filePicker';

const { fetchGraphQLApi } = helpers;
const {
  user: userModule
} = modules;

export const template = {
  type: 'upload',
  isEnabled,
  selectType: 'tdo',
  initialization: initializeUploadData,
  watchers: [
    watchUploadToTDO,
    watchRetryRequest,
    watchRetryDone
  ]
};

const WEBSTREAM_ADAPTER_ID = '9e611ad7-2d3b-48f6-a51b-0a1ba40feab4';

function* isEnabled(payload) {
  if (!payload) {
    return false;
  }
  const {
    enableUploads
  } = payload;
  const orgDisableUploads = yield select(userModule.hasFeature, 'disableCmsUpload');
  return enableUploads && !orgDisableUploads;
}

function* initializeUploadData(id) {
  yield put({
    type: INIT_UPLOAD,
    meta: { id }
  });
}


function* watchUploadToTDO() {
  yield takeEvery(UPLOAD_TO_TDO, function* (action) {
    // Upload files, use s3 urls to create TDOs, and select TDOs
    const { id } = action.meta;
    const { files, callback } = action.payload;
    yield put({
      type: UPLOAD_REQUEST,
      meta: { id },
      payload: {
        files,
        callback: createTDOsFromFiles(id, callback)
      }
    });
  });
}

function* watchRetryRequest() {
  yield takeEvery(RETRY_REQUEST, function*(action) {
    // Wrap filepicker retry request
    const { callback } = action.payload;
    const { id } = action.meta;

    yield put({
      type: FP_RETRY_REQUEST,
      meta: { id },
      payload: {
        callback: createTDOsFromFiles(id, callback)
      }
    });
  });
}

function* watchRetryDone() {
  yield takeEvery(RETRY_DONE, function*(action) {
    // Wrap filepicker retry done
    const { callback } = action.payload;
    const { id } = action.meta;

    yield put({
      type: FP_RETRY_DONE,
      meta: { id },
      payload: {
        callback: createTDOsFromFiles(id, callback)
      }
    });
  });
}

function createTDOsFromFiles(id, callback) {
  return function* (signedFiles, { warning, error, cancelled }) {
    // Create TDO w/ asset to set full primary asset for immediate reprocessing
    // then launch webstream adapter against it to enable playback
    const currentNode = yield select(getCurrentNode, id);
    let createdTDOs = [], createdJobIds = [];
    if (!cancelled && signedFiles.length) {
      const tdoResponses = yield signedFiles.map(function* (signedFile) {
        return yield createTDOWithAsset(signedFile, currentNode, currentNode);
      });
      createdTDOs = tdoResponses.map(res => get(res, 'data.createTDOWithAsset', currentNode));

      const jobResponses = yield createdTDOs.map(function* (tdo) {
        return yield createInitialJob(tdo);
      });
      createdJobIds = jobResponses.map(res => get(res, 'data.createJob.id'));
      console.log('Created Job Ids: ', createdJobIds);
    }
    yield put({
      type: CLEAR_FILEPICKER_DATA,
      meta: { id }
    });
    yield put({
      type: PICK_END,
      meta: { id }
    });
    callback(createdTDOs, { warning, error, cancelled });
  }
}

function* createTDOWithAsset(signedFile, currentNode) {
  const {
    graphQLUrl,
    token,
    extraHeaders
  } = yield getGqlParams();
  const query = `mutation ($input: CreateTDOWithAsset!) {
    createTDOWithAsset(input: $input) {
      ${TDO_FRAGMENTS}
    }
  }`;
  const variables = {
    input: {
      name: signedFile.fileName,
      contentType: signedFile.type,
      uri: signedFile.unsignedUrl,
      startDateTime: new Date().toISOString(),
      updateStopDateTimeFromAsset: true,
      sourceId: '-1',
      isPublic: false,
      assetType: 'media',
      addToIndex: true,
      sourceData: {
        sourceId: '-1'
      }
    }
  };
  // Current node may not exist if only Upload is enabled
  if (currentNode && currentNode.id) {
    variables.input.parentFolderId = currentNode.id;
  }
  return yield call(fetchGraphQLApi, {
    endpoint: graphQLUrl,
    query,
    variables,
    extraHeaders,
    token
  });
}

function* createInitialJob(tdo) {
  const {
    graphQLUrl,
    token,
    extraHeaders
  } = yield getGqlParams();
  const query = `mutation ($input: CreateJob!) {
    createJob(input: $input) {
      id
    }
  }`;
  const variables = {
    input: {
      targetId: tdo.id,
      tasks: [{
        engineId: WEBSTREAM_ADAPTER_ID, // Webstream Adapter
        payload: {
          tdoId: tdo.id,
          url: tdo.primaryAsset.signedUri
        }
      }]
    }
  };
  return yield call(fetchGraphQLApi, {
    endpoint: graphQLUrl,
    query,
    variables,
    extraHeaders,
    token
  });
}
