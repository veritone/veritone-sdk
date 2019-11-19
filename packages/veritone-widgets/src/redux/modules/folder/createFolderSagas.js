import {
  call,
  takeEvery,
  put,
  select
} from 'redux-saga/effects';
import get from 'lodash/get';
import { handleRequest } from './helper';
import * as folderReducer from './index';
import * as folderSelector from './selector';
export default function* createFolderSaga() {
  yield takeEvery(folderReducer.CREATE_FOLDER, createFolder);
}

function* createFolder(action) {
  yield put(folderReducer.createFolderStart());
  const {
    name,
    parentId
  } = action.payload;
  const { type: rootFolderType } = yield select(folderSelector.config);
  const query = `
    mutation createFolder($name: String!, $description: String!, $parentId: ID!, $rootFolderType: RootFolderType){
      createFolder(input:{
        name: $name,
        description: $description,
        parentId: $parentId,
        rootFolderType: $rootFolderType
      }){
        id
        name
      }
    }`
  const variables = {
    name,
    parentId,
    rootFolderType,
    description: ''
  }
  const { error, response } = yield call(handleRequest, { query, variables });
  if (error) {
    yield put(folderReducer.createFolderError());
  }
  const newFolderId = get(response, 'data.createFolder.id');
  yield put(folderReducer.initFolder(newFolderId));
  yield put(folderReducer.initFolder(parentId));
  return put(folderReducer.createFolderSuccess());
}
