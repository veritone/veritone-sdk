import { fork, all } from 'redux-saga/effects';

import { formSaga } from './forms/saga';
import { formLocationsSaga } from './formLocations/saga';

export default function* formBuilderSaga() {
  yield all([
    fork(formSaga),
    fork(formLocationsSaga)
  ])
}
