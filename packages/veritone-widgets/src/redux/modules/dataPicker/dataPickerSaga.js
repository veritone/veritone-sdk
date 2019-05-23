import {
  fork,
  all,
  call,
  put,
  take,
  takeEvery,
  select
} from 'redux-saga/effects';
import { isArray, noop, get } from 'lodash';

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
  getCurrentNode
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

    let currentPickerType;
    if (orgEnableFolders) {
      currentPickerType = FOLDER_PICKER_TYPE;
    } else if (!orgDisableUploads) {
      currentPickerType = UPLOAD_PICKER_TYPE;
    }

    yield put({
      type: INIT_PICKER_TYPE,
      meta: { id },
      payload: currentPickerType
    });

    // Initialize Folder Data
    if (orgEnableFolders) {
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
          payload: orgRootFolder
        });
      } catch(error) {
        // TODO: Set error state
      }

    }
    // Initialize Upload Data
    if (!orgDisableUploads) {
      yield put({
        type: INIT_UPLOAD,
        meta: { id }
      });
    }


  });
}

// Fetch the next page for the currentPickerType
//  Folders - fetch subfolders first. once exhausted, then fetch TDOs
function* watchPagination() {
  yield takeEvery(FETCH_PAGE, function*(action) {
    const { id } = action.meta;
    const pickerType = select(currentPickerType, id);
    const currentNode = select(getCurrentNode, id);
    const paginationFuncs = {
      [FOLDER_PICKER_TYPE]: fetchFolderPage
    };
    let result = {};
    if (paginationFuncs[pickerType]) {
      result = yield paginationFuncs[pickerType](currentNode);
    }

    if (result.length) {
      yield put({
        type: LOADED_PAGE,
        meta: { id },
        payload: result
      });
    }
  });
}

function* fetchFolderPage(currentNode) {
  const {
    graphQLUrl,
    token
  } = yield getGqlParams();
  const currentFolderId = currentNode.id;
  const { nodeOffset, leafOffset } = select(currentDirectoryPaginationState, id);
  const result = {
    nodeItems: [],
    leafItems: []
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

    yield put()

    result.nodeItems = get(childFolderResponse, 'data.folder.childFolders.records', []);
  } else if (leafOffset >= 0) {
    const query = `{
      folder (id: "${currentFolderId}") {
        childTDOs (limit: ${DEFAULT_PAGE_SIZE}, offset: ${nodeOffset}) {
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

    result.leafItems = get(childTdoResponse, 'data.folder.childTDOs.records', []);
  }
  return result;
}

export default function* root() {
  yield all([
    fork(watchPickStart),
    fork(watchPagination)
  ]);
}
