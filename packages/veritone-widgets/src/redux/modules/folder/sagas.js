/* eslint-disable lodash/path-style */
import {
  fork,
  all
} from 'redux-saga/effects';
import expandFolderSaga from './expandFolderSaga';
import initFolderSaga from './initFolderSaga';
import createFolderSaga from './createFolderSagas';
import deleteFolderSaga from './deleteFolderSaga';
import modifyFolderSaga from './editFolderSaga';
import searchFolderSaga from './searchFolderSaga';

export default function* root() {
  yield all([
    fork(initFolderSaga),
    fork(expandFolderSaga),
    fork(searchFolderSaga),
    fork(createFolderSaga),
    fork(deleteFolderSaga),
    fork(modifyFolderSaga)
  ])
}
