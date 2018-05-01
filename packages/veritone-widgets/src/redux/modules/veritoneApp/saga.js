import { isFunction } from 'lodash';
import { fork, call, takeLatest, put, select } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
const { user: userModule, auth: authModule } = modules;

import * as appModule from '.';

function* fetchAppStartupDependencies() {
  // Can use err here to give feedback to user if auth fails
  // const err = yield put.resolve(userModule.fetchUser());
  yield put.resolve(userModule.fetchUser());
  // get each widget to call its onauth dependencies
  // put widgets into store and select them?
  const widgets = yield select(appModule.widgets);
  for (let widget of widgets) {
    if (isFunction(widget.veritoneAppDidAuthenticate)) {
      yield call(widget.veritoneAppDidAuthenticate);
    }
  }
}

function* watchAppAuth() {
  yield takeLatest(
    [
      // fetch when we get a token, re-fetch if a new token is set
      authModule.SET_SESSION_TOKEN,
      authModule.SET_OAUTH_TOKEN,
      // fetch if an grant is completed
      authModule.OAUTH_GRANT_FLOW_SUCCESS,
      // try to fetch StartupDependencies with no token
      authModule.CHECK_AUTH_NO_TOKEN,
    ],
    fetchAppStartupDependencies
  );
}

export default function* root() {
  yield fork(watchAppAuth);
}

// todo: add onAuthFailedCallback or something similar to VeritoneApp?
// how does external user know if auth failed?
