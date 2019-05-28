import { fork, all } from 'redux-saga/effects';
import { folderSaga } from './folders';

export default function* dataPickerSaga() {
  console.log('RUN');
  yield all([
    fork(folderSaga),
    //streamSaga here
  ])
}
