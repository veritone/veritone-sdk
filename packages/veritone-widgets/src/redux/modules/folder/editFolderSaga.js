import {
  call,
  takeEvery,
  put,
  select
} from 'redux-saga/effects';
import { get } from 'lodash';
import { handleRequest } from './helper';
import * as folderReducer from './index';
import * as folderSelector from './selector';
export default function* modifyFolderSaga() {
  yield takeEvery(folderReducer.EDIT_FOLDER, modifyFolder);
}
function* modifyFolder(action) {
  const {
    folderId,
    folderName,
    isEditName,
    isMoveFolder,
    parentId
  } = action.payload;
  let folder;
  yield put(folderReducer.modifyFolderStart(folderId));
  const { type: rootFolderType } = yield select(folderSelector.config);
  //get tree object and parent tree object
  const queryFolder = `query folder($id:ID!){
    folder(id: $id){
      id
      name
      orderIndex
      parent{
        id
        treeObjectId
      }
      treeObjectId
    }
  }`;
  const variablesFolder = {
    id: folderId
  }
  const { error, response } = yield call(handleRequest, {
    query: queryFolder,
    variables: variablesFolder
  });
  if (error) {
    return yield put(folderReducer.deleteFolderError(folderId));
  }
  const {
    treeObjectId,
    parent: oldParent,
    orderIndex: prevOrderIndex
  } = get(response, 'data.folder', {});
  //edit name
  if (isEditName) {
    const updateNameQuery = `
    mutation updateFolder($id: ID!, $name: String!){
      updateFolder(input: {
        id: $id,
        name: $name,
      }) {
        id
        treeObjectId
        name,
        parent {
          id
        }
      }
    }
  `
    const variables = {
      name: folderName,
      id: treeObjectId
    }
    const {
      error: errorEditName,
      response: responseEditName
    } = yield call(handleRequest, {
      query: updateNameQuery,
      variables
    });
    if (errorEditName) {
      yield put(folderReducer.modifyFolderError(folderId));
    }
    folder = get(responseEditName, 'data.updateFolder', {});
    yield put(folderReducer.modifyFolderSuccess({
      id: folder.id,
      name: folder.name
    }));
  }
  //move folder
  if (isMoveFolder) {
    const newParentVariables = {
      id: parentId
    }
    const {
      error: newParentError,
      response: newParentResponse
    } = yield call(handleRequest, {
      query: queryFolder,
      variables: newParentVariables
    });
    if (newParentError) {
      return yield put(folderReducer.deleteFolderError(folderId));
    }
    const { treeObjectId: newParentTreeObjectId } = get(newParentResponse, 'data.folder', {});
    const { treeObjectId: prevParentTreeObjectId } = oldParent;
    const moveQuery = `
      mutation moveFolder(
        $treeObjectId: ID!,
        $prevParentTreeObjectId: ID!
        $newParentTreeObjectId: ID!
        $newOrderIndex: Int!
        $prevOrderIndex: Int!
        $rootFolderType: RootFolderType
        ){
        moveFolder(input: {
          treeObjectId: $treeObjectId,
          newParentTreeObjectId: $newParentTreeObjectId,
          prevParentTreeObjectId: $prevParentTreeObjectId,
          newOrderIndex: $newOrderIndex,
          prevOrderIndex: $prevOrderIndex
          rootFolderType: $rootFolderType
        }) {
          id
          orderIndex
          name
          modifiedDateTime
          parent {
            id
            treeObjectId
          }
        }
      }
    `
    const moveVariables = {
      rootFolderType,
      treeObjectId,
      newParentTreeObjectId,
      prevParentTreeObjectId,
      prevOrderIndex,
      newOrderIndex: 0
    }
    const { error: moveError, response: moveRespone } = yield call(handleRequest, {
      query: moveQuery,
      variables: moveVariables
    });
    if (moveError) {
      return yield put(folderReducer.modifyFolderError(folderId));
    }
    folder = get(moveRespone, 'data.moveFolder', {});
    yield put(folderReducer.modifyFolderSuccess({
      id: folder.id,
      name: folder.name
    }));
    yield put(folderReducer.fetchMore(oldParent.id, true));
    yield put(folderReducer.fetchMore(parentId, true));
  }
  yield put(folderReducer.fetchMore(oldParent.id, true));
}
