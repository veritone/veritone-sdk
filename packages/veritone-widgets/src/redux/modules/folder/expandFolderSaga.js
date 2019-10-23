/* eslint-disable lodash/path-style */
import {
  call,
  takeEvery,
  put,
  select
} from 'redux-saga/effects';
import _ from 'lodash';
import { handleRequest } from './helper';
import * as folderReducer from './index';
import * as folderSelector from './selector';
export default function* expandFolder() {
  yield takeEvery(folderReducer.FETCH_MORE, function* (action) {
    const { folderId, isReload } = action.payload;
    const config = yield select(folderSelector.config);
    const rootFolderIds = yield select(folderSelector.rootFolderIds);
    if (_.includes(rootFolderIds, folderId) && !isReload) {
      return;
    }
    const { selectable } = config;
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
  const childType = type === 'cms'
    ? 'childTDOs'
    : type === 'watchlist' ? 'childWatchlists' : 'childCollections';
  const childContentType = isEnableShowContent
    ? (type === 'cms' ? 'tdo' : type === 'watchlist' ? 'watchlist' : 'collection')
    : '';
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
