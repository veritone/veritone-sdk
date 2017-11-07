import { helpers } from 'veritone-redux-common';

const { createReducer } = helpers;

export const REQUEST_OAUTH_GRANT = 'REQUEST_OAUTH_GRANT';
export const OAUTH_GRANT_FLOW_FAILED = 'OAUTH_GRANT_FLOW_FAILED';
export const OAUTH_GRANT_FLOW_SUCCESS = 'OAUTH_GRANT_FLOW_SUCCESS';

export const namespace = 'oauth';

const defaultState = {
  OAuthToken: null
};

export default createReducer(defaultState, {
  [OAUTH_GRANT_FLOW_SUCCESS](state, { payload: { OAuthToken } }) {
    return {
      ...state,
      OAuthToken
    };
  }
});

export function requestOAuthGrant(OAuthURI) {
  return {
    type: REQUEST_OAUTH_GRANT,
    payload: { OAuthURI }
  };
}

export function OAuthGrantSuccess({ OAuthToken }) {
  return {
    type: OAUTH_GRANT_FLOW_SUCCESS,
    payload: { OAuthToken }
  };
}
