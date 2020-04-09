/* eslint-disable lodash/path-style */
import {
  takeEvery,
  put,
  select,
  all
} from 'redux-saga/effects';
import includes from 'lodash/includes';
import toLower from 'lodash/toLower';
import * as actions from '../actions';
import * as folderSelector from '../selector';
export default function* searchSaga() {
  yield all([
    takeEvery(actions.SEARCH_FOLDER, searchFolderSaga),
    takeEvery(actions.SEARCH_UPDATE_DATA, updateSeachDataSaga)
  ])
}
export function* searchFolderSaga(action) {
  const {
    searchValue
  } = action.payload;
  yield put(actions.searchFolderStart(searchValue));
  const foldersData = yield select(folderSelector.folderData);
  const folderDataLocal = Object.values(foldersData.byId);
  const folderSearched = folderDataLocal
    .filter(item =>includes(toLower(item.name), toLower(searchValue)))
    .map(item => ({
      ...item,
      childs:[]
    }));
  yield put(actions.searchFolderSuccess(searchValue, folderSearched));
}
export function* updateSeachDataSaga(action) {
  const searchValue = yield select(folderSelector.searchValue);
  if(searchValue) {
    yield put(actions.searchFolder(searchValue));
  }
}