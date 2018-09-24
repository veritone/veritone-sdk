import { CALL_API } from 'redux-api-middleware-fixed';
import { get, isEmpty, pick, merge } from 'lodash';
import {
  permissions as perms,
  util as permissionUtil
} from 'veritone-functional-permissions';

import { commonHeaders, getCredentialsMode } from 'helpers/api';
import callGraphQLApi from 'helpers/api/callGraphQLApi';
import { createReducer, reduceReducers } from 'helpers/redux';
import handleApiCall from 'helpers/redux/handleApiCall';
import { getConfig } from 'modules/config';
import { selectSessionToken } from 'modules/auth';

import * as constants from './constants';
export const namespace = 'user';

const {
  reducer: resetUserPasswordReducer,
  selectors: {
    fetchingStatus: resetUserPasswordFetchingStatus,
    fetchingFailureMessage: resetUserPasswordFailureMessage
  }
} = handleApiCall({
  types: [
    constants.RESET_USER_PASSWORD,
    constants.RESET_USER_PASSWORD_SUCCESS,
    constants.RESET_USER_PASSWORD_FAILURE
  ]
});

export { resetUserPasswordFetchingStatus, resetUserPasswordFailureMessage };

const {
  reducer: updateCurrentUserProfileReducer,
  selectors: {
    fetchingStatus: updateCurrentUserProfileFetchingStatus,
    fetchingFailureMessage: updateCurrentUserProfileFailureMessage
  }
} = handleApiCall({
  types: [
    constants.UPDATE_CURRENT_USER_PROFILE,
    constants.UPDATE_CURRENT_USER_PROFILE_SUCCESS,
    constants.UPDATE_CURRENT_USER_PROFILE_FAILURE
  ]
});

export {
  updateCurrentUserProfileFetchingStatus,
  updateCurrentUserProfileFailureMessage
};

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

