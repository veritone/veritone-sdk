export const FETCHING_ENGINE_RESULTS = 'vtn/face-engine-output/FETCHING_ENGINE_RESULTS';
export const FETCH_ENGINE_RESULTS_SUCCESS = 'vtn/face-engine-output/FETCH_ENGINE_RESULTS_SUCCESS';
export const FETCH_ENGINE_RESULTS_FAILURE = 'vtn/face-engine-output/FETCH_ENGINE_RESULTS_FAILURE';
export const DONE_FETCHING_ENGINE_RESULTS = 'vtn/face-engine-output/DONE_FETCHING_ENGINE_RESULTS';

export const FETCHING_LIBRARY_ENTITIES = 'vtn/face-engine-output/FETCHING_LIBRARY_ENTITIES';
export const FETCHING_LIBRARY_ENTITIES_SUCCESS = 'vtn/face-engine-output/FETCHING_LIBRARY_ENTITIES_SUCCESS';
export const FETCHING_LIBRARY_ENTITIES_FAILURE = 'vtn/face-engine-output/FETCHING_LIBRARY_ENTITIES_FAILURE';
export const DONE_FETCHING_LIBRARY_ENTITIES = 'vtn/face-engine-output/DONE_FETCHING_LIBRARY_ENTITIES';

export const FETCH_LIBRARIES = 'vtn/face-engine-output/FETCH_LIBRARIES';
export const FETCH_LIBRARIES_SUCCESS = 'vtn/face-engine-output/FETCH_LIBRARIES_SUCCESS';
export const FETCH_LIBRARIES_FAILURE = 'vtn/face-engine-output/FETCH_LIBRARIES_FAILURE';


import {
get,
map,
findLastIndex,
findIndex,
groupBy,
forEach,
keyBy
} from 'lodash';
import { helpers } from 'veritone-redux-common';

const { createReducer } = helpers;

export const namespace = 'face-engine-output';

const defaultState = {
  engineResultsByEngineId: {},
  fetchedEngineResults: {},
  libraryEntities: {},
  libraries: {},
  isFetchingEngineResults: false,
  isFetchingLibraryEntities: false,
  isFetchingLibraries: false,
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
  [FETCH_ENGINE_RESULTS_SUCCESS](state, action) {
    if (action.payload.errors) {
      return this[FETCH_ENGINE_RESULTS_FAILURE](state, action);
    }

    const engineResults = action.payload.data.engineResults.records;
    const { startOffsetMs, stopOffsetMs } = action.meta;

    const previousResultsByEngineId = state.engineResultsByEngineId || {};
    // const engineResultRequestsById = state.engineResultRequestsByEngineId;
    // It is possible results were requested by
    const resultsGroupedByEngineId = groupBy(engineResults, 'engineId');

    forEach(resultsGroupedByEngineId, (results, engineId) => {
      if (!previousResultsByEngineId[engineId]) {
        // Data hasn't been retrieved for this engineId yet
        previousResultsByEngineId[engineId] = map(results, 'jsondata');
      }
    });

    return {
      ...state,
      engineResultsByEngineId: {
        ...previousResultsByEngineId
      },
      fetchedEngineResults: {
        [action.meta.engineId]: {
          [`${startOffsetMs}-${stopOffsetMs}`]: true
        }
      }
    };
  },
  [FETCH_ENGINE_RESULTS_FAILURE](state, { payload, meta }) {
    return {
      ...state
    }
  },
  [FETCHING_LIBRARY_ENTITIES](state, action) {
    return {
      ...state,
      isFetchingLibraryEntities: true
    }
  },
  [FETCHING_LIBRARY_ENTITIES_SUCCESS](state, action) {
    if (action.payload.errors) {
      return this[FETCHING_LIBRARY_ENTITIES_FAILURE](state, action);
    }

    const libraryEntities = keyBy(Object.values(action.payload.data), 'id');

    return {
      ...state,
      libraryEntities: {
        ...state.libraryEntities,
        ...libraryEntities
      },
      isFetchingLibraryEntities: false,
    };
  },
  [FETCHING_LIBRARY_ENTITIES_FAILURE](state, action) {
    return {
      ...state,
      isFetchingLibraryEntities: false
    }
  },
  [FETCH_LIBRARIES](state, action) {
    return {
      ...state,
      isFetchingLibraries: true
    }
  },
  [FETCH_LIBRARIES_SUCCESS](state, action) {
    if (action.payload.errors) {
      return this[FETCH_LIBRARIES_FAILURE](state, action);
    }

    const libraries = keyBy(action.payload.data.libraries.records, 'id');

    return {
      ...state,
      libraries: {
        ...state.libraries,
        ...libraries
      },
      isFetchingLibraries: false
    };
  },
  [FETCH_LIBRARIES_FAILURE](state, action) {
    return {
      ...state,
      isFetchingLibraries: false
    }
  }
});
export default reducer;

function local(state) {
  return state[namespace];
}

/* ENGINE RESULTS */
export const fetchingEngineResults = (meta) => ({
  type: FETCHING_ENGINE_RESULTS,
  meta
});
export const doneFetchingEngineResults = () => ({ type: DONE_FETCHING_ENGINE_RESULTS });
export const fetchEngineResultsSuccess = (payload, meta) => ({
  type: FETCH_ENGINE_RESULTS_SUCCESS,
  payload,
  meta
});
export const fetchEngineResultsFailure = (error, meta) => ({
  type: FETCH_ENGINE_RESULTS_FAILURE,
  error,
  meta
});

export function isFetchingEngineResults(state) {
  return local(state).isFetchingEngineResults;
}

export const engineResultsByEngineId = (state, engineId) =>
  map(
    get(local(state), ['engineResultsByEngineId', engineId]),
    engineResults => ({ series: engineResults.series })
  );

export const fetchedEngineResultByEngineId = (state, engineId) =>
  get(local(state), ['fetchedEngineResults', engineId], [])


  /* ENTITIES */
export const fetchingLibraryEntities = (meta) => ({
  type: FETCHING_LIBRARY_ENTITIES,
  meta
});
export const fetchLibraryEntitiesSuccess = (payload, meta) => ({
  type: FETCHING_LIBRARY_ENTITIES_SUCCESS,
  payload,
  meta
});
export const fetchLibraryEntitiesFailure = (error, meta) => ({
  type: FETCHING_LIBRARY_ENTITIES_FAILURE,
  error,
  meta
});
export function isFetchingLibraryEntities(state) {
  return local(state).isFetchingLibraryEntities;
}
export const libraryEntities = (state) =>
  Object.values(get(local(state), 'libraryEntities', []));


/* LIBRARIES */
export const fetchLibraries = (payload) => ({
  type: FETCH_LIBRARIES,
  payload
});
export const fetchLibrariesSuccess = (payload, meta) => ({
  type: FETCH_LIBRARIES_SUCCESS,
  payload,
  meta
});
export const fetchLibrariesFailure = (payload, meta) => ({
  type: FETCH_LIBRARIES_FAILURE,
  payload,
  meta
});

export function isFetchingLibraries(state) {
  return local(state).isFetchingLibraries;
}

export function libraries(state) {
  return Object.values(local(state).libraries);
}
