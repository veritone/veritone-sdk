import { fork, call, put, all, takeLatest } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
import * as engineSelectionModule from './';
console.log('modules', modules)
const { engine: engineModule } = modules;

function* fetchEngines() {
  yield put(engineSelectionModule.refetchEngines());
}

function* watchRefetchEngineActions() {
  const refetchTypes = [
    engineSelectionModule.SEARCH,
    engineSelectionModule.ADD_FILTER,
    engineSelectionModule.REMOVE_FILTER
  ];

  yield takeLatest(refetchTypes, function* onInvalidateAction() {
    yield* fetchEngines();
  });
}

function* onMount() {
  yield call(fetchEngines)
}

export default function* root() {
  yield all([fork(onMount), fork(watchRefetchEngineActions)]);
}
