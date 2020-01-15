import { isFunction, get } from 'lodash';
import { fork, call, takeLatest, putResolve, select } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
const { user: userModule, auth: authModule } = modules;

import * as appModule from './';

export function* handleAppAuth() {
  try {
    const res = yield putResolve(userModule.fetchUser());
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

export default function* root() {
  yield fork(watchAppAuth);
}
