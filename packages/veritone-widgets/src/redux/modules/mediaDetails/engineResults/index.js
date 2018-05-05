export const FETCH_ENGINE_RESULTS = 'vtn/engine-results/FETCH_ENGINE_RESULTS';
export const FETCH_ENGINE_RESULTS_SUCCESS = 'vtn/engine-results/FETCH_ENGINE_RESULTS_SUCCESS';
export const FETCH_ENGINE_RESULTS_FAILURE = 'vtn/engine-results/FETCH_ENGINE_RESULTS_FAILURE';
export const FETCHING_ENGINE_RESULTS = 'FETCHING_ENGINE_RESULTS';
export const DONE_FETCHING_ENGINE_RESULTS = 'DONE_FETCHING_ENGINE_RESULTS';

import {
get,
map,
findLastIndex,
findIndex,
groupBy,
forEach
} from 'lodash';

import { createReducer } from 'helpers/redux';

export const namespace = 'engine-results';

const defaultState = {
  'engine-results': {},
  isFetchingEngineResults: false,
  fetchingFailed: false
};

const reducer = createReducer(defaultState, {
  [FETCHING_ENGINE_RESULTS](state, action) {
    return {
      ...state,
      isFetchingEngineResults: true
    }
  },
  [DONE_FETCHING_ENGINE_RESULTS](state, action) {
    return {
      ...state,
      isFetchingEngineResults: false
    }
  },
  [FETCH_ENGINE_RESULTS](state, { payload }) {
    let resultRequests =
      state.engineResultRequestsByEngineId[payload.engineId] || [];
    const requestInsertIndex = findLastIndex(resultRequests, request => {
      return request.stopOffsetMs < payload.startOffsetMs;
    });
    resultRequests = [
      ...resultRequests.slice(0, requestInsertIndex + 1),
      {
        startOffsetMs: payload.startOffsetMs,
        stopOffsetMs: payload.stopOffsetMs,
        status: 'FETCHING'
      },
      ...resultRequests.slice(requestInsertIndex + 1)
    ];

    let engineResults =
      state.engineResultsByEngineId[payload.engineId] || [];
    let resultInsertIndex = findLastIndex(engineResults, result => {
      return (
        result.series[result.series.length - 1].startTimeMs <=
        payload.startOffsetMs
      );
    });

    return {
      ...state,
      engineResultRequestsByEngineId: {
        ...state.engineResultRequestsByEngineId,
        [payload.engineId]: [...resultRequests]
      },
      engineResultsByEngineId: {
        ...state.engineResultsByEngineId,
        [payload.engineId]: [
          ...engineResults.slice(0, resultInsertIndex + 1),
          {
            startOffsetMs: payload.startOffsetMs,
            stopOffsetMs: payload.stopOffsetMs,
            status: 'FETCHING'
          },
          ...engineResults.slice(resultInsertIndex + 1)
        ]
      }
    }
  },
  [FETCH_ENGINE_RESULTS_SUCCESS](state, action) {
    if (action.payload.error) {
      return this[FETCH_ENGINE_RESULTS_FAILURE](state, action);
    }

    const { startOffsetMs, stopOffsetMs } = action.meta;

    let previousResultsByEngineId = state.engineResultsByEngineId || {};
    let engineResultRequestsById = state.engineResultRequestsByEngineId;
    // It is possible results were requested by
    const resultsGroupedByEngineId = groupBy(action.payload, 'engineId');

    forEach(resultsGroupedByEngineId, (results, engineId) => {
      if (!previousResultsByEngineId[engineId]) {
        // Data hasn't been retrieved for this engineId yet
        previousResultsByEngineId[engineId] = map(results, 'jsondata');
      } else {
        // New results need to be merged with previously fetched results
        const insertionIndex = findIndex(previousResultsByEngineId[engineId], {
          startOffsetMs,
          stopOffsetMs,
          status: 'FETCHING'
        });

        // TODO: fitler out any duplicate data that overflows time chunks.
        previousResultsByEngineId[engineId] = [
          ...previousResultsByEngineId[engineId].slice(0, insertionIndex),
          ...map(results, 'jsondata'),
          ...previousResultsByEngineId[engineId].slice(insertionIndex + 1)
        ];
      }

      engineResultRequestsById[engineId] = engineResultRequestsById[
        engineId
      ].map(request => {
        if (
          request.startOffsetMs === startOffsetMs &&
          request.stopOffsetMs == stopOffsetMs &&
          request.status === 'FETCHING'
        ) {
          return {
            ...request,
            status: 'SUCCESS'
          };
        }
        return request;
      });
    });

    return {
      ...state,
      // success: !error || null,
      success: true,
      // error: error ? errorMessage : null,
      engineResultsByEngineId: {
        ...previousResultsByEngineId
      },
      engineResultRequestsByEngineId: {
        ...engineResultRequestsById
      }
    };
  },
  [FETCH_ENGINE_RESULTS_FAILURE](state, { payload, meta }) {
    return {
      ...state,
      error: payload.error,
      meta
    }
  }
});

export const isFetchingEngineResults = () => ({ type: FETCHING_ENGINE_RESULTS });
export const doneFetchingEngineResults = () => ({ type: DONE_FETCHING_ENGINE_RESULTS });
export const fetchEngineResultsSuccess = (payload) => ({
  type: FETCH_ENGINE_RESULTS_SUCCESS,
  payload
});
export const fetchEngineResultsFailure = (payload) => ({
  type: FETCH_ENGINE_RESULTS_FAILURE,
  payload
});


export default reducer;
