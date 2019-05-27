import { call, put, takeEvery, select, fork, all } from 'redux-saga/effects';
import service from './service';

import {
  OPEN_FOLDER,
  TRIGGER_PAGGINATION,
  fetchRootFolder,
  fetchRootFolderSuccess,
  fetchFolder,
  fetchFolderSuccess
} from './';

import { getFolderDetail } from './selector';

// 2 saga workers here

function* watchOpenFolder() {
  yield takeEvery(OPEN_FOLDER, function* ({ payload: { id, name } }) {
    if (!id) {
      yield call(openRootFolder);
    } else {
      yield call(openChildFolder, { id, name });
    }
  })
}

function* watchTriggerPagination() {
  yield takeEvery(TRIGGER_PAGGINATION, function* ({ payload: { id } }) {
    yield call(loadFolder, id);
  })
}

function* openRootFolder() {
  yield put(fetchRootFolder())
  const rootFolders = yield call(service.getRootFolder);
  const sharedFolder = rootFolders.data.filter(({ ownerId }) => !ownerId)[0];
  yield put(fetchRootFolderSuccess(sharedFolder));
  const { id } = sharedFolder;
  const folderDetailSelector = getFolderDetail(id);
  const { isLoaded } = yield select(folderDetailSelector);
  if (!isLoaded) {
    yield call(loadFolder, id)
  }
}

function* openChildFolder({ id, name }) {
  yield put({ type: OPEN_FOLDER, payload: { id, name } });
  const folderDetailSelector = getFolderDetail(id);
  const { isLoaded } = yield select(folderDetailSelector);
  if (!isLoaded) {
    yield call(loadFolder, id)
  }
}

function* loadFolder(id) {
  const folderDetailSelector = getFolderDetail(id);
  const { childFolders = [], childTDOs = [] } = yield select(folderDetailSelector);
  yield put(fetchFolder(id))
  const folderData = yield call(service.loadFolder, id, childFolders.length, childTDOs.length);
  yield put(fetchFolderSuccess(folderData));
}

export function* folderSaga() {
  yield all[
    fork(watchOpenFolder),
    fork(watchTriggerPagination)
  ]
}