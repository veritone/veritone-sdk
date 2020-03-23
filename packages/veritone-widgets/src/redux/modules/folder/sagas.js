/* eslint-disable lodash/path-style */
import {
  fork,
  all
} from 'redux-saga/effects';
import expandFolderSaga from './sagas/expandFolderSaga';
import initFolderSaga from './sagas/initFolderSaga';
import createFolderSaga from './sagas/createFolderSagas';
import deleteFolderSaga from './sagas/deleteFolderSaga';
import modifyFolderSaga from './sagas/editFolderSaga';
import searchFolderSaga from './sagas/searchFolderSaga';

export function* folderSaga() {
  yield all([
    fork(initFolderSaga),
    fork(expandFolderSaga),
    fork(searchFolderSaga),
    fork(createFolderSaga),
    fork(deleteFolderSaga),
    fork(modifyFolderSaga)
  ])
}

export default folderSaga;
