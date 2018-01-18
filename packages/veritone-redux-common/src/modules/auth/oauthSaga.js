/* eslint-disable import/order */
import { login } from 'veritone-oauth-helpers';
import { call, put, takeLatest, fork, all } from 'redux-saga/effects';

import * as userModule from '../user'
import * as authModule from '../auth'


function* requestOAuthGrant({ payload: { OAuthURI } }) {
  let token;

  try {
    let { OAuthToken } = yield call(login, OAuthURI);
    token = OAuthToken;
  } catch (e) {
    console.log('oauth flow error', e);
    yield put({ type: authModule.OAUTH_GRANT_FLOW_FAILED });
    return;
  }

  yield put.resolve(userModule.fetchUser({ token }));
  yield put(authModule.OAuthGrantSuccess({ OAuthToken: token }));
}

function* watchOAuthGrantRequest() {
  yield takeLatest(authModule.REQUEST_OAUTH_GRANT, requestOAuthGrant);
}

export default function* root() {
  yield all([fork(watchOAuthGrantRequest)]);
}
