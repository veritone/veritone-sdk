import {
  call,
  put,
  select
} from 'redux-saga/effects';
import { modules, helpers } from 'veritone-redux-common';
import { get } from 'lodash';
import {
  getGqlParams,
  ROOT_ID,
  DEFAULT_PAGE_SIZE,
  TDO_FRAGMENTS
} from './helper';
import {
  INIT_FOLDER,
  FETCH_PAGE,
  ERRORED_PAGE,
  getItemByTypeAndId
} from './';

const { fetchGraphQLApi } = helpers;
const {
  user: userModule,
  getExtraHeaders
} = modules;

export const template = {
  type: 'folder',
  isEnabled,
  selectType: 'tdo',
  initialization: initializeFolderData,
  pagination: fetchFolderPage
};

function* isEnabled(payload) {
  if (!payload) {
    return false;
  }
  const {
    enableFolders
  } = payload;
  const orgEnableFolders = yield select(userModule.hasFeature, 'cmsFolders');
  return enableFolders && orgEnableFolders;
}

function* initializeFolderData(id, refreshCache) {
  const {
    graphQLUrl,
    token
  } = yield getGqlParams();
  const getItem = yield select(getItemByTypeAndId);
  const extraHeaders = yield select(getExtraHeaders);
  const cachedFolderData = getItem(template.type, ROOT_ID);
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
        extraHeaders,
        token
      });
      const error = get(rootFolderResponse, 'errors[0].message');
      if (error) {
        throw error;
      }
      const rootFolder = get(rootFolderResponse, 'data.createRootFolders');
      const orgRootFolder = rootFolder.find(folder => !folder.ownerId);
      itemDataPayload = {
        [`${template.type}:${ROOT_ID}`]: {
          ...orgRootFolder,
          nodeIds: [],
          leafIds: []
        }
      };
    } catch (error) {
      itemDataPayload = {
        [`${template.type}:${ROOT_ID}`]: {
          nodeIds: [],
          leafIds: [],
          error
        }
      };
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

function* fetchFolderPage(currentNode, id) {
  const {
    graphQLUrl,
    token,
    extraHeaders
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
    try {
      const childFolderResponse = yield call(fetchGraphQLApi, {
        endpoint: graphQLUrl,
        query,
        extraHeaders,
        token
      });

      const error = get(childFolderResponse, 'errors[0].message');
      if (error) {
        throw error;
      }
      const childFolders = get(childFolderResponse, 'data.folder.childFolders.records', []);
      childFolders.forEach(item => {
        item.type = 'folder';
        item.nodeIds = [];
        item.leafIds = [];
      });
      result.nodeIds = childFolders
        .map(folder => ({ id: folder.id, type: template.type }));
      result.itemData = childFolders.reduce(
        (acc, folder) => {
          acc[`${template.type}:${folder.id}`] = folder;
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
    } catch (error) {
      yield put({
        type: ERRORED_PAGE,
        meta: { id },
        payload: error
      });
      return;
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
    try {
      const childTdoResponse = yield call(fetchGraphQLApi, {
        endpoint: graphQLUrl,
        query,
        extraHeaders,
        token
      });
      const error = get(childTdoResponse, 'errors[0].message');
      if (error) {
        throw error;
      }
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
    } catch (error) {
      yield put({
        type: ERRORED_PAGE,
        meta: { id },
        payload: error
      });
      return;
    }
  }
  return result;
}
