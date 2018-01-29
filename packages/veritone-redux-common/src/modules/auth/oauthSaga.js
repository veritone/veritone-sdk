/* eslint-disable import/order */
import { noop } from 'lodash';
import { login } from 'veritone-oauth-helpers';
import { call, put, takeLatest, fork, all } from 'redux-saga/effects';

import * as authModule from '../auth'


function* requestOAuthGrant({ payload: { OAuthURI, onSuccess = noop, onFailure = noop } }) {
  let token;

  try {
    let { OAuthToken } = yield call(login, OAuthURI);
    token = OAuthToken;
  } catch (e) {
    console.log('oauth flow error', e);
    yield put({ type: authModule.OAUTH_GRANT_FLOW_FAILED, payload: e, error: true });
    yield call(onFailure, e);
    return;
  }

  yield put(authModule.OAuthGrantSuccess({ OAuthToken: token }));
  yield call(onSuccess, { OAuthToken: token })
}

function* watchOAuthGrantRequest() {
  yield takeLatest(authModule.REQUEST_OAUTH_GRANT, requestOAuthGrant);
}

export default function* root() {
  yield all([fork(watchOAuthGrantRequest)]);
}
