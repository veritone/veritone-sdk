import { fork, all } from 'redux-saga/effects';
import oauthRootSaga from './sagas/oauth';

export default function* root() {
  yield all([fork(oauthRootSaga)]);
}
