import {
  get,
  has,
  findLastIndex,
  findIndex,
  groupBy,
  forEach,
  map,
  values,
  uniqBy
} from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const LOAD_ENGINE_CATEGORIES_COMPLETE =
  'LOAD_ENGINE_CATEGORIES_COMPLETE';
export const LOAD_ENGINE_RESULTS = 'LOAD_ENGINE_RESULTS';
export const LOAD_ENGINE_RESULTS_COMPLETE = 'LOAD_ENGINE_RESULTS_COMPLETE';
export const LOAD_TDO = 'LOAD_TDO';
export const LOAD_TDO_SUCCESS = 'LOAD_TDO_SUCCESS';
export const UPDATE_TDO = 'UPDATE_TDO';
export const UPDATE_TDO_COMPLETE = 'UPDATE_TDO_COMPLETE';
export const LOAD_CONTENT_TEMPLATES = 'LOAD_CONTENT_TEMPLATES';
export const LOAD_CONTENT_TEMPLATES_COMPLETE =
  'LOAD_CONTENT_TEMPLATES_COMPLETE';
export const LOAD_TDO_CONTENT_TEMPLATES_COMPLETE =
  'LOAD_TDO_CONTENT_TEMPLATES_COMPLETE';
export const UPDATE_TDO_CONTENT_TEMPLATES = 'UPDATE_TDO_CONTENT_TEMPLATES';
export const SELECT_ENGINE_CATEGORY = 'SELECT_ENGINE_CATEGORY';
export const SET_SELECTED_ENGINE_ID = 'SET_SELECTED_ENGINE_ID';
export const TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE';
export const TOGGLE_INFO_PANEL = 'TOGGLE_INFO_PANEL';
export const INITIALIZE_WIDGET = 'INITIALIZE_WIDGET';
export const ADD_ENGINE_RESULTS_REQUEST = 'ADD_ENGINE_RESULTS_REQUEST';
export const TOGGLE_EXPANDED_MODE = 'TOGGLE_EXPANDED_MODE';
export const REQUEST_LIBRARIES = 'REQUEST_LIBRARIES';
export const REQUEST_LIBRARIES_SUCCESS = 'REQUEST_LIBRARIES_SUCCESS';
export const REQUEST_LIBRARIES_FAILURE = 'REQUEST_LIBRARIES_FAILURE';
export const REQUEST_ENTITIES = 'REQUEST_ENTITIES';
export const REQUEST_ENTITIES_SUCCESS = 'REQUEST_ENTITIES_SUCCESS';
export const REQUEST_ENTITIES_FAILURE = 'REQUEST_ENTITIES_FAILURE';

export const namespace = 'mediaDetails';

const defaultMDPState = {
  engineCategories: [],
  engineResultsByEngineId: {},
  engineResultRequestsByEngineId: {}, // A list of engine result request so we don't request already fetched data.
  tdo: null,
  selectedEngineCategory: null,
  selectedEngineId: null,
  editModeEnabled: false,
  loadingEngineResults: false,
  expandedMode: false,
  libraries: [],
  fetchingLibraries: false,
  entities: [],
  fetchingEntities: false,
  contentTemplates: {},
  tdoContentTemplates: {}
};

const defaultState = {};

