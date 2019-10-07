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
  const { type } = action.payload;
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
    // console.log(currentFolder);
    const folders = yield fetchMore(action)
    const folderReprocess = folders.map(folder => {
      const childCounts = _.get(folder, 'childFolders.count', []);
      const childs = _.get(folder, 'childFolders.records', []);
      return {
        id: folder.id,
        name: folder.name,
        contentType: 'folder',
        parentId: folder.parent.id,
        hasContent: childCounts > 0,
        childs: childs.map(item => item.id)
      }
    });
    yield put(folderReducer.fetchMoreSuccess(folderReprocess, folderId));
  });
}

function* fetchMore(action) {
  const { folderId } = action.payload;
  console.log('fetchmore');
  const initialOffset = 0;
  const pageSize = 30;
  let results = [];
  const rootFolderIds = yield select(folderSelector.rootFolderIds);
  // if (_.includes(rootFolderIds, folderId)) {
  //   return [];
  // }
  yield put(folderReducer.fetchMoreStart(folderId));
  const query = `query folder($id:ID!, $offset: Int, $limit: Int){
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
        }
      }
    }
  }`
  function* getChildFolder(offset) {
    if (!Number.isInteger(parseInt(offset))) {
      return yield put(folderReducer.initFolderError(error));
    }
    const variables = {
      id: folderId,
      limit: 30,
      offset: offset
    }
    const { error, response } = yield call(handleRequest, { query, variables });
    if (error) {
      yield put(folderReducer.initFolderError(error));
      return results;
    }
    console.log('response', response);
    const records = _.get(response, 'data.folder.childFolders.records', []);
    const count = _.get(response, 'data.folder.childFolders.count', 0);
    results = results.concat(records);
    if (count === pageSize) {
      return yield getChildFolder(offset + pageSize);
    } else {
      return results;
    }
  }
  return yield getChildFolder(initialOffset);
}

export default function* root() {
  yield all([
    fork(initFolder),
    fork(expandFolder)
  ])
}