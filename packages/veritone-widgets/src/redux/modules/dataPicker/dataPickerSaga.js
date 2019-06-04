import {
  fork,
  all,
  call,
  put,
  take,
  takeEvery,
  select
} from 'redux-saga/effects';
import { isArray, noop, get, pick } from 'lodash';

import { modules } from 'veritone-redux-common';
const {
  auth: authModule,
  config: configModule,
  user: userModule
} = modules;

import { helpers } from 'veritone-redux-common';
const { fetchGraphQLApi } = helpers;

// Leverage filepicker redux
import {
  UPLOAD_REQUEST,
  RETRY_REQUEST as FP_RETRY_REQUEST,
  RETRY_DONE as FP_RETRY_DONE,
  CLEAR_FILEPICKER_DATA
} from '../filePicker';

import {
  PICK_START,
  PICK_END,
  ON_PICK,
  INIT_ORG_CONFIG,
  INIT_PICKER_TYPE,
  INIT_FOLDER,
  INIT_UPLOAD,
  UPLOAD_TO_TDO,
  FETCH_PAGE,
  LOADED_PAGE,
  RETRY_REQUEST,
  RETRY_DONE,
  SET_SEARCH_VALUE,
  currentDirectoryPaginationState,
  getItemByTypeAndId,
  getCurrentNode,
  currentPickerType,
  searchValue
} from './';

const DEFAULT_PAGE_SIZE = 30;
const ROOT_ID = 'root';
const FOLDER_PICKER_TYPE = 'folder';
const UPLOAD_PICKER_TYPE = 'upload';
const SEARCH_PICKER_TYPE = 'search';
const TDO_FRAGMENTS = `
  id
  name
  startDateTime
  stopDateTime
  thumbnailUrl
  sourceImageUrl
  primaryAsset (assetType: "media") {
    id
    name
    contentType
    signedUri
  }
  createdDateTime
  modifiedDateTime
  streams {
    uri
    protocol
  }
`;

function* getGqlParams() {
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const sessionToken = yield select(authModule.selectSessionToken);
  const oauthToken = yield select(authModule.selectOAuthToken);
  const token = sessionToken || oauthToken;
  return {
    graphQLUrl,
    token
  };
}

function* watchPickStart() {
  yield takeEvery(PICK_START, function*(action) {
    // Initialize picker if not already loaded
    const { id } = action.meta;
    const {
      graphQLUrl,
      token
    } = yield getGqlParams();
    const orgEnableFolders = yield select(userModule.hasFeature, 'cmsFolders');
    const orgDisableUploads = yield select(userModule.hasFeature, 'disableCmsUpload');

    // Initialize Org Data
    yield put({
      type: INIT_ORG_CONFIG,
      payload: {
        orgEnableFolders,
        orgDisableUploads
      }
    });

    let pickerType, availablePickerTypes = [];
    if (orgEnableFolders) {
      pickerType = pickerType || FOLDER_PICKER_TYPE;
      availablePickerTypes.push(FOLDER_PICKER_TYPE);
    }
    if (!orgDisableUploads) {
      pickerType = pickerType || UPLOAD_PICKER_TYPE;
      availablePickerTypes.push(UPLOAD_PICKER_TYPE);
    }

    yield put({
      type: INIT_PICKER_TYPE,
      meta: { id },
      payload: {
        currentPickerType: pickerType,
        availablePickerTypes
      }
    });

    // Initialize Folder Data
    if (orgEnableFolders) {
      yield initializeFolderData(id);
    }
    // Initialize Upload Data
    if (!orgDisableUploads) {
      yield initializeUploadData(id);
    }
  });
}

function* initializeFolderData(id, refreshCache) {
  const {
    graphQLUrl,
    token
  } = yield getGqlParams();
  const getItem = yield select(getItemByTypeAndId);
  const cachedFolderData = getItem(FOLDER_PICKER_TYPE, ROOT_ID);
  let itemDataPayload = {};
  // Get root folders
  if (refreshCache || !cachedFolderData) {
    const rootQuery = `mutation rootFolder {
      createRootFolders (rootFolderType: cms) {
        id
        name
        createdDateTime
        modifiedDateTime
        ownerId
      }
    }`;
    try {
      const rootFolderResponse = yield call(fetchGraphQLApi, {
        endpoint: graphQLUrl,
        query: rootQuery,
        token
      })
      const rootFolder = get(rootFolderResponse, 'data.createRootFolders');
      const orgRootFolder = rootFolder.find(folder => !folder.ownerId);
      itemDataPayload = {
        [`${FOLDER_PICKER_TYPE}:${ROOT_ID}`]: {
          ...orgRootFolder,
          nodeIds: [],
          leafIds: []
        }
      };
    } catch(error) {
      // TODO: Set error state
      return false;
    }
  }

  yield put({
    type: INIT_FOLDER,
    meta: { id },
    payload: itemDataPayload
  });
  // Initialize first page of root
  if (refreshCache || !cachedFolderData) {
    yield put({
      type: FETCH_PAGE,
      meta: { id }
    });
  }

  return true;
}

function* initializeUploadData(id) {
  yield put({
    type: INIT_UPLOAD,
    meta: { id }
  });
}

