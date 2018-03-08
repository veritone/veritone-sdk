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
  payload: { OAuthURI, onSuccess = noop, onFailure = noop }
}) {
  const authWindow = yield call(
    window.open,
    // fixme: apiroot/v1/admin/aiuthorize, client id and redir url into params
    'http://api.aws-dev.veritone.com/v1/admin/oauth/authorize?response_type=token&client_id=20a0686a-62e5-45cc-a8b4-e9cb11460ec3&redirect_uri=http://local.veritone-sample-app.com:3000&scope=all',
    '_auth',
    'width=550px,height=650px'
  );

  const windowEventChannel = eventChannel(emitter => {
    function handleEvent(e) {
      if (e.data.OAuthToken || e.data.error) {
        emitter({ OAuthToken: e.data.OAuthToken, error: e.data.error });
        emitter(END);
      }
    }

    window.addEventListener('message', handleEvent, false);

    return () => {
      // unsubscribe
      window.removeEventListener('message', handleEvent);
    };
  });

  const { OAuthToken, error } = yield take(windowEventChannel);
  yield call([authWindow, authWindow.close]);

  return OAuthToken
    ? yield put(OAuthGrantSuccess({ OAuthToken }))
    : yield put(OAuthGrantFailure(error));
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

// http://api.aws-dev.veritone.com/v1/admin/oauth/authorize?response_type=token&client_id=20a0686a-62e5-45cc-a8b4-e9cb11460ec3&redirect_uri=http://local.veritone-sample-app.com:3000&scope=all

//http://local.veritone-sample-app.com:3000/%3FselectedKind%3DFilePickerWidget%26selectedStory%3DBase