const reducer = reduceReducers(
  resetUserPasswordReducer,
  updateCurrentUserProfileReducer,
  createReducer(defaultState, {
    [constants.FETCH_USER](state, action) {
      const requestSuccessState = {
        ...state,
        isFetching: true,
        fetchingFailed: false
      };

      return action.error
        ? // handle requestError ie. offline
          this[constants.FETCH_USER_FAILURE](state, action)
        : requestSuccessState;
    },

    [constants.FETCH_USER_SUCCESS](state, action) {
      return {
        ...state,
        isFetching: false,
        fetchingFailed: false,
        user: action.payload
      };
    },

    [constants.FETCH_USER_FAILURE](state, action) {
      return {
        ...state,
        isFetching: false,
        fetchingFailed: true,
        user: {}
      };
    },

    [constants.LOGIN](state, action) {
      const requestSuccessState = {
        ...state,
        isLoggingIn: true,
        loginFailed: false,
        loginFailureMessage: null
      };

      return action.error
        ? this[constants.LOGIN_FAILURE](state, action)
        : requestSuccessState;
    },

    [constants.LOGIN_SUCCESS](state, action) {
      return {
        ...state,
        isLoggingIn: false,
        loginFailed: false,
        user: action.payload,
        loginFailureMessage: null
      };
    },

    [constants.LOGIN_FAILURE](state, action) {
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

    [constants.LOGOUT_SUCCESS](state) {
      return {
        ...state,
        user: {}
      };
    },

    [constants.FETCH_USER_APPLICATIONS](state, action) {
      const requestSuccessState = {
        ...state,
        isFetchingApplications: true,
        fetchApplicationsFailed: false,
        fetchApplicationsFailureMessage: null,
        enabledApps: []
      };

      return action.error
        ? this[constants.FETCH_USER_APPLICATIONS_FAILURE](state, action)
        : requestSuccessState;
    },

    [constants.FETCH_USER_APPLICATIONS_SUCCESS](state, action) {
      return {
        ...state,
        isFetchingApplications: false,
        fetchApplicationsFailed: false,
        enabledApps: action.payload.results,
        fetchApplicationsFailureMessage: null
      };
    },

    [constants.FETCH_USER_APPLICATIONS_FAILURE](state, action) {
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

    [constants.REFRESH_TOKEN_SUCCESS](state, action) {
      return {
        ...state,
        user: action.payload
      };
    },

    [constants.UPDATE_CURRENT_USER_PROFILE_SUCCESS](
      state,
      {
        payload: {
          updateCurrentUser: { firstName, lastName, imageUrl: image }
        }
      }
    ) {
      // fixme: for now, this has to paper over some differences between REST
      // and graphQL apis
      const newUserKvp = merge({}, state.user.kvp, {
        firstName,
        lastName,
        image
      });

      return {
        ...state,
        user: {
          ...state.user,
          kvp: newUserKvp,
          signedImageUrl: image || state.user.signedImageUrl
        }
      };
    }
  })
);

export default reducer;

function local(state) {
  return state[namespace];
}

export function fetchUser() {
  return {
    [CALL_API]: {
      types: [
        constants.FETCH_USER,
        constants.FETCH_USER_SUCCESS,
        constants.FETCH_USER_FAILURE
      ],
      endpoint: state => `${getConfig(state).apiRoot}/v1/admin/current-user`,
      method: 'GET',
      headers: commonHeaders,
      credentials: getCredentialsMode()
    }
  };
}

export function login({ userName, password }) {
  return {
    [CALL_API]: {
      types: [
        constants.LOGIN,
        constants.LOGIN_SUCCESS,
        constants.LOGIN_FAILURE
      ],
      endpoint: state => `${getConfig(state).apiRoot}/v1/admin/login`,
      method: 'POST',
      body: JSON.stringify({
        userName,
        password
      }),
      headers: commonHeaders,
      credentials: getCredentialsMode()
    }
  };
}

export function logout() {
  return {
    [CALL_API]: {
      types: [
        constants.LOGOUT,
        constants.LOGOUT_SUCCESS,
        constants.LOGOUT_FAILURE
      ],
      endpoint: state =>
        // prettier-ignore
        `${getConfig(state).apiRoot}/v1/admin/token/${selectSessionToken(state)}/logout`,
      method: 'GET',
      headers: commonHeaders,
      credentials: getCredentialsMode()
    }
  };
}

export function refreshApiToken() {
  return {
    [CALL_API]: {
      types: [
        constants.REFRESH_TOKEN,
        constants.REFRESH_TOKEN_SUCCESS,
        constants.REFRESH_TOKEN_FAILURE
      ],
      endpoint: state =>
        // prettier-ignore
        `${getConfig(state).apiRoot}/v1/admin/token/${selectSessionToken(state)}/refresh`,
      method: 'GET',
      headers: commonHeaders,
      credentials: getCredentialsMode()
    }
  };
}

export function fetchEnabledApps() {
  return {
    [CALL_API]: {
      types: [
        constants.FETCH_USER_APPLICATIONS,
        constants.FETCH_USER_APPLICATIONS_SUCCESS,
        constants.FETCH_USER_APPLICATIONS_FAILURE
      ],
      endpoint: state =>
        `${getConfig(state).apiRoot}/v1/admin/current-user/applications`,
      method: 'GET',
      headers: commonHeaders,
      credentials: getCredentialsMode()
    }
  };
}

export const resetUserPassword = email => (dispatch, getState) => {
  const query = `
    mutation ($email: String!) {
      createPasswordResetRequest(input: { userName: $email }) {
        message
      }
    }
  `;

  const emailToReset = email || selectUser(getState()).email;

  return callGraphQLApi({
    actionTypes: [
      constants.RESET_USER_PASSWORD,
      constants.RESET_USER_PASSWORD_SUCCESS,
      constants.RESET_USER_PASSWORD_FAILURE
    ],
    query,
    variables: {
      email: emailToReset
    },
    dispatch,
    getState
  });
};

export const updateCurrentUserProfile = vals => (dispatch, getState) => {
  const query = `
    mutation ($input: UpdateCurrentUser!){
      updateCurrentUser(input: $input) {
        firstName
        lastName
        imageUrl
      }
    }
  `;

  // when updating, update these in the query, too
  const acceptableVals = ['firstName', 'lastName', 'imageUrl'];

  return callGraphQLApi({
    actionTypes: [
      constants.UPDATE_CURRENT_USER_PROFILE,
      constants.UPDATE_CURRENT_USER_PROFILE_SUCCESS,
      constants.UPDATE_CURRENT_USER_PROFILE_FAILURE
    ],
    query,
    variables: {
      input: pick(vals, acceptableVals)
    },
    dispatch,
    getState
  });
};

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

export function selectUserOrganizationId(state) {
  return get(local(state).user, 'organization.organizationId');
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

export function hasFeature(state, featureName) {
  return (
    get(local(state), [
      'user',
      'organization',
      'kvp',
      'features',
      featureName
    ]) === 'enabled'
  );
}
