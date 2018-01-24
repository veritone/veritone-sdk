import { CALL_API } from 'redux-api-middleware-fixed';
import { get, isEmpty } from 'lodash';
import {
  permissions as perms,
  util as permissionUtil
} from 'veritone-functional-permissions';

import { commonHeaders } from 'helpers/api';
import { createReducer } from 'helpers/redux';
import { getConfig } from 'modules/config';
import { selectSessionToken } from 'modules/auth';

export const namespace = 'user';

export const FETCH_USER = 'vtn/user/FETCH_USER';
export const FETCH_USER_SUCCESS = 'vtn/user/FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'vtn/user/FETCH_USER_FAILURE';

export const LOGIN = 'vtn/user/LOGIN';
export const LOGIN_SUCCESS = 'vtn/user/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'vtn/user/LOGIN_FAILURE';

export const LOGOUT = 'vtn/user/LOGOUT';
export const LOGOUT_SUCCESS = 'vtn/user/LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'vtn/user/LOGOUT_FAILURE';

export const REFRESH_TOKEN = 'vtn/user/REFRESH_TOKEN';
export const REFRESH_TOKEN_SUCCESS = 'vtn/user/REFRESH_TOKEN_SUCCESS';
export const REFRESH_TOKEN_FAILURE = 'vtn/user/REFRESH_TOKEN_FAILURE';

export const FETCH_USER_APPLICATIONS = 'vtn/user/FETCH_USER_APPLICATIONS';
export const FETCH_USER_APPLICATIONS_SUCCESS =
  'vtn/user/FETCH_USER_APPLICATIONS_SUCCESS';
export const FETCH_USER_APPLICATIONS_FAILURE =
  'vtn/user/FETCH_USER_APPLICATIONS_FAILURE';

const defaultState = {
  user: {},

  isFetching: false,
  fetchingFailed: false,

  isLoggingIn: false,
  loginFailed: false,
  loginFailureMessage: null,

  isFetchingApplications: false,
  fetchApplicationsFailed: false,
  fetchApplicationsFailureMessage: null,
  enabledApps: []
};

const reducer = createReducer(defaultState, {
  [FETCH_USER](state, action) {
    const requestSuccessState = {
      ...state,
      isFetching: true,
      fetchingFailed: false
    };

    return action.error
      ? // handle requestError ie. offline
        this[FETCH_USER_FAILURE](state, action)
      : requestSuccessState;
  },

  [FETCH_USER_SUCCESS](state, action) {
    return {
      ...state,
      isFetching: false,
      fetchingFailed: false,
      user: action.payload
    };
  },

  [FETCH_USER_FAILURE](state, action) {
    return {
      ...state,
      isFetching: false,
      fetchingFailed: true,
      user: {}
    };
  },

  [LOGIN](state, action) {
    const requestSuccessState = {
      ...state,
      isLoggingIn: true,
      loginFailed: false,
      loginFailureMessage: null
    };

    return action.error
      ? this[LOGIN_FAILURE](state, action)
      : requestSuccessState;
  },

  [LOGIN_SUCCESS](state, action) {
    return {
      ...state,
      isLoggingIn: false,
      loginFailed: false,
      user: action.payload,
      loginFailureMessage: null
    };
  },

  [LOGIN_FAILURE](state, action) {
    const statusErrors = {
      404: "Couldn't login, please double check your username and password.",
      default: "Couldn't login, please try again."
    };

    const failureMessage =
      action.payload.name === 'ApiError'
        ? statusErrors[action.payload.status] || statusErrors.default
        : action.payload.name === 'RequestError'
          ? 'There was an error while logging in, please try again.'
          : statusErrors.default;

    return {
      ...state,
      isLoggingIn: false,
      loginFailed: true,
      loginFailureMessage: failureMessage,
      user: {}
    };
  },

  [FETCH_USER_APPLICATIONS](state, action) {
    const requestSuccessState = {
      ...state,
      isFetchingApplications: true,
      fetchApplicationsFailed: false,
      fetchApplicationsFailureMessage: null,
      enabledApps: []
    };

    return action.error
      ? this[FETCH_USER_APPLICATIONS_FAILURE](state, action)
      : requestSuccessState;
  },

  [FETCH_USER_APPLICATIONS_SUCCESS](state, action) {
    return {
      ...state,
      isFetchingApplications: false,
      fetchApplicationsFailed: false,
      enabledApps: action.payload.results,
      fetchApplicationsFailureMessage: null
    };
  },

  [FETCH_USER_APPLICATIONS_FAILURE](state, action) {
    const statusErrors = {
      404: "Couldn't get application list.",
      default: "Couldn't get application list. Please login."
    };

    const failureMessage =
      action.payload.name === 'ApiError'
        ? statusErrors[action.payload.status] || statusErrors.default
        : action.payload.name === 'RequestError'
          ? 'There was an error when fetching application list, please try again.'
          : statusErrors.default;

    return {
      ...state,
      isFetchingApplications: false,
      fetchApplicationsFailed: true,
      fetchApplicationsFailureMessage: failureMessage,
      enabledApps: []
    };
  },

  [REFRESH_TOKEN_SUCCESS](state, action) {
    return {
      ...state,
      user: action.payload
    };
  }
});

