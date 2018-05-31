export const namespace = 'face-engine-output';

export const FETCH_ENGINE_RESULTS = `vtn/${namespace}/FETCH_ENGINE_RESULTS`;
export const FETCHING_ENGINE_RESULTS = `vtn/${namespace}/FETCHING_ENGINE_RESULTS`;
export const FETCH_ENGINE_RESULTS_SUCCESS = `vtn/${namespace}/FETCH_ENGINE_RESULTS_SUCCESS`;
export const FETCH_ENGINE_RESULTS_FAILURE = `vtn/${namespace}/FETCH_ENGINE_RESULTS_FAILURE`;
export const DONE_FETCHING_ENGINE_RESULTS = `vtn/${namespace}/DONE_FETCHING_ENGINE_RESULTS`;

export const FETCH_ENTITIES = `vtn/${namespace}/FETCH_ENTITIES`;
export const FETCH_ENTITIES_SUCCESS = `vtn/${namespace}/FETCH_ENTITIES_SUCCESS`;
export const FETCH_ENTITIES_FAILURE = `vtn/${namespace}/FETCH_ENTITIES_FAILURE`;

export const FETCH_LIBRARIES = `vtn/${namespace}/FETCH_LIBRARIES`;
export const FETCH_LIBRARIES_SUCCESS = `vtn/${namespace}/FETCH_LIBRARIES_SUCCESS`;
export const FETCH_LIBRARIES_FAILURE = `vtn/${namespace}/FETCH_LIBRARIES_FAILURE`;

export const CREATE_ENTITY = `vtn/${namespace}/CREATE_ENTITY`;
export const CREATE_ENTITY_SUCCESS = `vtn/${namespace}/CREATE_ENTITY_SUCCESS`;
export const CREATE_ENTITY_FAILURE = `vtn/${namespace}/CREATE_ENTITY_FAILURE`;

export const SEARCH_ENTITIES = `vtn/${namespace}/SEARCH_ENTITIES`;
export const SEARCHING_ENTITIES = `vtn/${namespace}/SEARCHING_ENTITIES`;
export const SEARCH_ENTITIES_SUCCESS = `vtn/${namespace}/SEARCH_ENTITIES_SUCCESS`;
export const SEARCH_ENTITIES_FAILURE = `vtn/${namespace}/SEARCH_ENTITIES_FAILURE`;

export const UPDATE_ENGINE_RESULT_ENTITY = `vtn/${namespace}/UPDATE_ENGINE_RESULT_ENTITY`;

export const REMOVE_USER_DETECTED_FACES = `vtn/${namespace}/REMOVE_USER_DETECTED_FACES`;

const UPDATE_ENGINE_RESULT = `vtn/${namespace}/UPDATE_ENGINE_RESULT`;

import {
  get,
  map,
  findIndex,
  find,
  groupBy,
  forEach,
  keyBy,
  isEmpty,
  set,
  pick,
  flatten
} from 'lodash';
import { helpers } from 'veritone-redux-common';
import { createSelector } from 'reselect'

const { createReducer } = helpers;

