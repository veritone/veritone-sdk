/* eslint-disable lodash/path-style */
import {
  call,
  all,
  takeEvery,
  put
} from 'redux-saga/effects';
import _ from 'lodash';
import { handleRequest } from './helper';
import * as folderReducer from './index';
export default function* initFolder() {
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