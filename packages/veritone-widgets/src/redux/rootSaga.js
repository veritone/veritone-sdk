import { fork, all } from 'redux-saga/effects';
// import userRootSaga from 'modules/user/sagas';

export default function* root() {
  yield all([
    // fork(userRootSaga)
  ]);
}
