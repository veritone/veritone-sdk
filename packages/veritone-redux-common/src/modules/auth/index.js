import { createReducer } from 'helpers/redux';
import {
  LOGIN_SUCCESS,
  FETCH_USER_SUCCESS,
  REFRESH_TOKEN_SUCCESS
} from '../user';

export const REQUEST_OAUTH_GRANT = 'REQUEST_OAUTH_GRANT';
export const OAUTH_GRANT_FLOW_FAILED = 'OAUTH_GRANT_FLOW_FAILED';
export const OAUTH_GRANT_FLOW_SUCCESS = 'OAUTH_GRANT_FLOW_SUCCESS';
export const SET_SESSION_TOKEN = 'vtn/user/SET_SESSION_TOKEN';
export const SET_OAUTH_TOKEN = 'vtn/user/SET_OAUTH_TOKEN';

export const namespace = 'auth';

const defaultState = {
  OAuthToken: null,
  sessionToken: null
};

const reducer = createReducer(defaultState, {
  [OAUTH_GRANT_FLOW_SUCCESS](state, { payload: { OAuthToken } }) {
    return {
      ...state,
      OAuthToken
    };
  },

  [LOGIN_SUCCESS](state, action) {
    return {
      ...state,
      sessionToken: action.payload.token
    };
  },

  [FETCH_USER_SUCCESS](state, action) {
    return {
      ...state,
      sessionToken: action.payload.token
    };
  },

  [REFRESH_TOKEN_SUCCESS](state, action) {
    return {
      ...state,
      sessionToken: action.payload.token
    };
  },

  [SET_SESSION_TOKEN](state, { payload }) {
    return {
      ...state,
      sessionToken: payload
    };
  },

  [SET_OAUTH_TOKEN](state, { payload }) {
    return {
      ...state,
      OAuthToken: payload
    };
  }
});

export default reducer;

function local(state) {
  return state[namespace];
}

export function setSessionToken(token) {
  // put a session token into state. This is temporary -- if the user
  // is fetched, it will be replaced with the one from the server. Should be
  // used for initial fetchUser calls when the token is already known.
  return {
    type: SET_SESSION_TOKEN,
    payload: token
  };
}

export function setOAuthToken(token) {
  // put an OAuth token into state. For when an OAuthToken is provided
  // outside the OAUTH_GRANT flow
  return {
    type: SET_OAUTH_TOKEN,
    payload: token
  };
}

export function requestOAuthGrant(OAuthURI, onSuccess, onFailure) {
  return {
    type: REQUEST_OAUTH_GRANT,
    payload: { OAuthURI, onSuccess, onFailure }
  };
}

export function OAuthGrantSuccess({ OAuthToken }) {
  return {
    type: OAUTH_GRANT_FLOW_SUCCESS,
    payload: { OAuthToken }
  };
}

export function selectSessionToken(state) {
  return local(state).sessionToken;
}

export function selectOAuthToken(state) {
  return local(state).OAuthToken;
}