export default createReducer(defaultState, {
  [INITIALIZE_WIDGET](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...defaultMDPState
      }
    };
  },
  [LOAD_ENGINE_CATEGORIES_COMPLETE](
    state,
    { payload, meta: { warn, error, widgetId } }
  ) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: !(warn || error) || null,
        error: error ? errorMessage : null,
        warning: warn || null,
        engineCategories: payload
      }
    };
  },
  [LOAD_ENGINE_RESULTS](state, { payload, meta: { widgetId } }) {
    let resultRequests =
      state[widgetId].engineResultRequestsByEngineId[payload.engineId] || [];
    let requestInsertIndex = findLastIndex(resultRequests, request => {
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
      state[widgetId].engineResultsByEngineId[payload.engineId] || [];
    let resultInsertIndex = findLastIndex(engineResults, result => {
      return (
        result.series[result.series.length - 1].startTimeMs <=
        payload.startOffsetMs
      );
    });

    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        engineResultRequestsByEngineId: {
          ...state[widgetId].engineResultRequestsByEngineId,
          [payload.engineId]: [...resultRequests]
        },
        engineResultsByEngineId: {
          ...state[widgetId].engineResultsByEngineId,
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
    };
  },
  [LOAD_ENGINE_RESULTS_COMPLETE](
    state,
    { payload, meta: { warn, error, widgetId, startOffsetMs, stopOffsetMs } }
  ) {
    const errorMessage = get(error, 'message', error);

    let previousResultsByEngineId =
      state[widgetId].engineResultsByEngineId || {};
    let engineResultRequestsById =
      state[widgetId].engineResultRequestsByEngineId;
    // It is possible results were requested by
    const resultsGroupedByEngineId = groupBy(payload, 'engineId');
    forEach(resultsGroupedByEngineId, (results, engineId) => {
      if (!previousResultsByEngineId[engineId]) {
        // Data hasn't been retrieved for this engineId yet
        previousResultsByEngineId[engineId] = map(results, 'jsondata');
      } else {
        // New results need to be merged with previously fetched results
        let insertionIndex = findIndex(previousResultsByEngineId[engineId], {
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
      [widgetId]: {
        ...state[widgetId],
        success: !error || null,
        error: error ? errorMessage : null,
        engineResultsByEngineId: {
          ...previousResultsByEngineId
        },
        engineResultRequestsByEngineId: {
          ...engineResultRequestsById
        }
      }
    };
  },
  [LOAD_TDO](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: null,
        error: null,
        warning: null,
        tdo: null
      }
    };
  },
  [LOAD_TDO_SUCCESS](state, { payload, meta: { warn, error, widgetId } }) {
    const tdo = payload;
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: !(warn || error) || null,
        error: error ? errorMessage : null,
        warning: warn || null,
        tdo: tdo
      }
    };
  },
  [UPDATE_TDO](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: null,
        error: null,
        warning: null
      }
    };
  },
  [UPDATE_TDO_COMPLETE](state, { payload, meta: { warn, error, widgetId } }) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: !(warn || error) || null,
        error: error ? errorMessage : null,
        warning: warn || null,
        tdo: payload
      }
    };
  },
  [LOAD_TDO_CONTENT_TEMPLATES_COMPLETE](state, { payload, meta: { warn, error, widgetId } }) {
    const errorMessage = get(error, 'message', error);
    const tdoContentTemplates = {};
    if (payload && payload.records) {
      payload.records.forEach(asset => {
        if (!asset.sourceData || !asset.sourceData.schema) {
          return;
        }
        const contentTemplate = Object.assign({}, asset.sourceData.schema);
        if (asset.transform) {
          contentTemplate.data = JSON.parse(asset.transform);
        }
        if (contentTemplate.dataRegistry && contentTemplate.dataRegistry.name) {
          contentTemplate.name = contentTemplate.dataRegistry.name;
          delete contentTemplate.dataRegistry;
        }
        // keep asset id on the content template for asset CRUD
        contentTemplate.assetId = asset.id;
        tdoContentTemplates[contentTemplate.id] = contentTemplate;
      });
    }
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: !(warn || error) || null,
        error: error ? errorMessage : null,
        warning: warn || null,
        tdoContentTemplates: tdoContentTemplates
      }
    };
  },


  [UPDATE_TDO](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: null,
        error: null,
        warning: null
      }
    };
  },
  [UPDATE_TDO_CONTENT_TEMPLATES](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: null,
        error: null,
        warning: null
      }
    };
  },
  [LOAD_CONTENT_TEMPLATES](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: null,
        error: null,
        warning: null
      }
    };
  },
  [LOAD_CONTENT_TEMPLATES_COMPLETE](
    state,
    { payload, meta: { warn, error, widgetId } }
  ) {
    const errorMessage = get(error, 'message', error);
    const templateSchemas = {};
    // array of data registries containing an array of schemas
    payload.reduce((schemaStore, registryData) => {
      registryData.schemas.records.forEach(schema => {
        // only take schemas that are 'published' and also define field types
        if (
          schema.status === 'published' &&
          has(schema.definition, 'properties')
        ) {
          schemaStore[schema.id] = {
            name: registryData.name
          };
          Object.assign(schemaStore[schema.id], schema);
        }
      });
      return schemaStore;
    }, templateSchemas);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: !(warn || error) || null,
        error: error ? errorMessage : null,
        warning: warn || null,
        contentTemplates: templateSchemas
      }
    };
  },
  [SELECT_ENGINE_CATEGORY](state, { payload, meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        selectedEngineCategory: {
          ...payload
        }
      }
    };
  },
  [SET_SELECTED_ENGINE_ID](state, { payload, meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        selectedEngineId: payload
      }
    };
  },
  [TOGGLE_EDIT_MODE](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        editModeEnabled: !state[widgetId].editModeEnabled,
        expandedMode: !state[widgetId].editModeEnabled
      }
    };
  },
  [TOGGLE_INFO_PANEL](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        infoPanelIsOpen: !state[widgetId].infoPanelIsOpen
      }
    };
  },
  [TOGGLE_EXPANDED_MODE](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        expandedMode: !state[widgetId].expandedMode
      }
    };
  },
  [REQUEST_LIBRARIES](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        fetchingLibraries: true
      }
    };
  },
  [REQUEST_LIBRARIES_SUCCESS](state, { payload, meta: { widgetId } }) {
    let allLibraries = uniqBy(
      values(payload).concat(state[widgetId].libraries),
      'id'
    );
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        fetchingLibraries: false,
        fetchLibrariesError: null,
        libraries: [...allLibraries]
      }
    };
  },
  [REQUEST_LIBRARIES_FAILURE](state, { error, meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        fetchLibrariesError: error,
        fetchingLibraries: false
      }
    };
  },
  [REQUEST_ENTITIES](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        fetchingLibraries: true
      }
    };
  },
  [REQUEST_ENTITIES_SUCCESS](state, { payload, meta: { widgetId } }) {
    let allEntities = uniqBy(
      values(payload).concat(state[widgetId].entities),
      'id'
    );
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        fetchingLibraries: false,
        fetchLibrariesError: null,
        entities: [...allEntities]
      }
    };
  }
});

