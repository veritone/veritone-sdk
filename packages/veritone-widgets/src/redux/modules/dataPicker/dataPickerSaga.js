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

import {
  PICK_START,
  INIT_ORG_CONFIG,
  INIT_PICKER_TYPE,
  INIT_FOLDER,
  INIT_UPLOAD,
  FETCH_PAGE,
  LOADED_PAGE,
  currentDirectoryPaginationState,
  getCurrentNode,
  currentPickerType
} from './';

const DEFAULT_PAGE_SIZE = 30;
const FOLDER_PICKER_TYPE = 'folder';
const UPLOAD_PICKER_TYPE = 'upload';

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

    let pickerType;
    if (orgEnableFolders) {
      pickerType = FOLDER_PICKER_TYPE;
    } else if (!orgDisableUploads) {
      pickerType = UPLOAD_PICKER_TYPE;
    }

    yield put({
      type: INIT_PICKER_TYPE,
      meta: { id },
      payload: pickerType
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

function* initializeFolderData(id) {
  const {
    graphQLUrl,
    token
  } = yield getGqlParams();
  // Get root folders
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
    // Set initial state
    yield put({
      type: INIT_FOLDER,
      meta: { id },
      payload: {
        [`${FOLDER_PICKER_TYPE}:root`]: {
          ...orgRootFolder,
          nodeIds: [],
          leafIds: []
        }
      }
    });
    // Initialize first page of root
    yield put({
      type: FETCH_PAGE,
      meta: { id }
    });

    return true;
  } catch(error) {
    // TODO: Set error state
    return false;
  }
}

function* initializeUploadData(id) {
  yield put({
    type: INIT_UPLOAD,
    meta: { id }
  });
}

// Fetch the next page for the currentPickerType
//  Folders - fetch subfolders first. once exhausted, then fetch TDOs
function* watchPagination() {
  yield takeEvery(FETCH_PAGE, function*(action) {
    const { id } = action.meta;
    const pickerType = yield select(currentPickerType, id);
    const currentNode = yield select(getCurrentNode, id);
    if (!currentNode) {
      return;
    }
    const paginationFuncs = {
      [FOLDER_PICKER_TYPE]: fetchFolderPage
    };
    let result = {};
    if (paginationFuncs[pickerType]) {
      result = yield paginationFuncs[pickerType](currentNode, id);
    }

    if (get(result, 'nodeIds.length') || get(result, 'leafIds.length')) {
      yield put({
        type: LOADED_PAGE,
        meta: { id },
        payload: result
      });
    }
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
    result.nodeIds = childFolders.map(folder => folder.id);
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
    result.leafIds = childTDOs.map(tdo => tdo.id);
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

export default function* root() {
  yield all([
    fork(watchPickStart),
    fork(watchPagination)
  ]);
}
