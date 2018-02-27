import { fork, call, put, all } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
console.log('modules', modules)
const { engine: engineModule } = modules;

function* fetchEngines(state) {
  yield put(engineModule.fetchEngines());
}

function* onMount() {
  yield call(fetchEngines)
}

export default function* root() {
  yield all([fork(onMount)]);
}
