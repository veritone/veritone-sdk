/* eslint-disable lodash/path-style */
import {
  call,
  takeEvery,
  put,
  select
} from 'redux-saga/effects';
import includes from 'lodash/includes';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import { handleRequest } from '../helper';
import * as actions from '../actions';
import * as folderSelector from '../selector';
import { folderType } from '../reducer';
export default function* expandFolder() {
  yield takeEvery(actions.FETCH_MORE, function* (action) {
    const { folderId, isReload } = action.payload;
    const config = yield select(folderSelector.config);
    const rootFolderIds = yield select(folderSelector.rootFolderIds);
    const expandedFolder = yield select(folderSelector.folderExpanded);
    if (includes(rootFolderIds, folderId) && !isReload) {
      return;
    }
    if (includes(expandedFolder, folderId)) {
      return yield put(actions.initFolder(folderId));
    }
    const { selectable, workSpace } = config;
    return yield expandFolderInFunction(folderId, workSpace, selectable);
  });
}

export function* expandFolderInFunction(folderId, workSpace, selectable) {
  yield put(actions.fetchMoreStart(folderId));
  const folders = yield fetchMore(folderId);
  const folderReprocess = folders.map(folder => {
    const childs = get(folder, 'childFolders.records', []);
    return {
      ...folder,
      parentId: folder.parent.id,
      childs: childs.map(item => item.id)
    }
  });
  yield put(actions.fetchMoreSuccess(folderReprocess, folderId));
  const folderChildId = folderReprocess.map(folder => folder.id);
  const selected = yield select(folderSelector.selected);
  if (get(selected, [workSpace, folderId]) && selectable) {
    const newSelected = {
      ...get(selected, [workSpace], {}),
      ...folderChildId.reduce((accum, value) => ({
        ...accum,
        [value]: true
      }), {})
    }
    yield put(actions.selectFolder(workSpace, newSelected));
  }
}
export function* fetchMore(folderId) {
  const config = yield select(folderSelector.config);
  const {
    type,
    isEnableShowContent
  } = config;
  const initialOffset = 0;
  const pageSize = 30;
  let results = [];
  let contentResult = [];
  const childType = folderType[type].childsType;
  const childContentType = isEnableShowContent ? folderType[type].childs : '';
  const queryFolder = `query folder($id:ID!, $offset: Int, $limit: Int){
      folder(id: $id){
        id
        name
        parent{
          id
        }
        orderIndex
        treeObjectId
        childFolders(offset: $offset, limit: $limit){
          count
          records{
            id
            name
            typeId
            treeObjectId
            parent {
              id
            }
            orderIndex
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
        treeObjectId
        parent{
          id
        }
        ${childType}(offset: $offset, limit: $limit){
          count
          records{
            id
            name
            treeObjectId
          }
        }
      }
    }`
  function* getChildFolder(offset) {
    if (!Number.isInteger(parseInt(offset))) {
      return yield put(actions.initFolderError('Something wrong'));
    }
    const variables = {
      id: folderId,
      limit: pageSize,
      offset: offset
    }
    const { error, response } = yield call(handleRequest, { query: queryFolder, variables });
    if (error) {
      yield put(actions.initFolderError(error));
      return results;
    }
    const count = get(response, 'data.folder.childFolders.count', 0);
    const records = get(response, 'data.folder.childFolders.records', []);
    const recordsReprocess = records.map(item => {
      const childCount = get(item, ['childFolders', 'count'], 0);
      const childContentCount = get(item, [childType, 'count'], 0)
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
      yield put(actions.initFolderError('Something wrong'));
      return [];
    }
    const variables = {
      id: folderId,
      limit: pageSize,
      offset: offset
    }
    const { error, response } = yield call(handleRequest, { query: queryContent, variables });
    if (error) {
      yield put(actions.initFolderError(error));
      return contentResult;
    }
    const records = get(response, ['data', 'folder', childType, 'records'], []);
    const recordsReprocess = records.map(item => ({
      ...item,
      contentType: childContentType,
      parent: {
        id: folderId
      }
    }));
    const count = get(response, ['data', 'folder', childType, 'count'], 0);
    contentResult = contentResult.concat(recordsReprocess);
    if (count === pageSize) {
      return yield getChildFolder(offset + pageSize);
    } else {
      return contentResult;
    }
  }
  const childFolder = yield getChildFolder(initialOffset);
  const childFolderSorted = orderBy(childFolder, [folder => folder.name.toLowerCase(), 'orderIndex'], ['asc', 'asc']);
  const childContent = yield getChildContent(initialOffset);
  const childContentSorted = orderBy(childContent, [content => content.name.toLowerCase()], ['asc']);
  return [...childFolderSorted, ...childContentSorted];
}