const defaultState = {
  engineResultsByEngineId: {},
  fetchedEngineResults: {},
  entities: {},
  libraries: {},
  entitySearchResults: [],
  isFetchingEngineResults: false,
  isFetchingEntities: false,
  isFetchingLibraries: false,
  isSearchingEntities: false,
  facesDetectedByUser: {}
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
  [FETCH_ENTITIES](state, action) {
    return {
      ...state,
      isFetchingEntities: true
    }
  },
  [FETCH_ENTITIES_SUCCESS](state, action) {
    if (action.payload.errors) {
      return this[FETCH_ENTITIES_FAILURE](state, action);
    }

    const entities = keyBy(Object.values(action.payload.data), 'id');

    return {
      ...state,
      entities: {
        ...state.entities,
        ...entities
      },
      isFetchingEntities: false,
    };
  },
  [FETCH_ENTITIES_FAILURE](state, action) {
    return {
      ...state,
      isFetchingEntities: false
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
  },
  [CREATE_ENTITY_SUCCESS](state, action) {
    if (action.payload.errors) {
      return this[CREATE_ENTITY_FAILURE](state, action);
    }

    const payload = {
      ...pick(action.meta, ['faceObj', 'selectedEngineId']),
      entity: action.payload.data.entity
    }

    return this[UPDATE_ENGINE_RESULT_ENTITY](state, { payload });
  },
  [CREATE_ENTITY_FAILURE](state, action) {
    return {
      ...state
    }
  },
  [SEARCHING_ENTITIES](state, action) {
    return {
      ...state,
      isSearchingEntities: true
    }
  },
  [SEARCH_ENTITIES_SUCCESS](state, action) {
    if (action.payload.errors) {
      return this[SEARCH_ENTITIES_FAILURE](state, action);
    }

    const entitySearchResults = [];

    get(action.payload.data, 'libraries.records', [])
    .forEach(libraryEntities => {
      if (libraryEntities.entities.records.length) {
        entitySearchResults.push(libraryEntities.entities.records);
      }
    });

    return {
      ...state,
      entitySearchResults: flatten(entitySearchResults),
      isSearchingEntities: false
    }
  },
  [SEARCH_ENTITIES_FAILURE](state, action) {
    return {
      ...state,
      isSearchingEntities: false
    }
  },
  [UPDATE_ENGINE_RESULT_ENTITY](state, action) {
    const { faceObj, selectedEngineId, entity } = action.payload;
    const objectCriteria = pick(faceObj.object, ['uri', 'boundingPoly']);

    const detectedFacePath = state.engineResultsByEngineId[selectedEngineId]
      .reduce((acc, engineResult, engineResultIdx) => {
        const faceIdx = findIndex(engineResult.series, { object: objectCriteria });

        // return (faceIdx > -1) ? [engineResultIdx, 'series', faceIdx] : acc;
        return (faceIdx > -1) ? `[${engineResultIdx}].series[${faceIdx}]` : acc;
      }, []);

    if (!detectedFacePath.length) {
      return {
        ...state
      };
    }

    return {
      ...state,
      facesDetectedByUser: {
        ...state.facesDetectedByUser,
        [selectedEngineId]: {
          ...state.facesDetectedByUser[selectedEngineId],
          [detectedFacePath]: {
            ...faceObj,
            object: {
              ...faceObj.object,
              entityId: entity.id,
              libraryId: entity.libraryId
            }
          }
        }
      },
      entities: {
        ...state.entities,
        [entity.id]: entity
      }
    }

    // const engineResults = [...state.engineResultsByEngineId[selectedEngineId]];

    // set(engineResults, detectedFacePath, {
    //   ...faceObj,
    //   object: {
    //     ...faceObj.object,
    //     entityId: entity.id,
    //     libraryId: entity.libraryId
    //   }
    // });

    // return {
    //   ...state,
    //   engineResultsByEngineId: {
    //     ...state.engineResultsByEngineId,
    //     [selectedEngineId]: engineResults
    //   },
    //   entities: {
    //     ...state.entities,
    //     [entity.id]: entity
    //   }
    // }
  },
  [UPDATE_ENGINE_RESULT](state, action) {
    const engineResult = { ...state.engineResultsByEngineId[action.payload.selectedEngineId][0] };
    engineResult.series = [...engineResult.series, ...action.payload.unrecognizedFaces];

    return {
      ...state,
      engineResultsByEngineId: {
        ...state.engineResultsByEngineId,
        [action.payload.selectedEngineId]: [engineResult]
      }
    };
  },
  [REMOVE_USER_DETECTED_FACES](state, action) {
    return {
      ...state,
      facesDetectedByUser: {}
    }
  }
});
export default reducer;

function local(state) {
  return state[namespace];
}

/* ENGINE RESULTS */
export const fetchEngineResults = (meta) => ({
  type: FETCH_ENGINE_RESULTS,
  meta
});
export const fetchingEngineResults = (meta) => ({
  type: FETCHING_ENGINE_RESULTS,
  meta
});
export const doneFetchingEngineResults = () => ({
  type: DONE_FETCHING_ENGINE_RESULTS
});
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
export const updateEngineResultEntity = (selectedEngineId, faceObj, entity) => ({
  type: UPDATE_ENGINE_RESULT_ENTITY,
  payload: {
    selectedEngineId,
    faceObj,
    entity
  }
});
export function isFetchingEngineResults(state) {
  return local(state).isFetchingEngineResults;
}
export const getFaceDataByEngine = (state, engineId) =>
get(local(state), ['engineResultsByEngineId', engineId]);
  // map(
  //   get(local(state), ['engineResultsByEngineId', engineId]),
  //   engineResults => ({ series: [...engineResults.series] })
  // );
export const getUserDetectedFaces = (state, engineId) =>
  get(local(state), ['facesDetectedByUser', engineId])

export const fetchedEngineResultByEngineId = (state, engineId) =>
  get(local(state), ['fetchedEngineResults', engineId], [])


  /* ENTITIES */
