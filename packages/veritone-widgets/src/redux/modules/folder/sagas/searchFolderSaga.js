/* eslint-disable lodash/path-style */
import {
  takeEvery,
  put,
  select
} from 'redux-saga/effects';
import includes from 'lodash/includes';
import toLower from 'lodash/toLower';
import * as actions from '../actions';
import * as folderSelector from '../selector';
export default function* searchFolder() {
  yield takeEvery(actions.SEARCH_FOLDER, function* (action) {
    const {
      searchValue
    } = action.payload;
    yield put(actions.searchFolderStart(searchValue));
    const foldersData = yield select(folderSelector.folderData);
    const folderDataLocal = Object.values(foldersData.byId);
    const folderSearched = folderDataLocal.filter(item =>
      includes(toLower(item.name), toLower(searchValue)));
    yield put(actions.searchFolderSuccess(searchValue, folderSearched));
  });
}