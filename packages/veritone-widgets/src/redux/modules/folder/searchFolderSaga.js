/* eslint-disable lodash/path-style */
import {
  takeEvery
} from 'redux-saga/effects';
import * as folderReducer from './index';
export default function* searchFolder() {
  yield takeEvery(folderReducer.INIT_FOLDER, function* (action) { });
}