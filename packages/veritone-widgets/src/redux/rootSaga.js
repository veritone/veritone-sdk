import { fork, all } from 'redux-saga/effects';
import oauthRootSaga from './modules/oauth/oauthSaga';
import filePickerRootSaga from './modules/filePicker/filePickerSaga';

export default function* root() {
  yield all([fork(oauthRootSaga), fork(filePickerRootSaga)]);
}
