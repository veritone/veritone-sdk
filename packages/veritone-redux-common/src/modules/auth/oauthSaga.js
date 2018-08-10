/* eslint-disable import/order */
import { noop } from 'lodash';
import { login } from 'veritone-oauth-helpers';
import { eventChannel, END } from 'redux-saga';
import { call, put, takeLatest, fork, all, take } from 'redux-saga/effects';

import { OAuthGrantSuccess, OAuthGrantFailure } from '../auth';
import {
  REQUEST_OAUTH_GRANT,
  REQUEST_OAUTH_GRANT_IMPLICIT
} from '../auth/constants';

function* requestOAuthGrant({
  payload: { OAuthURI, onSuccess = noop, onFailure = noop }
}) {
  let token;

  try {
    let { OAuthToken } = yield call(login, OAuthURI);
    token = OAuthToken;
  } catch (e) {
    console.log('oauth flow error', e);
    yield put(OAuthGrantFailure(e));
    yield call(onFailure, e);
    return;
  }

  yield put(OAuthGrantSuccess({ OAuthToken: token }));
  yield call(onSuccess, { OAuthToken: token });
}

function* requestOAuthGrantImplicit({
  payload: {
    OAuthURI,
    responseType,
    clientId,
    redirectUri,
    scope,
    onSuccess = noop,
    onFailure = noop
  }
}) {
  const authWindow = yield call(
    window.open,
    `${OAuthURI}?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`,
    '_auth',
    'width=550px,height=650px'
  );

  const windowEventChannel = eventChannel(emitter => {
    function handleEvent(e) {
      if (e.data.OAuthToken || e.data.error) {
        emitter({
          OAuthToken: e.data.OAuthToken,
          error: e.data.error,
          errorDescription: e.data.errorDescription
        });
        emitter(END);
      }
    }

    window.addEventListener('message', handleEvent, false);

    return () => {
      // unsubscribe
      window.removeEventListener('message', handleEvent);
    };
  });

  const { OAuthToken, error, errorDescription } = yield take(
    windowEventChannel
  );
  yield call([authWindow, authWindow.close]);

  if (OAuthToken) {
    yield put(OAuthGrantSuccess({ OAuthToken }));
    yield call(onSuccess, { OAuthToken });
  } else if (error) {
    yield put(OAuthGrantFailure({ error, errorDescription }));
    yield call(onFailure, error, errorDescription);
  }
}

function* watchOAuthGrantRequest() {
  yield all([
    takeLatest(REQUEST_OAUTH_GRANT, requestOAuthGrant),
    takeLatest(REQUEST_OAUTH_GRANT_IMPLICIT, requestOAuthGrantImplicit)
  ]);
}

export default function* root() {
  yield all([fork(watchOAuthGrantRequest)]);
}
