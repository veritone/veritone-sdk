/* eslint-disable import/order */
import { noop } from 'lodash';
import { login } from 'veritone-oauth-helpers';
import { call, put, takeLatest, fork, all } from 'redux-saga/effects';

import { OAuthGrantSuccess } from '../auth';
import { OAUTH_GRANT_FLOW_FAILED, REQUEST_OAUTH_GRANT } from '../auth/constants';

function* requestOAuthGrant({
  payload: { OAuthURI, onSuccess = noop, onFailure = noop }
}) {
  let token;

  try {
    let { OAuthToken } = yield call(login, OAuthURI);
    token = OAuthToken;
  } catch (e) {
    console.log('oauth flow error', e);
    yield put({ type: OAUTH_GRANT_FLOW_FAILED, payload: e, error: true });
    yield call(onFailure, e);
    return;
  }

  yield put(OAuthGrantSuccess({ OAuthToken: token }));
  yield call(onSuccess, { OAuthToken: token });
}

function* watchOAuthGrantRequest() {
  yield takeLatest(REQUEST_OAUTH_GRANT, requestOAuthGrant);
}

export default function* root() {
  yield all([fork(watchOAuthGrantRequest)]);
}
