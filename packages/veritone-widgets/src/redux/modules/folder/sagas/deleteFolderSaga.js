import {
  all,
  call,
  takeEvery,
  put,
  select
} from 'redux-saga/effects';
import get from 'lodash/get';
import omit from 'lodash/omit';
import includes from 'lodash/includes';

import { handleRequest } from '../helper';
import * as actions from '../actions';
import * as folderSelector from '../selector';
import { folderType } from '../reducer';
import { showNotification } from '../../notifications';

export default function* deleteFolderSaga() {
  yield takeEvery(actions.DELETE_FOLDER, deleteFolder);
}

function* deleteFolder(action) {
  const { folderId, workSpace } = action.payload;
  const { type: folderRootType } = yield select(folderSelector.config);
  const { childsType, deleteContent } = folderType[folderRootType];
  yield put(actions.deleteFolderStart(folderId));
  const folderSelected = yield select(folderSelector.selected);
  const { selectable } = yield select(folderSelector.config);
  const rootIds = yield select(folderSelector.rootFolderIds);
  const queryFolder = `query folder($id:ID!){
    folder(id: $id){
      id
      name
      orderIndex
      parent {
        id
      }
      treeObjectId
    }
  }`;
  const variablesFolder = {
    id: folderId
  }
  const { error, response } = yield call(handleRequest,
    {
      query: queryFolder,
      variables: variablesFolder
    }
  );
  if (error) {
    return yield put(actions.deleteFolderError(folderId));
  }
  const { orderIndex, parent, treeObjectId } = get(response, 'data.folder', {});
  const { childContents, childFolders } = yield getAllContent(folderId, childsType);
  if (childContents.length) {
    const deleteContentQuery = `
    mutation ${deleteContent}($id: ID!){
      ${deleteContent}(id: $id) {
        id
      }
    }`;
    yield all(childContents.map(content =>
      call(handleRequest, { query: deleteContentQuery, variables: { id: content.id } }))
    );
  }
  const query = `
    mutation deleteFolder($id: ID!,$orderIndex: Int! ){
      deleteFolder(input:{
        id: $id,
        orderIndex: $orderIndex
      })
      {
        id
      }
    }
  `
  const variables = {
    id: treeObjectId,
    orderIndex
  }
  const { error: errorDelete } = yield call(handleRequest, { query, variables });
  if (errorDelete) {
    yield put(actions.deleteFolderError(folderId));
    yield put(showNotification("Cannot delete the folder"));
  }
  yield put(actions.initFolder(parent.id));
  const folderSelectedIds = Object.keys(get(folderSelected, [workSpace], {}));
  const deletedFolderIds = [...childFolders.map(item => item.id), folderId];
  if (!selectable) {
    if (includes(deletedFolderIds, get(folderSelectedIds, 0))) {
      yield put(actions.selectFolder(workSpace, {
        [rootIds[0]]: true
      }))
    }
  } else {
    const newSelected = omit(folderSelected, [...deletedFolderIds]);
    yield put(actions.selectFolder(workSpace, newSelected));
  }
  yield put(actions.deleteFolderSuccess(folderId, parent.id));
  yield put(showNotification("Delete folder successful"));
  return yield put(actions.updateSearchData());
}

function* getAllContent(folderId, childsType) {
  let contentArr = [];
  let folderArr = [];
  function* getContents(currentId) {
    const queryFolder = `query folder($id:ID!){
      folder(id: $id){
        id
        name
        orderIndex
        parent {
          id
        }
        treeObjectId
        childFolders(offset: 0, limit: 999) {
          records {
            id
            name
          }
        }
        ${childsType}(limit: 999) {
          records {
            id
            name
          }
        }
      }
    }`;
    const variablesFolder = {
      id: currentId
    }
    const { error, response } = yield call(handleRequest,
      {
        query: queryFolder,
        variables: variablesFolder
      }
    );
    if (error) {
      return [];
    }
    const childFolders = get(response, 'data.folder.childFolders.records', []);
    const childContents = get(response, ['data', 'folder', childsType, 'records'], []);
    if (childFolders.length > 0) {
      yield all(childFolders.map(folder =>
        getContents(folder.id, childsType))
      );
    }
    contentArr = contentArr.concat(childContents);
    folderArr = folderArr.concat(childFolders);
  }
  yield getContents(folderId);
  return {
    childContents: contentArr,
    childFolders: folderArr
  };
}
