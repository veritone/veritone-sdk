import { createReducer } from 'helpers/redux';
import callGraphQLApi from 'helpers/api/callGraphQLApi';
import { get, groupBy, find, forEach, some, uniq, differenceBy } from 'lodash';
import { guid } from 'helpers/misc';

export const namespace = 'engineResults';

export const FETCH_ENGINE_RESULTS = `vtn/${namespace}/FETCH_ENGINE_RESULTS`;
export const FETCH_ENGINE_RESULTS_SUCCESS = `vtn/${namespace}/FETCH_ENGINE_RESULTS_SUCCESS`;
export const FETCH_ENGINE_RESULTS_FAILURE = `vtn/${namespace}/FETCH_ENGINE_RESULTS_FAILURE`;
export const CLEAR_ENGINE_RESULTS_BY_ENGINE_ID = `vtn/${namespace}/CLEAR_ENGINE_RESULTS_BY_ENGINE_ID`;

export const defaultState = {
  tdoEngineResultsMappedByEngineId: {},
  isFetchingSpecificEngineResult: {},
  isFetchingEngineResults: false,
  fetchEngineResultsError: null
};

export default createReducer(defaultState, {
  [FETCH_ENGINE_RESULTS](state, action) {
    const engineFlagsByIds = get(action, 'meta.variables.engineIds', []).reduce((acc, id) => {
      return {
        ...acc,
        [id]: true
      }
    }, {});
    return {
      ...state,
      isFetchingEngineResults: true,
      isFetchingSpecificEngineResult: {
        ...state.isFetchingSpecificEngineResult,
        ...engineFlagsByIds
      }
    };
  },
  [FETCH_ENGINE_RESULTS_SUCCESS](state, action) {
    if (action.payload.errors) {
      return this[FETCH_ENGINE_RESULTS_FAILURE](state, action);
    }

    // requestEngineId could be different from the jsondata.sourceEngineId (internal engine id vs GUID)
    // so group by requestEngineId, keep grouped results and remove requestEngineId from the results
    let results = get(action, 'payload.engineResults.records').map(result => {
      forEach(get(result, 'jsondata.series'), seriesItem => {
        seriesItem.guid = guid();
      });
      return {
        ...result.jsondata,
        userEdited: result.userEdited,
        assetId: result.assetId,
        requestEngineId: result.engineId,
        tdoId: result.tdoId
      };
    });

    // handle legacy user edited transcript that is return by API along with the original
    if (some(results, { requestEngineId: 'manual', userEdited: true })) {
      const requestEngineIds = uniq(
        results
          .filter(result => result.requestEngineId !== 'manual')
          .map(result => result.requestEngineId)
      );
      if (requestEngineIds.length === 1) {
        const requestEngineId = requestEngineIds[0];
        // if exists user edited version for requested engine id - ignore manual edit
        if (!some(results, { requestEngineId: requestEngineId, userEdited: true })) {
          const originalEngineResult = find(results, { requestEngineId });
          // keep only 'manual' results
          results = differenceBy(results, [{ requestEngineId }], 'requestEngineId');
          // remap 'manual' results with requestEngineId
          forEach(results, manualEditEngineResult => {
            manualEditEngineResult.requestEngineId = originalEngineResult.requestEngineId;
            manualEditEngineResult.sourceEngineId = originalEngineResult.sourceEngineId;
          });
        }
      }
    }
    const engineFlagsByIds = {};
    // store results mapping
    const tdoEngineResultsMappedByEngineId = {
      ...state.tdoEngineResultsMappedByEngineId
    };
    const resultsGroupedByTdoId = groupBy(results, 'tdoId');
    forEach(Object.keys(resultsGroupedByTdoId), tdoId => {
      const resultsGroupedByRequestEngineId = groupBy(resultsGroupedByTdoId[tdoId], 'requestEngineId');
      forEach(Object.keys(resultsGroupedByRequestEngineId),
        engineId =>
          resultsGroupedByRequestEngineId[engineId]
            .forEach(result => {
              engineFlagsByIds[result.requestEngineId] = false;
              delete result.requestEngineId;
              delete result.tdoId;
            }));
      tdoEngineResultsMappedByEngineId[tdoId] = {
        ...state.tdoEngineResultsMappedByEngineId[tdoId],
        ...resultsGroupedByRequestEngineId
      };
    });

    return {
      ...state,
      isFetchingEngineResults: false,
      isFetchingSpecificEngineResult: {
        ...state.isFetchingSpecificEngineResult,
        ...engineFlagsByIds
      },
      fetchEngineResultsError: null,
      tdoEngineResultsMappedByEngineId
    };
  },
  [FETCH_ENGINE_RESULTS_FAILURE](state, action) {
    const engineFlagsByIds = get(action, 'meta.variables.engineIds', []).reduce((acc, id) => {
      return {
        ...acc,
        [id]: false
      }
    }, {});
    return {
      ...state,
      isFetchingEngineResults: false,
      isFetchingSpecificEngineResult: {
        ...state.isFetchingSpecificEngineResult,
        ...engineFlagsByIds
      },
      fetchEngineResultsError:
        get(action, 'payload[0].message') || 'Error fetching engine results'
    };
  },
  [CLEAR_ENGINE_RESULTS_BY_ENGINE_ID](state, { tdoId, engineId }) {
    const tdoEngineResultsMappedByEngineId = {
      ...state.tdoEngineResultsMappedByEngineId
    };
    tdoEngineResultsMappedByEngineId[tdoId][engineId] = [];
    return {
      ...state,
      tdoEngineResultsMappedByEngineId
    };
  }
});

function local(state) {
  return state[namespace];
}

export const engineResultsByEngineId = (state, tdoId, engineId) =>
  get(local(state), ['tdoEngineResultsMappedByEngineId', tdoId, engineId], []);

export const isFetchingEngineResults = state =>
  local(state).isFetchingEngineResults;

export const isFetchingSpecificEngineResult = (state) => engineId =>
  get(local(state), ['isFetchingSpecificEngineResult', engineId], false);

export const isDisplayingUserEditedOutput = (state, tdoId, engineId) => {
  const results = engineResultsByEngineId(state, tdoId, engineId);
  return !!find(results, { userEdited: true });
};

export const clearEngineResultsByEngineId = (tdoId, engineId) => ({
  type: CLEAR_ENGINE_RESULTS_BY_ENGINE_ID,
  tdoId,
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
