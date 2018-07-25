import { fork, put, takeLatest, select } from 'redux-saga/effects';
import * as engineSelectionModule from './';

function* fetchEngines(id) {
  yield put(engineSelectionModule.refetchEngines(id));
}

function* getCachedResults(id) {
  return yield select(engineSelectionModule.getCurrentResults, id);
}

function* watchRefetchEngineActions() {
  const refetchTypes = [
    engineSelectionModule.SEARCH,
    engineSelectionModule.CLEAR_SEARCH,
    engineSelectionModule.ADD_FILTER,
    engineSelectionModule.REMOVE_FILTER,
    engineSelectionModule.CHANGE_TAB
  ];

  yield takeLatest(refetchTypes, function* onInvalidateAction({
    meta: { id }
  }) {
    let cachedResults = yield* getCachedResults(id);

    if (!cachedResults) {
      yield* fetchEngines(id);
    }
  });
}

export default function* root() {
  yield fork(watchRefetchEngineActions);
}
