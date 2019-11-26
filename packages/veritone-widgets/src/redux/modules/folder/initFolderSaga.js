/* eslint-disable lodash/path-style */
import {
  call,
  all,
  takeEvery,
  put,
  select
} from 'redux-saga/effects';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import uniq from 'lodash/uniq';
import { handleRequest } from './helper';
import { fetchMore, expandFolderInFunction } from './expandFolderSaga';
import * as folderSelector from './selector';
import * as folderReducer from './index';
export default function* initFolder() {
  yield all([
    takeEvery(folderReducer.INIT_ROOT_FOLDER, initRootFolderSagas),
    takeEvery(folderReducer.INIT_FOLDER, initFolderSagas),
    takeEvery(folderReducer.INIT_FOLDER_FROM_APP, initFolderFromApp),
  ])
}

function* initRootFolderSagas(action) {
  const { config } = action.payload;
  const childType = folderReducer.folderType[config.type].childsType;
  const isEnableOrgFolder = includes(config.showingType, 'org');
  const isEnableOwnerFolder = includes(config.showingType, 'owner');
  yield put(folderReducer.initConfig({
    ...config,
    isEnableOrgFolder,
    isEnableOwnerFolder
  }));
  yield put(folderReducer.initRootFolderStart());
  const rootFolderResponse = yield getRootFolder(action);
  if (isEmpty(rootFolderResponse)) {
    return;
  }
  const orgRootFolder = isEnableOrgFolder
    ? [get(rootFolderResponse, ['data', 'rootFolders', 0], {})] : [];
  const ownerRootFolder = isEnableOwnerFolder
    ? [get(rootFolderResponse, ['data', 'rootFolders', 1], {})] : [];

  const rootFolderReprocess = [...orgRootFolder, ...ownerRootFolder]
    .map(rootFolder => {
      const childFolderCounts = get(rootFolder, 'childFolders.count', 0);
      const childContentCounts = get(rootFolder, [childType, 'count'], 0);
      let folderName = includes(rootFolder.name, config.type) ?
        folderReducer.folderType[config.type].orgFolderName :
        folderReducer.folderType[config.type].ownerFolderName;
      return {
        ...rootFolder,
        id: rootFolder.id,
        name: folderName,
        contentType: 'folder',
        parentId: null,
        hasContent: childFolderCounts > 0 || childContentCounts > 0,
        childs: []
      }
    });
  const rootFolderId = [...orgRootFolder, ...ownerRootFolder].map(folder => folder.id);
  yield all(rootFolderId.map(rootFolderId => {
    return put(folderReducer.fetchMore(rootFolderId, true));
  }));
  yield put(folderReducer.initRootFolderSuccess(rootFolderReprocess, rootFolderId));
}

function* getRootFolder(action) {
  const { config } = action.payload;
  const { type, isEnableShowContent } = config;
  const initialOffset = 0;
  const childType = folderReducer.folderType[config.type].childsType;
  const query = `query rootFolders($type: RootFolderType){
      rootFolders(type: $type){
        id
        name
        treeObjectId
        childFolders{
          count
        }
        ${isEnableShowContent ? `${childType}{
          count
        }` : ""}
      }
    }`;

  function* getRootFolder(offset) {
    if (!Number.isInteger(parseInt(offset))) {
      return yield put(folderReducer.initRootFolderError(error));
    }
    const variables = {
      type,
      limit: 30,
      offset: offset
    }
    const { error, response } = yield call(handleRequest, { query, variables });
    if (error) {
      yield put(folderReducer.initRootFolderError(error));
      return {};
    }
    return response;
  }
  return yield getRootFolder(initialOffset);
}

function* initFolderSagas(action) {
  const { folderId } = action.payload;
  return yield initFolderFn(folderId);
}

function* initFolderFn(folderId) {
  const { type, isEnableShowContent } = yield select(folderSelector.config);
  const rootFolderIds = yield select(folderSelector.rootFolderIds);
  const childType = folderReducer.folderType[type].childsType;
  const query = `query folder($id: ID!){
      folder(id: $id){
        id
        name
        treeObjectId
        parent{
          id
        }
        childFolders{
          count
        }
        ${isEnableShowContent ? `${childType}{
          count
        }` : ""}
      }
    }`;
  const variables = {
    id: folderId
  }
  const { error, response } = yield call(handleRequest, { query, variables });
  if (error) {
    yield put(folderReducer.initFolderError(folderId));
    return {};
  }
  const rootName = folderReducer.folderType[type].orgFolderName
  const folder = get(response, 'data.folder', {});
  const childFolderCounts = get(folder, 'childFolders.count', 0);
  const childContentCounts = get(folder, [childType, 'count'], 0);
  const childsList = yield fetchMore(folderId);
  const folderReprocess = {
    ...folder,
    contentType: 'folder',
    parentId: folder.parent ? folder.parent.id : null,
    hasContent: childFolderCounts > 0 || childContentCounts > 0,
    name: includes(rootFolderIds, folderId) ? rootName : folder.name,
    childs: childsList.map(item => item.id)
  }
  yield put(folderReducer.initFolderSuccess(folderReprocess));
}

function* initFolderFromApp(action) {
  const { folderId } = action.payload;
  const { selectable, workSpace } = yield select(folderSelector.config);
  const folderExpanded = yield select(folderSelector.folderExpanded);
  yield put(folderReducer.initFolderFromAppStart(folderId));
  const data = yield initAllParent(folderId);
  const folderFromRoot = uniq(data.reverse().filter(item => !includes(folderExpanded, item)));
  for (const folderIdForInit of folderFromRoot) {
    yield expandFolderInFunction(folderIdForInit, selectable, workSpace);
  }
}

function* initAllParent(folderId) {
  const query = `query folder($id: ID!){
    folder(id: $id){
      id
      name
      parent{
        id
      }
    }
  }`;
  const variables = {
    id: folderId
  }
  const { error, response } = yield call(handleRequest, { query, variables });
  if (error) {
    yield put(folderReducer.initFolderFromAppError(folderId));
  }
  const parentId = get(response, 'data.folder.parent.id');
  if (parentId) {
    const expand = yield initAllParent(parentId);
    return [parentId, ...expand];
  }
  return [];
}
