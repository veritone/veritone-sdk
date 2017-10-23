import { CALL_API } from 'redux-api-middleware';
import { get, isEmpty, isNumber } from 'lodash';
import cookie from 'react-cookie';
import {
  permissions as perms,
  util as permissionUtil
} from 'functional-permissions-lib';

import { commonHeaders } from 'helpers/api';
import { createReducer } from 'helpers/redux';
import { getConfig } from 'modules/config';

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

export const UPDATE_PROFILE = 'vtn/user/UPDATE_PROFILE_';
export const UPDATE_PROFILE_SUCCESS = 'vtn/user/UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'vtn/user/UPDATE_PROFILE_FAILURE';

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

  [UPDATE_PROFILE_SUCCESS](state, action) {
    return {
      ...state,
      user: action.payload
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
      endpoint: state => `${getConfig(state).apiRoot}/admin/current-user`,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }
  };
}

export function login({ userName, password }) {
  return {
    [CALL_API]: {
      types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE],
      endpoint: state => `${getConfig(state).apiRoot}/admin/login`,
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
        `${getConfig(state).apiRoot}/admin/token/${selectUserApiToken(state)}/logout`,
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
        `${getConfig(state).apiRoot}/admin/token/${selectUserApiToken(state)}/refresh`,
      method: 'GET',
      headers: commonHeaders
    }
  };
}

export function setOnboardingProfileFields(values) {
  return {
    [CALL_API]: {
      types: [UPDATE_PROFILE, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_FAILURE],
      // endpoint: 'http://local.veritone.com:9000/v1/admin/current-user/set-developer-organization-fields',
      endpoint: state =>
        // prettier-ignore
        `${getConfig(state).apiRoot}/admin/current-user/set-developer-organization-fields`,
      method: 'POST',
      body: JSON.stringify(values),
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
        `${getConfig(state).apiRoot}/admin/current-user/applications`,
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

export function selectUser(state) {
  return local(state).user;
}

export function selectUserOrganizationKvp(state) {
  return get(local(state).user, 'organization.kvp');
}

export function selectUserApiToken(state) {
  return get(local(state), 'user.token');
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
  let migrated = cookie.load('veritone-migrated-to-discovery') === 'true';
  let appList = local(state).enabledApps;

  return appList
    .map(app => {
      let alteredApp = { ...app };

      if (
        app.applicationCheckPermissions &&
        perms[app.applicationKey] &&
        isNumber(perms[app.applicationKey].access)
      ) {
        alteredApp.permissionId = perms[app.applicationKey].access;
      }

      if (app.applicationKey === 'advertiser') {
        alteredApp.applicationName = migrated ? 'Discovery' : 'Advertiser';
      } else if (app.applicationKey === 'broadcaster') {
        alteredApp.applicationName = migrated ? 'Discovery' : 'Media';
      }

      return alteredApp;
    })
    .filter(app => {
      return (
        (app.permissionId &&
          permissionUtil.hasAccessTo(
            app.permissionId,
            selectUser(state).permissionMasks
          )) ||
        !app.applicationCheckPermissions
      );
    });
}

export function userIsAuthenticated(state) {
  return !isEmpty(local(state).user);
}

export function userCompletedDevSignup(localState) {
  return get(localState, 'user.organization.developerFieldsCompleted', false);
}
