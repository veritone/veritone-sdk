import { isEmpty, keyBy, get } from 'lodash';
import { callGraphQLApi, commonHeaders } from 'helpers/api';
import { createReducer } from 'helpers/redux';
import { getConfig } from 'modules/config';
import { selectSessionToken } from 'modules/auth';

export const namespace = 'engine';

export const FETCH_ENGINES = 'vtn/engine/FETCH_ENGINES';
export const FETCH_ENGINES_SUCCESS = 'vtn/engine/FETCH_ENGINES_SUCCESS';
export const FETCH_ENGINES_FAILURE = 'vtn/engine/FETCH_ENGINES_FAILURE';

export const SEARCH_ENGINES = 'vtn/engine/SEARCH_ENGINES';
export const SEARCH_ENGINES_SUCCESS = 'vtn/engine/SEARCH_ENGINES_SUCCESS';
export const SEARCH_ENGINES_FAILURE = 'vtn/engine/SEARCH_ENGINES_FAILURE';


const defaultState = {
  enginesById: {},
  engineSearchResults: [],
  isFetching: true,
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
      enginesById: keyBy(action.payload, 'id')
    };
  },
  [FETCH_ENGINES_FAILURE](state, action) {
    return {
      ...state,
      isFetching: false,
      fetchingFailed: true,
      enginesById: {}
    };
  },
  [SEARCH_ENGINES](state, action) {
    const requestSuccessState = {
      ...state,
      isFetching: true,
      fetchingFailed: false
    };

    return action.error
      ? // handle requestError ie. offline
        this[SEARCH_ENGINES_FAILURE](state, action)
      : requestSuccessState;
  },
  [SEARCH_ENGINES_SUCCESS](state, action) {
    return {
      ...state,
      isFetching: false,
      fetchingFailed: false,
      enginesById: {
        ...state.enginesById,
        ...keyBy(action.payload.results, 'id')
      },
      engineSearchResults: action.payload.results.map(engine => engine.id)
    };
  },
  [SEARCH_ENGINES_FAILURE](state, action) {
    return {
      ...state,
      isFetching: false,
      fetchingFailed: true,
      engineSearchResults: []
    };
  },
})

function local(state) {
  return state[namespace];
}

export function fetchEngines(opts) {
  return async function action(dispatch, getState) {
    dispatch({ type: FETCH_ENGINES });

    const urlQuery = `
    {
      engines {
        records {
          id
          name
          description
          logoPath
          iconPath
          rating
          category {
            iconClass
            name
          }
        }
      }
    }`;
    console.log('get state', getState())
    try {
      const response =  await callGraphQLApi({
        query: urlQuery,
        token: selectSessionToken(getState())
      });

      console.log('response', response)

      if (!isEmpty(response.errors) && isEmpty(response.data)) {
        throw response.errors;
      }

      dispatch({ type: FETCH_ENGINES_SUCCESS, payload: get(response, 'data.engines.records') })
    } catch(err) {
      dispatch({ type: FETCH_ENGINES_FAILURE, payload: err })
    }
  }
}

export function searchEngines(opts = {}) {
  // console.log('name', name);
  return async function action(dispatch, getState) {
    dispatch({ type: SEARCH_ENGINES });

    const urlQuery = `
    query Engines($name: String) {
      engines(name: $name) {
        records {
          id
          name
          description
          logoPath
          iconPath
          rating
          category {
            iconClass
            name
          }
        }
      }
    }`;

    try {
      const response = await callGraphQLApi({
        query: urlQuery,
        variables: {
          ...opts
        },
        token: selectSessionToken(getState())
      });

      if (!isEmpty(response.errors) && isEmpty(response.data)) {
        throw response.errors;
      }
      
      dispatch({ type: SEARCH_ENGINES_SUCCESS, payload: { query: opts.name, results: get(response, 'data.engines.records') } })
    } catch(err) {
      dispatch({ type: SEARCH_ENGINES_FAILURE, payload: err })
    }
  }
}

export function getEngines(state) {
  return local(state).enginesById;
}

export function getEngineSearchResults(state) {
  return local(state).engineSearchResults;
}
