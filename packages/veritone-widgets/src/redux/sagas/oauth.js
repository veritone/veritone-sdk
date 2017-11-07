import { call, put, takeLatest, fork, all } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
const { user: userModule } = modules;

import {
  REQUEST_OAUTH_GRANT,
  OAUTH_GRANT_FLOW_FAILED
} from '../modules/oauth';
import { login } from '../../shared/VeritoneAuth';

function* requestOAuthGrant() {
  let token;

  try {
    let { OAuthToken } = yield call(login, 'fixme-get-endpoint-somehow');
    token = OAuthToken;
  } catch (e) {
    console.log('oauth flow error', e);
    yield put(OAUTH_GRANT_FLOW_FAILED);
    return;
  }

  yield put(userModule.fetchUser({ token }));
}

function* watchOAuthGrantRequest() {
  yield takeLatest(REQUEST_OAUTH_GRANT, requestOAuthGrant);
}

export default function* root() {
  yield all([fork(watchOAuthGrantRequest)]);
}
