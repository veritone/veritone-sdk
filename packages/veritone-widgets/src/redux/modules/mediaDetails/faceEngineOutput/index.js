export const namespace = 'face-engine-output';

export const FETCHING_ENGINE_RESULTS = `vtn/${namespace}/FETCHING_ENGINE_RESULTS`;
export const FETCH_ENGINE_RESULTS_SUCCESS = `vtn/${namespace}/FETCH_ENGINE_RESULTS_SUCCESS`;
export const FETCH_ENGINE_RESULTS_FAILURE = `vtn/${namespace}/FETCH_ENGINE_RESULTS_FAILURE`;
export const DONE_FETCHING_ENGINE_RESULTS = `vtn/${namespace}/DONE_FETCHING_ENGINE_RESULTS`;

export const FETCH_ENTITIES = `vtn/${namespace}/FETCH_ENTITIES`;
export const FETCH_ENTITIES_SUCCESS = `vtn/${namespace}/FETCH_ENTITIES_SUCCESS`;
export const FETCH_ENTITIES_FAILURE = `vtn/${namespace}/FETCH_ENTITIES_FAILURE`;
export const DONE_FETCHING_ENTITIES = `vtn/${namespace}/DONE_FETCH_ENTITIES`;

export const FETCH_LIBRARIES = `vtn/${namespace}/FETCH_LIBRARIES`;
export const FETCH_LIBRARIES_SUCCESS = `vtn/${namespace}/FETCH_LIBRARIES_SUCCESS`;
export const FETCH_LIBRARIES_FAILURE = `vtn/${namespace}/FETCH_LIBRARIES_FAILURE`;

export const CREATE_ENTITY = `vtn/${namespace}/CREATE_ENTITY`;
export const CREATE_ENTITY_SUCCESS = `vtn/${namespace}/CREATE_ENTITY_SUCCESS`;
export const CREATE_ENTITY_FAILURE = `vtn/${namespace}/CREATE_ENTITY_FAILURE`;


import {
get,
map,
findLastIndex,
findIndex,
groupBy,
forEach,
keyBy,
isEmpty,
isObject
} from 'lodash';
import { helpers } from 'veritone-redux-common';
import { createSelector } from 'reselect'

const { createReducer } = helpers;

