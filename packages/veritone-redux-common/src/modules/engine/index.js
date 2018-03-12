import { isEmpty, keyBy, get, without } from 'lodash';
import { callGraphQLApi, commonHeaders } from 'helpers/api';
import { createReducer } from 'helpers/redux';
import { getConfig } from 'modules/config';
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
    const requestSuccessState = {
      ...state,
      isFetching: true,
      fetchingFailed: false
    };

    return action.error
      ? // handle requestError ie. offline
        this[FETCH_ENGINES_FAILURE](state, action)
      : requestSuccessState;
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

    const filterBy = {};

    // exclude empty filters
    Object.keys(filters).map(filter => {
      if (filters[filter] && filters[filter].length) {
        filterBy[filter] = filters[filter];
      }
    });

    const query = `
      query Engines($name: String = "", $filter: EngineFilter) {
        engines(name: $name, limit: 1000, filter: $filter) {
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

    try {
      const response = await callGraphQLApi({
        query,
        variables: {
          name: searchQuery,
          filter: filterBy
        },
        token: selectSessionToken(getState()) || selectOAuthToken(getState())
      });

      if (!isEmpty(response.errors) && isEmpty(response.data.engines)) {
        throw response.errors;
      }

      const results = get(response, 'data.engines.records');
      const count = get(response, 'data.engines.count');

      dispatch({
        type: FETCH_ENGINES_SUCCESS,
        payload: { count, results },
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

export function isFetchingEngines(state) {
  return local(state).isFetching;
}

export function failedToFetchEngines(state) {
  return local(state).fetchingFailed;
}
