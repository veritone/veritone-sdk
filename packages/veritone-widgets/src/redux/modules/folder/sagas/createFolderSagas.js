import {
  call,
  takeEvery,
  put,
  select
} from 'redux-saga/effects';
import get from 'lodash/get';
import { handleRequest } from '../helper';
import * as actions from '../actions';
import * as folderSelector from '../selector';
import { showNotification } from '../../notifications';
export default function* createFolderSaga() {
  yield takeEvery(actions.CREATE_FOLDER, createFolder);
}

function* createFolder(action) {
  yield put(actions.createFolderStart());
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
    yield put(actions.createFolderError());
    yield put(showNotification("Cannot create the folder"));
  }
  const newFolderId = get(response, 'data.createFolder.id');
  yield put(actions.initFolder(newFolderId));
  yield put(actions.initFolder(parentId));
  return put(actions.createFolderSuccess());
}
