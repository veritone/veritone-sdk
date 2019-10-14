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
    const childType = config.type === 'cms'
      ? 'childTDOs'
      : config.type === 'watchlist'
        ? 'childWatchlists'
        : 'childCollections';
    yield put(folderReducer.initConfig(config));
    yield put(folderReducer.initFolderStart());
    const rootFolderResponse = yield getRootFolder(action);
    if (_.isEmpty(rootFolderResponse)) {
      return;
    }
    const rootFolders = config.type !== 'watchlist'
      ? [_.get(rootFolderResponse, ['data', 'rootFolders', 0], {})]
      : _.get(rootFolderResponse, ['data', 'rootFolders'], []);
    const rootFolderReprocess = rootFolders.map(rootFolder => {
      const childFolderCounts = _.get(rootFolder, 'childFolders.count', 0);
      const childContentCounts = _.get(rootFolder, [childType, 'count'], 0);
      let folderName = _.includes(rootFolder.name, config.type) ?
        (config.type === 'cms' ? 'My organization' : `Org ${config.type}`) :
        `My ${config.type}`;
      return {
        id: rootFolder.id,
        name: folderName,
        contentType: 'folder',
        parentId: null,
        hasContent: childFolderCounts > 0 || childContentCounts > 0,
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
  const { type, isEnableShowContent } = config;
  const initialOffset = 0;
  const childType = type === 'cms' ? 'childTDOs' : type === 'watchlist' ? 'childWatchlists' : 'childCollections';
  const query = `query rootFolders($type: RootFolderType){
    rootFolders(type: $type){
      id
      name
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
    const config = yield select(folderSelector.config);
    const { selectable } = config;
    const expandedFolder = yield select(folderSelector.folderExpanded);
    if (_.includes(expandedFolder, folderId)) {
      return;
    }
    const folders = yield fetchMore(action);
    const folderReprocess = folders.map(folder => {
      const childs = _.get(folder, 'childFolders.records', []);
      return {
        ...folder,
        parentId: folder.parent.id,
        childs: childs.map(item => item.id)
      }
    });
    yield put(folderReducer.fetchMoreSuccess(folderReprocess, folderId));
    const folderChildId = folderReprocess.map(folder => folder.id);
    const selected = yield select(folderSelector.selected);
    if (selected[folderId] && selectable) {
      const newSelected = {
        ...selected,
        ...folderChildId.reduce((accum, value) => ({
          ...accum,
          [value]: true
        }), {})
      }
      yield put(folderReducer.selectFolder(newSelected));
    }
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

function* searchFolder() {
  yield takeEvery(folderReducer.INIT_FOLDER, function* (action) { });
}

export default function* root() {
  yield all([
    fork(initFolder),
    fork(expandFolder),
    fork(searchFolder)
  ])
}