/* eslint-disable lodash/path-style */
import {
  fork,
  call,
  all,
  takeEvery,
  put,
  select
} from 'redux-saga/effects';
import _ from 'lodash';
import { handleRequest } from './helper';
import * as folderReducer from './index';
import * as folderSelector from './selector';

function* initFolder() {
  yield takeEvery(folderReducer.INIT_FOLDER, function* (action) {
    const { config } = action.payload;
    yield put(folderReducer.initConfig(config));
    yield put(folderReducer.initFolderStart());
    const rootFolderResponse = yield getRootFolder(action);
    if (_.isEmpty(rootFolderResponse)) {
      return;
    }
    // console.log(object)
    const rootFolders = _.get(rootFolderResponse, 'data.rootFolders', []);
    const rootFolderReprocess = rootFolders.map(rootFolder => {
      const childCounts = _.get(rootFolder, 'childFolders.count', []);
      return {
        id: rootFolder.id,
        name: rootFolder.name,
        contentType: 'folder',
        parentId: null,
        hasContent: childCounts > 0,
        childs: []
      }
    });
    const rootFolderId = rootFolders.map(folder => folder.id);
    yield put(folderReducer.initFolderSuccess(rootFolderReprocess, rootFolderId));
    yield all(rootFolderId.map(rootFolderId => {
      return put(folderReducer.fetchMore(rootFolderId));
    }));
  });
}

function* getRootFolder(action) {
  const { config } = action.payload;
  const { type } = config;
  const initialOffset = 0;
  const query = `query rootFolders($type: RootFolderType){
    rootFolders(type: $type){
      id
      name
      childFolders{
        count
      }
    }
  }`;

  function* getRootFolder(offset) {
    if (!Number.isInteger(parseInt(offset))) {
      return yield put(folderReducer.initFolderError(error));
    }
    const variables = {
      type,
      limit: 30,
      offset: offset
    }
    const { error, response } = yield call(handleRequest, { query, variables });
    if (error) {
      yield put(folderReducer.initFolderError(error));
      return {};
    }
    return response;
  }
  return yield getRootFolder(initialOffset);
}

function* expandFolder() {
  yield takeEvery(folderReducer.FETCH_MORE, function* (action) {
    const { folderId } = action.payload;
    const expandedFolder = yield select(folderSelector.folderExpanded);
    if (_.includes(expandedFolder, folderId)) {
      return;
    }
    const folders = yield fetchMore(action)
    const folderReprocess = folders.map(folder => {
      const childs = _.get(folder, 'childFolders.records', []);
      return {
        ...folder,
        parentId: folder.parent.id,
        childs: childs.map(item => item.id)
      }
    });
    yield put(folderReducer.fetchMoreSuccess(folderReprocess, folderId));
  });
}

function* fetchMore(action) {
  const { folderId } = action.payload;
  const config = yield select(folderSelector.config);
  const {
    type,
    isEnableShowContent
  } = config;
  const initialOffset = 0;
  const pageSize = 30;
  let results = [];
  let contentResult = [];
  yield put(folderReducer.fetchMoreStart(folderId));
  const childType = type === 'cms' ? 'childTDOs' : type === 'watchlist' ? 'childWatchlists' : 'childCollections';
  const childContentType = isEnableShowContent ? (type === 'cms' ? 'tdo' : type === 'watchlist' ? 'watchlist' : 'collection') : '';
  const queryFolder = `query folder($id:ID!, $offset: Int, $limit: Int){
    folder(id: $id){
      id
      name
      parent{
        id
      }
      childFolders(offset: $offset, limit: $limit){
        count
        records{
          id
          name
          typeId
          parent {
            id
          }
          childFolders{
            count
          }
          ${isEnableShowContent ? `${childType}{
            count
          }` : ""}
        }
      }
    }
  }`

  const queryContent = `query folder($id:ID!, $offset: Int, $limit: Int){
    folder(id: $id){
      id
      name
      parent{
        id
      }
      ${childType}(offset: $offset, limit: $limit){
        count
        records{
          id
          name
        }
      }
    }
  }`
  function* getChildFolder(offset) {
    if (!Number.isInteger(parseInt(offset))) {
      return yield put(folderReducer.initFolderError('Something wrong'));
    }
    const variables = {
      id: folderId,
      limit: pageSize,
      offset: offset
    }
    const { error, response } = yield call(handleRequest, { query: queryFolder, variables });
    if (error) {
      yield put(folderReducer.initFolderError(error));
      return results;
    }
    const count = _.get(response, 'data.folder.childFolders.count', 0);
    const records = _.get(response, 'data.folder.childFolders.records', []);
    const recordsReprocess = records.map(item => {
      const childCount = _.get(item, ['childFolders', 'count'], 0);
      const childContentCount = _.get(item, [childType, 'count'], 0)
      return {
        ...item,
        hasContent: childCount > 0 || childContentCount > 0,
        contentType: 'folder'
      }
    })
    results = results.concat(recordsReprocess);
    if (count === pageSize) {
      return yield getChildFolder(offset + pageSize);
    } else {
      return results;
    }
  }
  function* getChildContent(offset) {
    if (!isEnableShowContent) {
      return [];
    }
    if (!Number.isInteger(parseInt(offset))) {
      yield put(folderReducer.initFolderError('Something wrong'));
      return [];
    }
    const variables = {
      id: folderId,
      limit: pageSize,
      offset: offset
    }
    const { error, response } = yield call(handleRequest, { query: queryContent, variables });
    if (error) {
      yield put(folderReducer.initFolderError(error));
      return contentResult;
    }
    const records = _.get(response, ['data', 'folder', childType, 'records'], []);
    const recordsReprocess = records.map(item => ({
      ...item,
      contentType: childContentType,
      parent: {
        id: folderId
      }
    }));
    const count = _.get(response, ['data', 'folder', childType, 'count'], 0);
    contentResult = contentResult.concat(recordsReprocess);
    if (count === pageSize) {
      return yield getChildFolder(offset + pageSize);
    } else {
      return contentResult;
    }
  }
  const childFolder = yield getChildFolder(initialOffset);
  const childContent = yield getChildContent(initialOffset);
  return [...childFolder, ...childContent];
}

export default function* root() {
  yield all([
    fork(initFolder),
    fork(expandFolder)
  ])
}