// Fetch the next page for the currentPickerType
//  Folders - fetch subfolders first. once exhausted, then fetch TDOs
//  Search - if searchValue is populated, fetch search results
function* watchPagination() {
  yield takeEvery(FETCH_PAGE, function*(action) {
    const { id } = action.meta;
    let pickerType = yield select(currentPickerType, id);
    const currentNode = yield select(getCurrentNode, id);
    const triggerSearch = yield select(searchValue, id);

    const paginationFuncs = {
      [FOLDER_PICKER_TYPE]: fetchFolderPage,
      [SEARCH_PICKER_TYPE]: fetchSearchPage
    };

    if (!currentNode) {
      return;
    }

    // If searchValue is populated then trigger search pagination
    if (triggerSearch) {
      pickerType = SEARCH_PICKER_TYPE;
    }

    let result = {};
    if (paginationFuncs[pickerType]) {
      result = yield paginationFuncs[pickerType](currentNode, id);
    }

    yield put({
      type: LOADED_PAGE,
      meta: { id },
      payload: result
    });
  });
}

function* fetchFolderPage(currentNode, id) {
  const {
    graphQLUrl,
    token
  } = yield getGqlParams();
  const currentFolderId = currentNode.id;
  const { nodeOffset = 0, leafOffset = 0 } = currentNode;
  const result = {
    itemData: {},
    nodeIds: [],
    leafIds: [],
    nodeOffset,
    leafOffset
  };
  if (nodeOffset >= 0) {
    const query = `{
      folder (id: "${currentFolderId}") {
        childFolders (limit: ${DEFAULT_PAGE_SIZE}, offset: ${nodeOffset}) {
          records {
            id
            name
            description
            createdDateTime
            modifiedDateTime
          }
        }
      }
    }`;

    const childFolderResponse = yield call(fetchGraphQLApi, {
      endpoint: graphQLUrl,
      query,
      token
    });

    const childFolders = get(childFolderResponse, 'data.folder.childFolders.records', []);
    childFolders.forEach(item => {
      item.type = 'folder';
      item.nodeIds = [];
      item.leafIds = [];
    });
    result.nodeIds = childFolders
      .map(folder => ({ id: folder.id, type: FOLDER_PICKER_TYPE }));
    result.itemData = childFolders.reduce(
      (acc, folder) => {
        acc[`${FOLDER_PICKER_TYPE}:${folder.id}`] = folder;
        return acc;
      },
      result.itemData
    );
    // Prevent further pagination
    if (result.nodeIds.length < DEFAULT_PAGE_SIZE) {
      result.nodeOffset = -1;
    } else {
      result.nodeOffset = nodeOffset + DEFAULT_PAGE_SIZE;
    }
  }
  if (leafOffset >= 0 || (nodeOffset >= 0 && result.nodeIds.length < DEFAULT_PAGE_SIZE)) {
    const query = `{
      folder (id: "${currentFolderId}") {
        childTDOs (limit: ${DEFAULT_PAGE_SIZE}, offset: ${leafOffset}) {
          records {
            ${TDO_FRAGMENTS}
          }
        }
      }
    }`;

    const childTdoResponse = yield call(fetchGraphQLApi, {
      endpoint: graphQLUrl,
      query,
      token
    });

    const childTDOs = get(childTdoResponse, 'data.folder.childTDOs.records', []);
    childTDOs.forEach(item => { item.type = 'tdo' });
    result.leafIds = childTDOs
      .map(tdo => ({
        id: tdo.id,
        type: 'tdo'
    }));
    result.itemData = childTDOs.reduce(
      (acc, tdo) => {
        acc[`tdo:${tdo.id}`] = tdo;
        return acc;
      },
      result.itemData
    );
    if (result.leafIds.length < DEFAULT_PAGE_SIZE) {
      result.leafOffset = -1;
    } else {
      result.leafOffset = leafOffset + DEFAULT_PAGE_SIZE;
    }
  }
  return result;
}

function* fetchSearchPage(currentNode, id) {
  console.log(currentNode, id);
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
    let createdTDOs = [], createdJobIds = [];
    if (!cancelled && signedFiles.length) {
      const tdoResponses = yield signedFiles.map(function* (signedFile) {
        return yield createTDOWithAsset(signedFile);
      });
      console.log(tdoResponses);
      createdTDOs = tdoResponses.map(res => get(res, 'data.createTDOWithAsset'));
      
      const jobResponses = yield createdTDOs.map(function* (tdo) {
        return yield createInitialJob(tdo);
      });
      createdJobIds = jobResponses.map(res => get(res, 'data.createJob.id'));
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

function* createTDOWithAsset(signedFile) {
  const {
    graphQLUrl,
    token
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
  return yield call(fetchGraphQLApi, {
    endpoint: graphQLUrl,
    query,
    variables,
    token
  });
}

function* createInitialJob(tdo) {
  const {
    graphQLUrl,
    token
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
        engineId: '9e611ad7-2d3b-48f6-a51b-0a1ba40feab4', // Webstream Adapter
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
    token
  });
}

function* watchOnSearch() {
  yield takeEvery(SET_SEARCH_VALUE, function* (action) {
    const { id } = action.meta;
    const searchValue = action.payload;
    
    yield put({
      type: FETCH_PAGE,
      meta: { id }
    });
  });
}

export default function* root() {
  yield all([
    fork(watchPickStart),
    fork(watchPagination),
    fork(watchUploadToTDO),
    fork(watchRetryRequest),
    fork(watchRetryDone),
    fork(watchOnSearch)
  ]);
}
