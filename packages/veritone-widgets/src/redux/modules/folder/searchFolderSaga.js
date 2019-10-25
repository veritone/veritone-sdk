/* eslint-disable lodash/path-style */
import {
  takeEvery,
  put,
  select
} from 'redux-saga/effects';
import _ from 'lodash';
import * as folderReducer from './index';
import * as folderSelector from './selector';
export default function* searchFolder() {
  yield takeEvery(folderReducer.SEARCH_FOLDER, function* (action) {
    const {
      searchValue
    } = action.payload;
    yield put(folderReducer.searchFolderStart(searchValue));
    const foldersData = yield select(folderSelector.folderData);
    const folderDataLocal = Object.values(foldersData.byId);
    const folderSearched = folderDataLocal.filter(item =>
      _.includes(_.toLower(item.name), _.toLower(searchValue)));
    yield put(folderReducer.searchFolderSuccess(searchValue, folderSearched));
  });
}