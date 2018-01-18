import { fork, all } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
const { auth: { authRootSaga }} = modules;

import filePickerRootSaga from './modules/filePicker/filePickerSaga';

export default function* root() {
  yield all([fork(authRootSaga), fork(filePickerRootSaga)]);
}
