import { isEmpty, keyBy, get, mapValues } from 'lodash';
import { getConfig } from 'modules/config';
import fetchGraphQLApi from 'helpers/api/fetchGraphQLApi';
import { createReducer } from 'helpers/redux';
import { selectSessionToken, selectOAuthToken } from 'modules/auth';

export const FETCH_APPLICATIONS = 'FETCH_APPLICATIONS';
export const FETCH_APPLICATIONS_SUCCESS = 'FETCH_APPLICATIONS_SUCCESS';
export const FETCH_APPLICATIONS_FAILURE = 'FETCH_APPLICATIONS_FAILURE';

export const namespace = 'application';

const defaultState = {
  applicationsById: {},
  isFetching: false,
  fetchingFailed: false
};

const reducer = createReducer(defaultState, {
  [FETCH_APPLICATIONS](state, action) {
    return {
      ...state,
      isFetching: true,
      fetchingFailed: false
    };
  },
  [FETCH_APPLICATIONS_SUCCESS](state, action) {
    return {
      ...state,
      isFetching: false,
      fetchingFailed: false,
      applicationsById: {
        ...state.applicationsById,
        ...keyBy(action.payload.results, 'id')
      }
    };
  },
  [FETCH_APPLICATIONS_FAILURE](state, action) {
    return {
      ...state,
      isFetching: false,
      fetchingFailed: true,
      applicationsById: {}
    };
  }
});

export default reducer;

function local(state) {
  return state[namespace];
}

export function fetchApplications() {
  return async function action(dispatch, getState) {
    dispatch({ type: FETCH_APPLICATIONS });

    const query = `
      query Applications {
        applications(limit: 9999) {
          records {
            id
            key
            name
            category
            description
            iconUrl
            iconSvg
            url
            deploymentModel
            createdDateTime
            modifiedDateTime
            clientSecret
            oauth2RedirectUrls
            organizationId
            status
            permissionsRequired
            contextMenuExtensions {
              mentions {
                id
                label
                url
              }
              tdos {
                id
                label
                url
              }
            }
          }
        }
      }`;

    const config = getConfig(getState());
    const { apiRoot, graphQLEndpoint } = config;
    const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;

    try {
      const response = await fetchGraphQLApi({
        endpoint: graphQLUrl,
        query,
        token: selectSessionToken(getState()) || selectOAuthToken(getState())
      });

      if (!isEmpty(response.errors) && isEmpty(response.data.applications)) {
        throw response.errors;
      }

      const results = get(response, 'data.applications.records');

      dispatch({
        type: FETCH_APPLICATIONS_SUCCESS,
        payload: { results }
      });
    } catch (err) {
      dispatch({
        type: FETCH_APPLICATIONS_FAILURE,
        payload: err
      });
    }
  };
}

export function getApplications(state) {
  return local(state).applicationsById;
}

export function getApplication(state, applicationId) {
  return local(state).applicationsById[applicationId];
}

export function isFetchingApplications(state) {
  return local(state).isFetching;
}

export function failedToFetchApplications(state) {
  return local(state).fetchingFailed;
}

export function getContextMenuExtensions(state) {
  const applicationsById = getApplications(state);
  const contextMenuExtensions = Object.values(applicationsById).reduce(
    (accumulator, currentVal) => {

      // assign applicationId for cme
      const currentcontextMenuExtensions = mapValues(currentVal.contextMenuExtensions, cmeValue => {
        return cmeValue.length > 0 ?
          cmeValue.map(item => Object.assign(item, { applicationId: currentVal.id }))
          : cmeValue
      })
      return {
        ...accumulator,
        tdos: [
          ...accumulator.tdos, 
          ...currentcontextMenuExtensions.tdos
        ],
        mentions: [
          ...accumulator.mentions,
          ...currentcontextMenuExtensions.mentions
        ]
      };
    },
    { tdos: [], mentions: [] }
  );
  console.log(contextMenuExtensions)
  return contextMenuExtensions;
}
