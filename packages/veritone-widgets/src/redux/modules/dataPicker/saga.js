import { fork, all } from 'redux-saga/effects';
import { folderSaga } from './folders';

export default function* dataPickerSaga() {
  yield all([
    fork(folderSaga)
  ])
}
