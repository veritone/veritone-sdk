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
import { handleRequest } from '../helper';
import { fetchMore, expandFolderInFunction } from '../sagas/expandFolderSaga';
import * as folderSelector from '../selector';
import * as actions from '../actions';
import { folderType } from '../reducer';
export default function* initFolder() {
  yield all([
    takeEvery(actions.INIT_ROOT_FOLDER, initRootFolderSagas),
    takeEvery(actions.INIT_FOLDER, initFolderSagas),
    takeEvery(actions.INIT_FOLDER_FROM_APP, initFolderFromApp),
  ])
}

function* initRootFolderSagas(action) {
  const { config } = action.payload;
  const childType = folderType[config.type].childsType;
  const isEnableOrgFolder = includes(config.showingType, 'org');
  const isEnableOwnerFolder = includes(config.showingType, 'owner');
  yield put(actions.initConfig({
    ...config,
    isEnableOrgFolder,
    isEnableOwnerFolder
  }));
  yield put(actions.initRootFolderStart());
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
        folderType[config.type].orgFolderName :
        folderType[config.type].ownerFolderName;
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
    return put(actions.fetchMore(rootFolderId, true));
  }));
  yield put(actions.initRootFolderSuccess(rootFolderReprocess, rootFolderId));
}

function* getRootFolder(action) {
  const { config } = action.payload;
  const { type, isEnableShowContent } = config;
  const initialOffset = 0;
  const childType = folderType[config.type].childsType;
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
      return yield put(actions.initRootFolderError(error));
    }
    const variables = {
      type,
      limit: 30,
      offset: offset
    }
    const { error, response } = yield call(handleRequest, { query, variables });
    if (error) {
      yield put(actions.initRootFolderError(error));
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
  const childType = folderType[type].childsType;
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
    yield put(actions.initFolderError(folderId));
    return {};
  }
  const rootName = folderType[type].orgFolderName
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
  yield put(actions.initFolderSuccess(folderReprocess));
}

function* initFolderFromApp(action) {
  const { folderId } = action.payload;
  const { selectable, workSpace } = yield select(folderSelector.config);
  const folderExpanded = yield select(folderSelector.folderExpanded);
  yield put(actions.initFolderFromAppStart(folderId));
  const data = yield initAllParent(folderId);
  const folderFromRoot = [
    ...uniq(data.reverse().filter(item => !includes(folderExpanded, item))),
    folderId
  ];
  for (const folderIdForInit of folderFromRoot) {
    yield expandFolderInFunction(folderIdForInit, selectable, workSpace);
  }
  if (selectable) {
    yield put(actions.selectAllFolder(workSpace));
  } else {
    yield put(actions.selectFolder(workSpace, {
      [folderId]: true
    }));
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
    yield put(actions.initFolderFromAppError(folderId));
  }
  const parentId = get(response, 'data.folder.parent.id');
  if (parentId) {
    const expand = yield initAllParent(parentId);
    return [parentId, ...expand];
  }
  return [];
}
