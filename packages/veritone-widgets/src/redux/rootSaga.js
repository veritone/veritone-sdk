import { fork, all } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
const {
  auth: { authRootSaga }
} = modules;

import appRootSaga from './modules/veritoneApp/saga';

export default function* root() {
  yield all([fork(authRootSaga), fork(appRootSaga)]);
}
