import { isEmpty, keyBy, get, pickBy } from 'lodash';
import { getConfig } from 'modules/config';
import { callGraphQLApi } from 'helpers/api';
import { createReducer } from 'helpers/redux';
import { selectSessionToken, selectOAuthToken } from 'modules/auth';

export const namespace = 'engine';

export const FETCH_ENGINES = 'vtn/engine/FETCH_ENGINES';
export const FETCH_ENGINES_SUCCESS = 'vtn/engine/FETCH_ENGINES_SUCCESS';
export const FETCH_ENGINES_FAILURE = 'vtn/engine/FETCH_ENGINES_FAILURE';

const defaultState = {
  enginesById: {},
  isFetching: false,
  fetchingFailed: false
};

export default createReducer(defaultState, {
  [FETCH_ENGINES](state, action) {
    return {
      ...state,
      isFetching: true,
      fetchingFailed: false
    };
  },
  [FETCH_ENGINES_SUCCESS](state, action) {
    return {
      ...state,
      isFetching: false,
      fetchingFailed: false,
      enginesById: {
        ...state.enginesById,
        ...keyBy(action.payload.results, 'id')
      }
    };
  },
  [FETCH_ENGINES_FAILURE](state, action) {
    return {
      ...state,
      isFetching: false,
      fetchingFailed: true,
      enginesById: {}
    };
  }
});

function local(state) {
  return state[namespace];
}

export function fetchEngines(searchQuery, filters = {}) {
  return async function action(dispatch, getState) {
    dispatch({ type: FETCH_ENGINES });

    const query = `
      query Engines($name: String = "", $filter: EngineFilter) {
        engines(name: $name, limit: 1000, owned: false, filter: $filter) {
          records {
            id
            name
            description
            logoPath
            iconPath
            rating
            price
            deploymentModel
            ownerOrganization {
              name
            }
            category {
              iconClass
              name
              color
            }
            builds(status: ["deployed"]) {
              records {
                modifiedDateTime
                manifest
              }
            }
          }
        }
      }`;

    const config = getConfig(getState());
    const { apiRoot, graphQLEndpoint } = config;
    const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;

    try {
      const response = await callGraphQLApi({
        endpoint: graphQLUrl,
        query,
        variables: {
          name: searchQuery,
          filter: pickBy(filters, (filter = []) => filter && !!filter.length)
        },
        token: selectSessionToken(getState()) || selectOAuthToken(getState())
      });

      if (!isEmpty(response.errors) && isEmpty(response.data.engines)) {
        throw response.errors;
      }

      const results = get(response, 'data.engines.records');

      dispatch({
        type: FETCH_ENGINES_SUCCESS,
        payload: { results },
        meta: { searchQuery, filters }
      });
    } catch (err) {
      dispatch({
        type: FETCH_ENGINES_FAILURE,
        payload: err,
        meta: { filters }
      });
    }
  };
}

export function getEngines(state) {
  return local(state).enginesById;
}

export function getEngine(state, engineId) {
  return local(state).enginesById[engineId];
}

export function isFetchingEngines(state) {
  return local(state).isFetching;
}

export function failedToFetchEngines(state) {
  return local(state).fetchingFailed;
}