const local = state => state[namespace];

export const engineCategories = (state, widgetId) =>
  get(local(state), [widgetId, 'engineCategories']);
export const engineResultsByEngineId = (state, widgetId) =>
  get(local(state), [widgetId, 'engineResultsByEngineId']);
export const engineResultRequestsByEngineId = (state, widgetId, engineId) =>
  get(local(state), [widgetId, 'engineResultRequestsByEngineId', engineId]) ||
  [];
export const tdo = (state, widgetId) => get(local(state), [widgetId, 'tdo']);
export const selectedEngineCategory = (state, widgetId) =>
  get(local(state), [widgetId, 'selectedEngineCategory']);
export const selectedEngineId = (state, widgetId) =>
  get(local(state), [widgetId, 'selectedEngineId']);
export const editModeEnabled = (state, widgetId) =>
  get(local(state), [widgetId, 'editModeEnabled']);
export const infoPanelIsOpen = (state, widgetId) =>
  get(local(state), [widgetId, 'infoPanelIsOpen']);
export const expandedModeEnabled = (state, widgetId) =>
  get(local(state), [widgetId, 'expandedMode']);
export const libraries = (state, widgetId) =>
  get(local(state), [widgetId, 'libraries']);
export const entities = (state, widgetId) =>
  get(local(state), [widgetId, 'entities']);

