import { fork, all } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
const {
  auth: { authRootSaga }
} = modules;

import appRootSaga from './modules/veritoneApp/saga';
import filePickerRootSaga from './modules/filePicker/filePickerSaga';
import dataPickerRootSaga from './modules/dataPicker/dataPickerSaga';
import engineSelectionRootSaga from './modules/engineSelection/saga';
import engineOutputExportSaga from './modules/engineOutputExport/saga';
import editProfileRootSaga from './modules/userProfile/saga';
import folderTreeSaga from './modules/folder/sagas';

export default function* root() {
  yield all([
    fork(authRootSaga),
    fork(filePickerRootSaga),
    fork(dataPickerRootSaga),
    fork(appRootSaga),
    fork(engineSelectionRootSaga),
    fork(engineOutputExportSaga),
    fork(editProfileRootSaga),
    fork(folderTreeSaga)
  ]);
}
