import { fork, put, takeLatest, select } from 'redux-saga/effects';
import * as engineSelectionModule from './';

function* fetchEngines() {
  yield put(engineSelectionModule.refetchEngines());
}

function* getCachedResults() {
  return yield select(engineSelectionModule.getCurrentResults);
}

function* watchRefetchEngineActions() {
  const refetchTypes = [
    engineSelectionModule.SEARCH,
    engineSelectionModule.CLEAR_SEARCH,
    engineSelectionModule.ADD_FILTER,
    engineSelectionModule.REMOVE_FILTER
  ];

  yield takeLatest(refetchTypes, function* onInvalidateAction() {
    let cachedResults = yield* getCachedResults();

    if (!cachedResults) {
      yield* fetchEngines();
    }
  });
}

export default function* root() {
  yield fork(watchRefetchEngineActions);
}