export default reducer;

function local(state) {
  return state[namespace];
}

export function fetchUser() {
  return {
    [CALL_API]: {
      types: [FETCH_USER, FETCH_USER_SUCCESS, FETCH_USER_FAILURE],
      endpoint: state => `${getConfig(state).apiRoot}/v1/admin/current-user`,
      method: 'GET',
      headers: commonHeaders
    }
  };
}

export function login({ userName, password }) {
  return {
    [CALL_API]: {
      types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE],
      endpoint: state => `${getConfig(state).apiRoot}/v1/admin/login`,
      method: 'POST',
      body: JSON.stringify({
        userName,
        password
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }
  };
}

export function logout() {
  return {
    [CALL_API]: {
      types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAILURE],
      endpoint: state =>
        // prettier-ignore
        `${getConfig(state).apiRoot}/v1/admin/token/${selectSessionToken(state)}/logout`,
      method: 'GET',
      headers: commonHeaders
    }
  };
}

export function refreshApiToken() {
  return {
    [CALL_API]: {
      types: [REFRESH_TOKEN, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAILURE],
      endpoint: state =>
        // prettier-ignore
        `${getConfig(state).apiRoot}/v1/admin/token/${selectSessionToken(state)}/refresh`,
      method: 'GET',
      headers: commonHeaders
    }
  };
}

export function fetchEnabledApps() {
  return {
    [CALL_API]: {
      types: [
        FETCH_USER_APPLICATIONS,
        FETCH_USER_APPLICATIONS_SUCCESS,
        FETCH_USER_APPLICATIONS_FAILURE
      ],
      endpoint: state =>
        `${getConfig(state).apiRoot}/v1/admin/current-user/applications`,
      method: 'GET',
      headers: commonHeaders,
      credentials: 'include'
    }
  };
}

export function isLoggingIn(state) {
  return local(state).isLoggingIn;
}

export function loginFailed(state) {
  return local(state).loginFailed;
}

export function loginFailureMessage(state) {
  return local(state).loginFailureMessage;
}

export function isFetching(state) {
  return local(state).isFetching;
}

export function fetchingFailed(state) {
  return local(state).fetchingFailed;
}

export function selectUser(state) {
  return local(state).user;
}

export function selectUserOrganizationKvp(state) {
  return get(local(state).user, 'organization.kvp');
}

export function enabledAppsFailedLoading(state) {
  return local(state).fetchApplicationsFailed;
}

export function isFetchingApps(state) {
  return local(state).isFetchingApplications;
}

export function enabledAppsFailureMessage(state) {
  return local(state).fetchApplicationsFailureMessage;
}

export function selectEnabledApps(state) {
  // fixme: how should migrations work without the cookie in external apps?
  const apps = local(state).enabledApps;
  // let migrated = cookie.get('veritone-migrated-to-discovery') === 'true';

  return apps
    .map(app => {
      const migrations = {
        // advertiser: migrated ? 'Discovery' : 'Advertiser',
        // broadcaster: migrated ? 'Discovery' : 'Media'
      };

      return {
        ...app,
        applicationName: migrations[app.applicationName] || app.applicationName
      };
    })
    .filter(app => {
      if (app.applicationCheckPermissions === false) {
        return true;
      }

      const appAccessPermissionId = get(perms, [app.applicationKey, 'access']);

      return (
        appAccessPermissionId &&
        permissionUtil.hasAccessTo(
          appAccessPermissionId,
          selectUser(state).permissionMasks
        )
      );
    });
}

export function userIsAuthenticated(state) {
  return !isEmpty(local(state).user);
}
