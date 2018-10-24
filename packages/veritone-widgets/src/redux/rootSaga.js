import { fork, all } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
const {
  auth: { authRootSaga }
} = modules;

import appRootSaga from './modules/veritoneApp/saga';
import filePickerRootSaga from './modules/filePicker/filePickerSaga';
import engineSelectionRootSaga from './modules/engineSelection/saga';
import engineOutputExportSaga from './modules/engineOutputExport/saga';
import editProfileRootSaga from './modules/userProfile/saga';

export default function* root() {
  yield all([
    fork(authRootSaga),
    fork(filePickerRootSaga),
    fork(appRootSaga),
    fork(engineSelectionRootSaga),
    fork(engineOutputExportSaga),
    fork(editProfileRootSaga)
  ]);
}
