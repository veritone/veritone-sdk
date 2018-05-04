import { fork, all } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
const {
  auth: { authRootSaga }
} = modules;

import appRootSaga from './modules/veritoneApp/saga';
import filePickerRootSaga from './modules/filePicker/filePickerSaga';

export default function* root() {
  yield all([fork(authRootSaga), fork(filePickerRootSaga), fork(appRootSaga)]);
}