export const contentTemplates = (state, widgetId) =>
  get(local(state), [widgetId, 'contentTemplates']);
export const tdoContentTemplates = (state, widgetId) =>
  get(local(state), [widgetId, 'tdoContentTemplates']);

export const initializeWidget = widgetId => ({
  type: INITIALIZE_WIDGET,
  meta: { widgetId }
});

export const loadEngineCategoriesComplete = (
  widgetId,
  result,
  { warn, error }
) => ({
  type: LOAD_ENGINE_CATEGORIES_COMPLETE,
  payload: result,
  meta: { warn, error, widgetId }
});

export const loadEngineResultsRequest = (
  widgetId,
  engineId,
  startOffsetMs,
  stopOffsetMs
) => ({
  type: LOAD_ENGINE_RESULTS,
  payload: { engineId, startOffsetMs, stopOffsetMs },
  meta: { widgetId }
});

export const loadEngineResultsComplete = (
  result,
  { warn, error, startOffsetMs, stopOffsetMs, engineId, widgetId }
) => ({
  type: LOAD_ENGINE_RESULTS_COMPLETE,
  payload: result,
  meta: { warn, error, widgetId, startOffsetMs, stopOffsetMs, engineId }
});

export const addEnginesResultsRequest = widgetId => ({
  type: ADD_ENGINE_RESULTS_REQUEST,
  meta: { widgetId }
});

export const loadTdoRequest = (widgetId, tdoId, callback) => ({
  type: LOAD_TDO,
  payload: { tdoId, callback },
  meta: { widgetId }
});

export const loadTdoSuccess = (widgetId, result, { warn, error }) => ({
  type: LOAD_TDO_SUCCESS,
  payload: result,
  meta: { warn, error, widgetId }
});

export const updateTdoRequest = (
  widgetId,
  tdoId,
  tdoDataToUpdate,
  callback
) => ({
  type: UPDATE_TDO,
  payload: { tdoId, tdoDataToUpdate, callback },
  meta: { widgetId }
});

export const updateTdoComplete = (widgetId, result, { warn, error }) => ({
  type: UPDATE_TDO_COMPLETE,
  payload: result,
  meta: { warn, error, widgetId }
});

export const loadTdoContentTemplatesComplete = (
  widgetId,
  result,
  { warn, error }
) => ({
  type: LOAD_TDO_CONTENT_TEMPLATES_COMPLETE,
  payload: result,
  meta: { warn, error, widgetId }
});

export const updateTdoContentTemplates = (widgetId, contentTemplatesToDelete, contentTemplatesToCreate) => ({
  type: UPDATE_TDO_CONTENT_TEMPLATES,
  payload: { contentTemplatesToDelete, contentTemplatesToCreate },
  meta: { widgetId }
});

export const loadContentTemplates = widgetId => ({
  type: LOAD_CONTENT_TEMPLATES,
  meta: { widgetId }
});

export const loadContentTemplatesComplete = (
  widgetId,
  result,
  { warn, error }
) => ({
  type: LOAD_CONTENT_TEMPLATES_COMPLETE,
  payload: result,
  meta: { warn, error, widgetId }
});

export const selectEngineCategory = (widgetId, engineCategory) => ({
  type: SELECT_ENGINE_CATEGORY,
  payload: engineCategory,
  meta: { widgetId }
});

export const setEngineId = (widgetId, engineId) => ({
  type: SET_SELECTED_ENGINE_ID,
  payload: engineId,
  meta: { widgetId }
});

export const toggleEditMode = widgetId => ({
  type: TOGGLE_EDIT_MODE,
  meta: { widgetId }
});

export const toggleInfoPanel = widgetId => ({
  type: TOGGLE_INFO_PANEL,
  meta: { widgetId }
});

export const toggleExpandedMode = widgetId => ({
  type: TOGGLE_EXPANDED_MODE,
  meta: { widgetId }
});
