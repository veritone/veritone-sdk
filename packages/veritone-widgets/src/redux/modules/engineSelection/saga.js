import { fork, call, put, all, takeLatest, select } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
import { isEmpty } from 'lodash';
import * as engineSelectionModule from './';
const { engine: engineModule } = modules;

function* fetchEngines() {
  yield put(engineSelectionModule.refetchEngines());
}

function* getCachedResults() {
  const cachedResults = yield select(engineSelectionModule.getCurrentResults);
  return cachedResults;
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

function* onMount() {
  yield call(fetchEngines)
}

export default function* root() {
  yield all([fork(onMount), fork(watchRefetchEngineActions)]);
}