const defaultState = {
  engineResultsByEngineId: {},
  fetchedEngineResults: {},
  entities: {},
  libraries: {},
  isFetchingEngineResults: false,
  isFetchingEntities: false,
  isFetchingLibraries: false
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
    console.log('action.meta:', action.meta)
    // const entity = action.payload.data.entity;
    const { unrecognizedFaces } = getFaces({ [namespace]: state }, action.meta.selectedEngineId);
    console.log('unrecognizedFaces:', unrecognizedFaces)
    const { selectedEntity } = action.meta;

    const detectedFace = unrecognizedFaces[selectedEntity];
    console.log('face obj:', state.engineResultsByEngineId[action.meta.selectedEngineId][0].series[selectedEntity])
    console.log('detectedFace:', detectedFace)

    // return {
    //   ...state,
    //   entities: {
    //     ...state.entities,
    //     [entity.id]: entity
    //   }
    // };
  },
  [CREATE_ENTITY_FAILURE](state, action) {
    return {
      ...state
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

export const getEngineResultsByEngineId = (state, engineId) => {
  console.log('state:', state)
  console.log('local(state):', local(state));
  console.log('engineId:', engineId);
  console.log('engineResult:', get(local(state), ['engineResultsByEngineId', engineId]));

  return map(
    get(local(state), ['engineResultsByEngineId', engineId]),
    engineResults => ({ series: engineResults.series })
  );

}

export const fetchedEngineResultByEngineId = (state, engineId) =>
  get(local(state), ['fetchedEngineResults', engineId], [])


  /* LIBRARY ENTITIES */
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
export function isFetchingEntities(state) {
  return local(state).isFetchingEntities;
}
export const getEntities = (state) =>
  Object.values(get(local(state), 'entities', []));


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

/* SELECTORS */
export const getFaces = createSelector(
  [getEngineResultsByEngineId, getEntities],
  (faceData, entities) => {
    console.log('+'.repeat(50))
    const faceEntities = {
      unrecognizedFaces: [],
      recognizedFaces: {},
      entitiesByLibrary: {},
      framesBySeconds: {}
    };

    console.log('faceData:', faceData)

    function setRecognizedEntityObj(recognizedEntityObj, faceObj) {
      return {
        ...recognizedEntityObj,
        count: recognizedEntityObj.count + 1,
        timeSlots: [
          ...recognizedEntityObj.timeSlots,
          {
            stopTimeMs: faceObj.stopTimeMs,
            startTimeMs: faceObj.startTimeMs,
            originalImage: faceObj.object.uri,
            confidence: faceObj.object.confidence
          }
        ],
        stopTimeMs:
          recognizedEntityObj.stopTimeMs <= faceObj.stopTimeMs
            ? faceObj.stopTimeMs
            : recognizedEntityObj.stopTimeMs
      };
    };

    function getFrameNamespaceForMatch(faceObj) {
      if (faceObj.object.boundingPoly) {
        return JSON.stringify(faceObj.object.boundingPoly);
      }
    };

    // Gets list of nearest seconds which the face/entity appears in (MS)
    function getArrayOfSecondSpots(timeSlot) {
      const secondSpots = [];

      if (!isObject(timeSlot) || !timeSlot.startTimeMs || !timeSlot.stopTimeMs) {
        return secondSpots;
      }

      let timeCursor = timeSlot.startTimeMs - timeSlot.startTimeMs % 1000;

      while (timeCursor <= timeSlot.stopTimeMs) {
        secondSpots.push(timeCursor);
        timeCursor += 1000;
      }

      return secondSpots;
    };

    // if (isEmpty(faceData)) {
    //   return faceEntities;
    // }

    // flatten data series for currently selected engine
    const faceSeries = faceData.reduce((accumulator, faceSeries) => {
      if (!isEmpty(faceSeries.series)) {
        return [...accumulator, ...faceSeries.series];
      }
      return accumulator;
    }, []);

    faceSeries.forEach(faceObj => { // for each face object
      // locate entity that the face object belongs to
      const entity = find(entities, { id: faceObj.object.entityId });

      if (!faceObj.entityId || !entities.length || !entity || !entity.name) {
        faceEntities.unrecognizedFaces.push(faceObj);
      } else {
        // try to locate library entity that contains the face object
        const libraryEntity = find(entities, { libraryId: entity.libraryId });
        // build object for library entity for "recognized" face
        const recognizedEntityObj = {
          entityId: entity.id,
          libraryId: libraryEntity.libraryId,
          libraryName: libraryEntity.library.name,
          fullName: entity.name,
          profileImage: entity.profileImageUrl,
          count: 1,
          timeSlots: [
            {
              stopTimeMs: faceObj.stopTimeMs,
              startTimeMs: faceObj.startTimeMs,
              originalImage: faceObj.object.uri,
              confidence: faceObj.object.confidence
            }
          ],
          stopTimeMs: faceObj.stopTimeMs
        };

        if (faceEntities.recognizedFaces[entity.id]) {
          faceEntities.recognizedFaces[entity.id] = setRecognizedEntityObj(
            faceEntities.recognizedFaces[entity.id],
            faceObj
          );
        } else {
          faceEntities.recognizedFaces[entity.id] = recognizedEntityObj;
          faceEntities.entitiesByLibrary[libraryEntity.libraryId] = {
            libraryId: libraryEntity.libraryId,
            libraryName: recognizedEntityObj.libraryName,
            faces: [
              ...get(
                faceEntities.entitiesByLibrary[libraryEntity.libraryId],
                'faces',
                []
              ),
              recognizedEntityObj
            ]
          };
        }

        // TODO: optimize this so that we aren't storing a map since this will probably get pretty big
        const matchNamespace = getFrameNamespaceForMatch(faceObj);
        if (matchNamespace) {
          const secondSpots = getArrayOfSecondSpots(faceObj);
          secondSpots.forEach(second => {
            if (!faceEntities.secondMap[second]) {
              faceEntities.secondMap[second] = {};
            }
            if (!faceEntities.secondMap[second][matchNamespace]) {
              faceEntities.secondMap[second][matchNamespace] = {
                startTimeMs: faceObj.startTimeMs,
                stopTimeMs: faceObj.stopTimeMs,
                originalImage: faceObj.object.uri,
                entities: [],
                boundingPoly: faceObj.object.boundingPoly
              };
            }

            const match = {
              confidence: faceObj.object.confidence,
              entityId: faceObj.object.entityId
            };

            faceEntities.secondMap[second][matchNamespace].entities.push(match);
            faceEntities.secondMap[second][matchNamespace].entities.sort((a, b) => {
              return b.confidence - a.confidence;
            });
          });
        }
      }
    });

    return faceEntities;
  }
)
