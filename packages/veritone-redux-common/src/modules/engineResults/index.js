import { createReducer } from 'helpers/redux';
import { callGraphQL } from 'helpers/api';
import { get, groupBy, find } from 'lodash';

export const namespace = 'engineResults';

export const FETCH_ENGINE_RESULTS = `vtn/${namespace}/FETCH_ENGINE_RESULTS`;
export const FETCH_ENGINE_RESULTS_SUCCESS = `vtn/${namespace}/FETCH_ENGINE_RESULTS_SUCCESS`;
export const FETCH_ENGINE_RESULTS_FAILURE = `vtn/${namespace}/FETCH_ENGINE_RESULTS_FAILURE`;

const defaultState = {
  engineResultsMappedByEngineId: {},
  fetchedEngineResults: {},
  isFetchingEngineResults: false,
  fetchEngineResultsError: null
};

export default createReducer(defaultState, {
  [FETCH_ENGINE_RESULTS](state, action) {
    console.log('FETCH_ENGINE_RESULTS', state, action);
    return {
      ...state,
      isFetchingEngineResults: true
    };
  },
  [FETCH_ENGINE_RESULTS_SUCCESS](state, action) {
    console.log('FETCH_ENGINE_RESULTS_SUCCESS', state, action);
    if (action.payload.errors) {
      return this[FETCH_ENGINE_RESULTS_FAILURE](state, action);
    }

    const results = get(action, 'payload.engineResults.records').map(result => {
      return {
        ...result.jsondata,
        userEdited: result.userEdited,
        assetId: result.assetId
      };
    });
    const resultsGroupedByEngineId = groupBy(results, 'sourceEngineId');

    return {
      ...state,
      isFetchingEngineResults: false,
      fetchEngineResultsError: null,
      engineResultsMappedByEngineId: {
        ...state.engineResultsMappedByEngineId,
        ...resultsGroupedByEngineId
      }
    };
  },
  [FETCH_ENGINE_RESULTS_FAILURE](state, action) {
    return {
      ...state,
      isFetchingEngineResults: false,
      fetchEngineResultsError:
        get(action, 'payload[0].message') || 'Error fetching engine results'
    };
  }
});

function local(state) {
  return state[namespace];
}

export const engineResults = state =>
  local(state).engineResultsMappedByEngineId;

export const engineResultsByEngineId = (state, engineId) =>
  get(local(state), ['engineResultsMappedByEngineId', engineId], []);

export const isFetchingEngineResults = state =>
  local(state).isFetchingEngineResults;

export const isDisplayingUserEditedOutput = (state, engineId) => {
  const results = engineResultsByEngineId(state, engineId);
  return !!find(results, { userEdited: true });
};

export const fetchEngineResults = ({
  tdo,
  engineId,
  startOffsetMs,
  stopOffsetMs,
  ignoreUserEdited = false
} = {}) => async (dispatch, getState) => {
  const getEngineResultsQuery = `query engineResults($tdoId: ID!, $engineIds: [ID!]!, $startOffsetMs: Int, $stopOffsetMs: Int, $ignoreUserEdited: Boolean) {
    engineResults(tdoId: $tdoId, engineIds: $engineIds, startOffsetMs: $startOffsetMs, stopOffsetMs: $stopOffsetMs, ignoreUserEdited: $ignoreUserEdited) {
      records {
        tdoId
        engineId
        startOffsetMs
        stopOffsetMs
        jsondata
        assetId
        userEdited
      }
    }
  }`;

  const variables = { tdoId: tdo.id, engineIds: [engineId], ignoreUserEdited };
  if (startOffsetMs) {
    variables.startOffsetMs = startOffsetMs;
  }
  if (stopOffsetMs) {
    variables.stopOffsetMs = stopOffsetMs;
  }
  const response = await callGraphQL({
    actionTypes: [
      FETCH_ENGINE_RESULTS,
      FETCH_ENGINE_RESULTS_SUCCESS,
      FETCH_ENGINE_RESULTS_FAILURE
    ],
    query: getEngineResultsQuery,
    variables,
    dispatch,
    getState
  });

  return response;
};
