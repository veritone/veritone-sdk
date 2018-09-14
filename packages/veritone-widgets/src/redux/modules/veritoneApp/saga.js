import { isFunction, get } from 'lodash';
import {
  all,
  fork,
  call,
  takeLatest,
  takeEvery,
  put,
  select,
  cancel
} from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
const { user: userModule, auth: authModule } = modules;

import * as appModule from './';

export function* handleAppAuth() {
  try {
    const res = yield put.resolve(userModule.fetchUser());
    if (get(res, 'error')) {
      throw res.payload;
    }
    // get each widget to call its onauth dependencies
    // put widgets into store and select them?
    const widgets = yield select(appModule.widgets);
    for (let widget of widgets) {
      if (isFunction(widget.veritoneAppDidAuthenticate)) {
        yield call(widget.veritoneAppDidAuthenticate);
      }
    }
  } catch (e) {
    // todo: add onAuthFailedCallback or something similar to VeritoneApp?
    // how does external user know if auth failed?
  }
}

export function* watchAppAuth() {
  yield takeLatest(
    [
      // fetch when we get a token, re-fetch if a new token is set
      authModule.SET_SESSION_TOKEN,
      authModule.SET_OAUTH_TOKEN,
      // fetch if an grant is completed
      authModule.OAUTH_GRANT_FLOW_SUCCESS,
      // try to fetch StartupDependencies with no token
      authModule.CHECK_AUTH_NO_TOKEN
    ],
    handleAppAuth
  );
}

const widgetSagaRegistry = new Map();
function* handleWidgetRegistration({ payload: { saga } }) {
  if (saga) {
    const runningSagasEntry = widgetSagaRegistry.get(saga) || {};
    const alreadyRunningCount = runningSagasEntry.count || 0;
    let task = runningSagasEntry.task;

    if (!task) {
      task = yield fork(saga);
    }

    widgetSagaRegistry.set(saga, {
      task,
      count: alreadyRunningCount + 1
    });
  }
}

function* handleWidgetUnregistration({ payload: { saga } }) {
  if (saga) {
    const runningSagasEntry = widgetSagaRegistry.get(saga);
    const alreadyRunningCount = runningSagasEntry.count;
    const task = runningSagasEntry.task;
    const isUnregisteringLastInstanceOfWidget = alreadyRunningCount === 1;

    if (isUnregisteringLastInstanceOfWidget) {
      yield cancel(task);
    }

    widgetSagaRegistry.set(saga, {
      task: isUnregisteringLastInstanceOfWidget ? null : task,
      count: alreadyRunningCount - 1
    });
  }
}

function* watchWidgetRegistration() {
  yield all([
    takeEvery(appModule.WIDGET_ADDED, handleWidgetRegistration),
    takeEvery(appModule.WIDGET_REMOVED, handleWidgetUnregistration)
  ]);
}

export default function* root() {
  yield all([fork(watchAppAuth), fork(watchWidgetRegistration)]);
}
