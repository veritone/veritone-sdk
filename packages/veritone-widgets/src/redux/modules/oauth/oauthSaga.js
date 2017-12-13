import { call, put, takeLatest, fork, all } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
const { user: userModule } = modules;

import {
  REQUEST_OAUTH_GRANT,
  OAUTH_GRANT_FLOW_FAILED,
  OAuthGrantSuccess
} from '.';
import { login } from '../../../shared/VeritoneAuth';

function* requestOAuthGrant({ payload: { OAuthURI } }) {
  let token;

  try {
    let { OAuthToken } = yield call(login, OAuthURI);
    token = OAuthToken;
  } catch (e) {
    console.log('oauth flow error', e);
    yield put({ type: OAUTH_GRANT_FLOW_FAILED });
    return;
  }

  yield put.resolve(userModule.fetchUser({ token }));
  yield put(OAuthGrantSuccess({ OAuthToken: token }));
}

function* watchOAuthGrantRequest() {
  yield takeLatest(REQUEST_OAUTH_GRANT, requestOAuthGrant);
}

export default function* root() {
  yield all([fork(watchOAuthGrantRequest)]);
}
