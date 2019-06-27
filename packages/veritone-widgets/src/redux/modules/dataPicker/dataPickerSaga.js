import {
  fork,
  all,
  put,
  takeEvery,
  select
} from 'redux-saga/effects';

import { template as FOLDER_TDO_TEMPLATE } from './folderTDO';
import { template as UPLOAD_TDO_TEMPLATE } from './uploadTDO';
// Search unsupported for now
import { template as SEARCH_TDO_TEMPLATE } from './searchTDO';

import {
  PICK_START,
  INIT_PICKER_TYPE,
  FETCH_PAGE,
  LOADED_PAGE,
  getCurrentNode,
  currentPickerType,
  searchValue
} from './';

const PICKER_MODE_TEMPLATES = [
  FOLDER_TDO_TEMPLATE,
  UPLOAD_TDO_TEMPLATE
];

const PAGINATION_MAP = PICKER_MODE_TEMPLATES.reduce((acc, template) => {
  if (template.pagination) {
    acc[template.type] = template.pagination;
  }
  return acc;
}, {});

function* watchPickStart() {
  yield takeEvery(PICK_START, function*(action) {
    const { id } = action.meta;

    let pickerType, availablePickerTypes = [];
    yield all(PICKER_MODE_TEMPLATES.map(function* (template) {
      const isEnabled = yield template.isEnabled(action.payload);
      if (isEnabled) {
        pickerType = pickerType || template.type;
        availablePickerTypes.push(template.type);
      }
    }));

    yield put({
      type: INIT_PICKER_TYPE,
      meta: { id },
      payload: {
        currentPickerType: pickerType,
        availablePickerTypes
      }
    });

    yield all(PICKER_MODE_TEMPLATES.map(function* (template) {
      const isEnabled = yield template.isEnabled(action.payload);
      if (isEnabled) {
        yield template.initialization(id);
      }
    }));
  });
}

// Fetch the next page for the currentPickerType
//  Folders - fetch subfolders first. once exhausted, then fetch TDOs
//  Search - if searchValue is populated, fetch search results
function* watchPagination() {
  yield takeEvery(FETCH_PAGE, function*(action) {
    const { id } = action.meta;
    let pickerType = yield select(currentPickerType, id);
    const currentNode = yield select(getCurrentNode, id);
    const triggerSearch = yield select(searchValue, id);

    if (!currentNode) {
      return;
    }

    // If searchValue is populated then trigger search pagination
    if (triggerSearch) {
      pickerType = SEARCH_TDO_TEMPLATE.type;
    }

    let result;
    if (PAGINATION_MAP[pickerType]) {
      result = yield PAGINATION_MAP[pickerType](currentNode, id);
    }

    if (result) {
      yield put({
        type: LOADED_PAGE,
        meta: { id },
        payload: result
      }); 
    }
  });
}

export default function* root() {
  const allWatchers = PICKER_MODE_TEMPLATES
    .filter(template => template.watchers)
    .reduce((acc, template) => acc.concat(template.watchers), [])
    .map(watcher => fork(watcher));

  yield all([
    fork(watchPickStart),
    fork(watchPagination),
    ... allWatchers
  ]);
}
