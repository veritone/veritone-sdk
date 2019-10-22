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
  yield takeEvery(folderReducer.MODIFY_FOLDER, modifyFolder);
}
function* modifyFolder(action) {
  const {
    folderId,
    folderName,
    parentId
  } = action.payload;
  yield put(folderReducer.modifyFolderStart(folderId));
  const { type: rootFolderType } = yield select(folderSelector.config);
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
    treeObjectId, parent: oldParent,
    orderIndex: prevOrderIndex
  } = get(response, 'data.folder', {});
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
  if (!parentId) {
    const folder = get(responseEditName, 'data.updateFolder', {});
    yield put(folderReducer.modifyFolderSuccess({
      id: folder.id,
      name: folder.name
    }));
    yield put(folderReducer.fetchMore(oldParent.id, true));
  }
  else {
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
    const folder = get(moveRespone, 'data.moveFolder', {});
    yield put(folderReducer.modifyFolderSuccess({
      id: folder.id,
      name: folder.name
    }));
    yield put(folderReducer.fetchMore(oldParent.id, true));
    yield put(folderReducer.fetchMore(parentId, true));
  }
}
