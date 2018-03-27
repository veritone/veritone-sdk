import { fork, all } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
const { auth: { authRootSaga } } = modules;

import appRootSaga from './modules/veritoneApp/saga';
import filePickerRootSaga from './modules/filePicker/filePickerSaga';
import mediaDetailsSaga from './modules/mediaDetails/saga';

export default function* root() {
  yield all([
    fork(authRootSaga),
    fork(filePickerRootSaga),
    fork(appRootSaga),
    fork(mediaDetailsSaga)
  ]);
}