export const fetchingEntities = (meta) => ({
  type: FETCH_ENTITIES,
  meta
});
export const fetchEntitiesSuccess = (payload, meta) => ({
  type: FETCH_ENTITIES_SUCCESS,
  payload,
  meta
});
export const fetchEntitiesFailure = (error, meta) => ({
  type: FETCH_ENTITIES_FAILURE,
  error,
  meta
});
export const createEntity = (payload, meta) => ({
  type: CREATE_ENTITY,
  payload,
  meta
});
export const createEntitySuccess = (payload, meta) => ({
  type: CREATE_ENTITY_SUCCESS,
  payload,
  meta
});
export const createEntityFailure = (payload, meta) => ({
  type: CREATE_ENTITY_FAILURE,
  payload,
  meta
});

export const fetchingEntitySearchResults = () => ({
  type: SEARCHING_ENTITIES
});
export const fetchEntitySearchResults = (libraryType, searchText) => ({
  type: SEARCH_ENTITIES,
  payload: {
    libraryType,
    searchText
  }
});
export const fetchEntitySearchResultsSuccess = (payload, meta) => ({
  type: SEARCH_ENTITIES_SUCCESS,
  payload,
  meta
});
export const fetchEntitySearchResultsFailure = (payload, meta) => ({
  type: SEARCH_ENTITIES_FAILURE,
  payload,
  meta
});

export function isFetchingEntities(state) {
  return local(state).isFetchingEntities;
}

export function isSearchingEntities(state) {
  return local(state).isSearchingEntities;
}

export const getEntities = (state) =>
  Object.values(get(local(state), 'entities', []));

export function getEntitySearchResults(state) {
  return get(local(state), 'entitySearchResults', []);
}


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

export function getLibraries(state) {
  return Object.values(local(state).libraries);
}

/* USER DETECTED FACES */
export const removeUserDetectedFaces = () => ({
  type: REMOVE_USER_DETECTED_FACES,
});


/* SELECTORS */
export const getFaces = createSelector(
  [getFaceDataByEngine, getUserDetectedFaces, getEntities],
  (faceData, userDetectedFaces, entities) => {
    const faceEntities = {
      unrecognizedFaces: [],
      // recognizedFaces: [],
      recognizedFaces: {},
    };

    // flatten data series for currently selected engine
    // const faceSeries = faceData.reduce((accumulator, faceSeries) => {
    const faceSeries = addUserDetectedFaces(faceData, userDetectedFaces)
    .reduce((accumulator, faceSeries) => {
      if (!isEmpty(faceSeries.series)) {
        return [...accumulator, ...faceSeries.series];
      }
      return accumulator;
    }, []);

    faceSeries.forEach(faceObj => { // for each face object
      // locate entity that the face object belongs to
      const entity = find(entities, { id: faceObj.object.entityId });

      if (!faceObj.object.entityId || !entities.length || !entity || !entity.name) {
        faceEntities.unrecognizedFaces.push(faceObj);
      } else {
        // faceEntities.recognizedFaces.push(faceObj);
        faceEntities.recognizedFaces[faceObj.object.entityId] = faceObj;
      }
    });

    return faceEntities;
  }
)

export const getFaceEngineAssetData = (state, engineId) => {
  // const engineResults = local(state).engineResultsByEngineId[engineId];
  const engineResults =  getFaceDataByEngine(state, engineId);
  const userDetectedFaces = getUserDetectedFaces(state, engineId);

  // On the result use engineAliasId for 'user-edited-face-engine-results'
  const userEdited = {
    sourceEngineId: '7a3d86bf-331d-47e7-b55c-0434ec6fe5fd',
    sourceEngineName: 'User Generated'
  };
  // const allSeries = engineResults.reduce((accumulator, engineResult) => {
  const allSeries = addUserDetectedFaces(engineResults, userDetectedFaces)
  .reduce((accumulator, engineResult) => {
    return [...accumulator, ...engineResult.series];
  }, []);

  return {
    ...userEdited,
    series: allSeries
  }
}

export const updateEngineResult = (selectedEngineId, unrecognizedFaces) => ({
  type: UPDATE_ENGINE_RESULT,
  payload: {
    selectedEngineId,
    unrecognizedFaces
  }
});

function addUserDetectedFaces(engineResults, userDetectedFaces) {
  const updatedFaceData = map(engineResults, data => ({ series: [...data.series] }));


  forEach(userDetectedFaces, (faceObj, faceObjPath) => {
    set(updatedFaceData, faceObjPath, faceObj);
  });

  return updatedFaceData;
}
