import { isEmpty, keyBy, get, pickBy } from 'lodash';
import { getConfig } from 'modules/config';
import { fetchGraphQLApi } from 'helpers/api';
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
      fetchingFailed: true
    };
  }
});

function local(state) {
  return state[namespace];
}

export function fetchEngines(
  { offset, limit, owned },
  searchQuery,
  filters = {},
  builds = {},
  id
) {
  return async function action(dispatch, getState) {
    dispatch({ type: FETCH_ENGINES });

    const query = `
      ${engineFieldsFragment}
      query Engines(
        $name: String = ""
        $offset: Int
        $limit: Int
        $owned: Boolean
        $filter: EngineFilter
        $buildsOffset: Int
        $buildsLimit: Int
        $buildsStatusStr: [String]
        $buildsStatus: [BuildStatus!]
        $buildsId: ID
        $withBuilds: Boolean!
      ) {
        engines(
          name: $name
          offset: $offset
          limit: $limit
          owned: $owned
          filter: $filter
        ) {
          records {
            ...engineFields
            builds(
              offset: $buildsOffset
              limit: $buildsLimit
              status: $buildsStatusStr
              buildStatus: $buildsStatus
              id: $buildsId
            ) @include(if: $withBuilds) {
              records {
                id
                status
                modifiedDateTime
                manifest
              }
            }
          }
        }
      }
    `;

    const config = getConfig(getState());
    const { apiRoot, graphQLEndpoint } = config;
    const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;

    try {
      const response = await fetchGraphQLApi({
        endpoint: graphQLUrl,
        query,
        variables: {
          name: searchQuery,
          offset,
          limit,
          owned,
          filter: pickBy(filters, (filter = []) => filter && !!filter.length),
          buildsId: builds.id,
          buildsStatusStr: builds.status,
          buildsStatus: builds.buildStatus,
          buildsOffset: builds.offset,
          buildsLimit: builds.limit,
          withBuilds: !isEmpty(builds)
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
        meta: { searchQuery, filters, id }
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

const engineFieldsFragment = `
  fragment engineFields on Engine {
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
  }
`;
