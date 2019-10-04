/* eslint-disable lodash/path-style */
import {
  fork,
  call,
  all,
  takeEvery,
  put
} from 'redux-saga/effects';
import _ from 'lodash';
import { handleRequest } from './helper';
import * as folderReducer from './index';

function* initFolder() {
  yield takeEvery(folderReducer.INIT_FOLDER, function* (action) {
    yield put(folderReducer.initFolderStart());
    const rootFolderResponse = yield getRootFolder(action);
    if (_.isEmpty(rootFolderResponse)) {
      return;
    }
    const rootFolder = _.get(rootFolderResponse, 'data.rootFolders', []);
    const childFolder = _.get(rootFolderResponse, ['data', 'rootFolders', 0, 'childFolders', 'records'], []);
    const rootFolderConvert = rootFolder.map(item => {
      const childs = _.get(item, 'childFolders.records', []);
      return {
        id: item.id,
        name: item.name,
        contentType: 'folder',
        childs: childs.map(item => item.id)
      }
    });
    const childFolderConvert = childFolder.map(child => {
      const childs = _.get(child, 'childFolders.records', []);
      return {
        id: child.id,
        name: child.name,
        contentType: 'folder',
        parentId: child.parent.id,
        childs: childs.map(item => item.id)
      }
    });
    const rootFolderId = rootFolder.map(folder => folder.id);
    yield put(folderReducer.initFolderSuccess([...rootFolderConvert, ...childFolderConvert], rootFolderId));
  });
}

function* getRootFolder(action) {
  const { type } = action.payload;
  const query = `query rootFolders($type: RootFolderType){
    rootFolders(type: $type){
      id
      name
      childFolders(limit: 999){
        count
        records{
          id
          name
          parent {
            id
          }
          childFolders(limit: 999){
            count
            records{
              id
              name
              parent {
                id
              }
              
            }
          }
        }
      }
    }
  }`;
  const variables = {
    type
  }

  const { error, response } = yield call(handleRequest, { query, variables });
  if (error) {
    yield put(folderReducer.initFolderError(error));
    return {};
  }
  return response;
}

function* expandFolder() {
  yield takeEvery(folderReducer.FETCH_MORE, function* (action) {
    const rootFolderResponse = yield fetchMore(action);
  })
}

function* fetchMore(action) {

}

export default function* root() {
  yield all([
    fork(initFolder),
    fork(expandFolder)
  ])
}