/* eslint-disable lodash/path-style */
import {
  takeEvery
} from 'redux-saga/effects';
import _ from 'lodash';
import * as folderReducer from './index';
export default function* searchFolder() {
  yield takeEvery(folderReducer.INIT_FOLDER, function* (action) { });
}