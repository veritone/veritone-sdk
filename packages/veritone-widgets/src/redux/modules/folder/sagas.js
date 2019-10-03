import { fork, call, all, takeEvery, put, select } from 'redux-saga/effects';
import * as folderReducer from './';

function* initFolder() {
  yield takeEvery(folderReducer.INIT_FOLDER, function* (action) {
    const { files, callback } = action.payload;
    const { id } = action.meta;
    yield call(uploadFileSaga, id, files, callback);
  });
}

function* uploadFileSaga() {
  yield console.log('test data');
}

export default function* root() {
  yield all([
    fork(initFolder)
  ])
}