import { createReducer } from 'helpers/redux';
import callGraphQLApi from 'helpers/api/callGraphQLApi';
import { get, groupBy, find, forEach } from 'lodash';
import { guid } from 'helpers/misc';

export const namespace = 'engineResults';

export const FETCH_ENGINE_RESULTS = `vtn/${namespace}/FETCH_ENGINE_RESULTS`;
export const FETCH_ENGINE_RESULTS_SUCCESS = `vtn/${namespace}/FETCH_ENGINE_RESULTS_SUCCESS`;
export const FETCH_ENGINE_RESULTS_FAILURE = `vtn/${namespace}/FETCH_ENGINE_RESULTS_FAILURE`;
export const CLEAR_ENGINE_RESULTS_BY_ENGINE_ID = `vtn/${namespace}/CLEAR_ENGINE_RESULTS_BY_ENGINE_ID`;

export const defaultState = {
  engineResultsMappedByEngineId: {},
  fetchedEngineResults: {},
  isFetchingEngineResults: false,
  fetchEngineResultsError: null
};

export default createReducer(defaultState, {
  [FETCH_ENGINE_RESULTS](state, action) {
    return {
      ...state,
      isFetchingEngineResults: true
    };
  },
  [FETCH_ENGINE_RESULTS_SUCCESS](state, action) {
    if (action.payload.errors) {
      return this[FETCH_ENGINE_RESULTS_FAILURE](state, action);
    }

    // requestEngineId could be different from the jsondata.sourceEngineId (internal engine id vs GUID)
    // so group by requestEngineId, keep grouped results and remove requestEngineId from the results
    const results = get(action, 'payload.engineResults.records').map(result => {
      forEach(get(result, 'jsondata.series'), seriesItem => {
        seriesItem.guid = guid();
      });
      return {
        ...result.jsondata,
        userEdited: result.userEdited,
        assetId: result.assetId,
        requestEngineId: result.engineId
      };
    });

    const resultsGroupedByRequestEngineId = groupBy(results, 'requestEngineId');
    forEach(Object.keys(resultsGroupedByRequestEngineId),
      engineId =>
        resultsGroupedByRequestEngineId[engineId]
          .forEach(result => delete result.requestEngineId));

    return {
      ...state,
      isFetchingEngineResults: false,
      fetchEngineResultsError: null,
      engineResultsMappedByEngineId: {
        ...state.engineResultsMappedByEngineId,
        ...resultsGroupedByRequestEngineId
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
  },
  [CLEAR_ENGINE_RESULTS_BY_ENGINE_ID](state, { engineId }) {
    return {
      ...state,
      engineResultsMappedByEngineId: {
        ...state.engineResultsMappedByEngineId,
        [engineId]: []
      }
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

export const clearEngineResultsByEngineId = engineId => ({
  type: CLEAR_ENGINE_RESULTS_BY_ENGINE_ID,
  engineId
});

export const getEngineResultsQuery = `query engineResults($tdoId: ID!, $engineIds: [ID!]!, $startOffsetMs: Int, $stopOffsetMs: Int, $ignoreUserEdited: Boolean) {
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

export const fetchEngineResults = ({
  tdo,
  engineId,
  startOffsetMs,
  stopOffsetMs,
  ignoreUserEdited = false
} = {}) => async (dispatch, getState) => {
  const variables = { tdoId: tdo.id, engineIds: [engineId], ignoreUserEdited };
  if (startOffsetMs) {
    variables.startOffsetMs = startOffsetMs;
  }
  if (stopOffsetMs) {
    variables.stopOffsetMs = stopOffsetMs;
  }
  const response = await callGraphQLApi({
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
