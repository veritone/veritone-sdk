import {
  get,
  has,
  findLastIndex,
  findIndex,
  groupBy,
  forEach,
  map,
  values,
  uniqBy,
  keyBy
} from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const LOAD_ENGINE_CATEGORIES_SUCCESS = 'LOAD_ENGINE_CATEGORIES_SUCCESS';
export const LOAD_ENGINE_CATEGORIES_FAILURE = 'LOAD_ENGINE_CATEGORIES_FAILURE';
export const LOAD_ENGINE_RESULTS = 'LOAD_ENGINE_RESULTS';
export const LOAD_ENGINE_RESULTS_SUCCESS = 'LOAD_ENGINE_RESULTS_SUCCESS';
export const LOAD_ENGINE_RESULTS_FAILURE = 'LOAD_ENGINE_RESULTS_FAILURE';
export const LOAD_TDO = 'LOAD_TDO';
export const LOAD_TDO_SUCCESS = 'LOAD_TDO_SUCCESS';
export const LOAD_TDO_FAILURE = 'LOAD_TDO_FAILURE';
export const UPDATE_TDO = 'UPDATE_TDO';
export const UPDATE_TDO_SUCCESS = 'UPDATE_TDO_SUCCESS';
export const UPDATE_TDO_FAILURE = 'UPDATE_TDO_FAILURE';
export const LOAD_CONTENT_TEMPLATES = 'LOAD_CONTENT_TEMPLATES';
export const LOAD_CONTENT_TEMPLATES_SUCCESS = 'LOAD_CONTENT_TEMPLATES_SUCCESS';
export const LOAD_CONTENT_TEMPLATES_FAILURE = 'LOAD_CONTENT_TEMPLATES_FAILURE';
export const LOAD_TDO_CONTENT_TEMPLATES_SUCCESS =
  'LOAD_TDO_CONTENT_TEMPLATES_SUCCESS';
export const LOAD_TDO_CONTENT_TEMPLATES_FAILURE =
  'LOAD_TDO_CONTENT_TEMPLATES_FAILURE';
export const UPDATE_TDO_CONTENT_TEMPLATES = 'UPDATE_TDO_CONTENT_TEMPLATES';
export const UPDATE_TDO_CONTENT_TEMPLATES_FAILURE =
  'UPDATE_TDO_CONTENT_TEMPLATES_FAILURE';
export const SELECT_ENGINE_CATEGORY = 'SELECT_ENGINE_CATEGORY';
export const SET_SELECTED_ENGINE_ID = 'SET_SELECTED_ENGINE_ID';
export const TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE';
export const TOGGLE_INFO_PANEL = 'TOGGLE_INFO_PANEL';
export const INITIALIZE_WIDGET = 'INITIALIZE_WIDGET';
export const TOGGLE_EXPANDED_MODE = 'TOGGLE_EXPANDED_MODE';
export const REQUEST_LIBRARIES = 'REQUEST_LIBRARIES';
export const REQUEST_LIBRARIES_SUCCESS = 'REQUEST_LIBRARIES_SUCCESS';
export const REQUEST_LIBRARIES_FAILURE = 'REQUEST_LIBRARIES_FAILURE';
export const REQUEST_ENTITIES = 'REQUEST_ENTITIES';
export const REQUEST_ENTITIES_SUCCESS = 'REQUEST_ENTITIES_SUCCESS';
export const REQUEST_ENTITIES_FAILURE = 'REQUEST_ENTITIES_FAILURE';
export const REQUEST_SCHEMAS = 'REQUEST_SCHEMAS';
export const REQUEST_SCHEMAS_SUCCESS = 'REQUEST_SCHEMAS_SUCCESS';
export const REQUEST_SCHEMAS_FAILURE = 'REQUEST_SCHEMAS_FAILURE';
export const TOGGLE_SAVE_MODE = 'TOGGLE_SAVE_MODE';
export const SAVE_ASSET_DATA = 'SAVE_ASSET_DATA';
export const SAVE_ASSET_DATA_SUCCESS = 'SAVE_ASSET_DATA_SUCCESS';
export const SAVE_ASSET_DATA_FAILURE = 'SAVE_ASSET_DATA_FAILURE';
export const CREATE_FILE_ASSET_SUCCESS = 'CREATE_FILE_ASSET_SUCCESS';
export const CREATE_FILE_ASSET_FAILURE = 'CREATE_FILE_ASSET_FAILURE';
export const CREATE_BULK_EDIT_TRANSCRIPT_ASSET_SUCCESS =
  'CREATE_BULK_EDIT_TRANSCRIPT_ASSET_SUCCESS';
export const CREATE_BULK_EDIT_TRANSCRIPT_ASSET_FAILURE =
  'CREATE_BULK_EDIT_TRANSCRIPT_ASSET_FAILURE';

export const namespace = 'mediaDetails';

const defaultMDPState = {
  engineCategories: [],
  engineResultsByEngineId: {},
  engineResultRequestsByEngineId: {}, // A list of engine result request so we don't request already fetched data.
  tdo: null,
  selectedEngineCategory: null,
  selectedEngineId: null,
  isEditModeEnabled: false,
  loadingEngineResults: false,
  isExpandedMode: false,
  libraries: [],
  fetchingLibraries: false,
  entities: [],
  fetchingEntities: false,
  contentTemplates: {},
  tdoContentTemplates: {},
  schemasById: {},
  enableSave: false
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
  [LOAD_ENGINE_CATEGORIES_SUCCESS](
    state,
    { payload, meta: { warn, widgetId } }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: true,
        error: null,
        warning: warn || null,
        engineCategories: payload
      }
    };
  },
  [LOAD_ENGINE_CATEGORIES_FAILURE](state, { meta: { warn, error, widgetId } }) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: false,
        error: error ? errorMessage : null,
        warning: warn || null,
        engineCategories: []
      }
    };
  },
  [LOAD_ENGINE_RESULTS](state, { payload, meta: { widgetId } }) {
    let resultRequests =
      state[widgetId].engineResultRequestsByEngineId[payload.engineId] || [];
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
  [LOAD_ENGINE_RESULTS_SUCCESS](
    state,
    { payload, meta: { widgetId, startOffsetMs, stopOffsetMs } }
  ) {
    const previousResultsByEngineId =
      state[widgetId].engineResultsByEngineId || {};
    const engineResultRequestsById =
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
        success: true,
        error: null,
        engineResultsByEngineId: {
          ...previousResultsByEngineId
        },
        engineResultRequestsByEngineId: {
          ...engineResultRequestsById
        }
      }
    };
  },
  [LOAD_ENGINE_RESULTS_FAILURE](
    state,
    { meta: { error, startOffsetMs, stopOffsetMs, engineId, widgetId } }
  ) {
    const errorMessage =
      `Error fetching engine ${engineId} results for offset ${startOffsetMs} - ${stopOffsetMs} :` +
      get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: false,
        error: errorMessage
      }
    };
  },
  [LOAD_TDO](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: true,
        error: null,
        tdo: null
      }
    };
  },
  [LOAD_TDO_SUCCESS](state, { payload, meta: { widgetId } }) {
    const tdo = payload;
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: true,
        error: null,
        tdo: tdo
      }
    };
  },
  [LOAD_TDO_FAILURE](state, { meta: { error, widgetId } }) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: false,
        error: error ? errorMessage : null,
        tdo: null
      }
    };
  },
  [UPDATE_TDO](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: true,
        error: null
      }
    };
  },
  [UPDATE_TDO_SUCCESS](state, { payload, meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: true,
        tdo: payload
      }
    };
  },
  [UPDATE_TDO_FAILURE](state, { meta: { error, widgetId } }) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: false,
        error: error ? errorMessage : null
      }
    };
  },
  [LOAD_TDO_CONTENT_TEMPLATES_SUCCESS](state, { payload, meta: { widgetId } }) {
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
        success: true,
        error: null,
        tdoContentTemplates: tdoContentTemplates
      }
    };
  },
  [LOAD_TDO_CONTENT_TEMPLATES_FAILURE](state, { meta: { error, widgetId } }) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: false,
        error: error ? errorMessage : null,
        tdoContentTemplates: {}
      }
    };
  },
  [UPDATE_TDO](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: null,
        error: null
      }
    };
  },
  [UPDATE_TDO_CONTENT_TEMPLATES](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: null,
        error: null
      }
    };
  },
  [UPDATE_TDO_CONTENT_TEMPLATES_FAILURE](state, { error, meta: { widgetId } }) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: error ? errorMessage : null,
      }
    };
  },
  [LOAD_CONTENT_TEMPLATES](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: null,
        error: null
      }
    };
  },
  [LOAD_CONTENT_TEMPLATES_SUCCESS](state, { payload, meta: { widgetId } }) {
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
        success: true,
        error: null,
        contentTemplates: templateSchemas
      }
    };
  },
  [LOAD_CONTENT_TEMPLATES_FAILURE](state, { meta: { error, widgetId } }) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: false,
        error: error ? errorMessage : null,
        contentTemplates: {}
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
        isEditModeEnabled: !state[widgetId].isEditModeEnabled,
        isExpandedMode: !state[widgetId].isEditModeEnabled
      }
    };
  },
  [TOGGLE_INFO_PANEL](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        isInfoPanelOpen: !state[widgetId].isInfoPanelOpen
      }
    };
  },
  [TOGGLE_EXPANDED_MODE](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        isExpandedMode: !state[widgetId].isExpandedMode
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
    const allLibraries = uniqBy(
      values(payload).concat(state[widgetId].libraries),
      'id'
    );
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        fetchingLibraries: false,
        fetchLibrariesError: null,
        libraries: allLibraries
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
    const allEntities = uniqBy(
      values(payload).concat(state[widgetId].entities),
      'id'
    );
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        fetchingLibraries: false,
        fetchLibrariesError: null,
        entities: allEntities
      }
    };
  },
  [REQUEST_SCHEMAS](state) {
    return {
      ...state
    };
  },
  [REQUEST_SCHEMAS_SUCCESS](state, { payload, meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        schemasById: {
          ...state.schemasById,
          ...keyBy(Object.values(payload), 'id')
        }
      }
    };
  },
  [TOGGLE_SAVE_MODE](state, action) {
    return {
      ...state,
      enableSave: action.payload.enableSave
    };
  }
});

const local = state => state[namespace];

export const getEngineCategories = (state, widgetId) =>
  get(local(state), [widgetId, 'engineCategories']);
export const getEngineResultsByEngineId = (state, widgetId) =>
  get(local(state), [widgetId, 'engineResultsByEngineId']);
export const getEngineResultRequestsByEngineId = (state, widgetId, engineId) =>
  get(local(state), [widgetId, 'engineResultRequestsByEngineId', engineId]) ||
  [];
export const getTdo = (state, widgetId) => get(local(state), [widgetId, 'tdo']);
export const getSelectedEngineCategory = (state, widgetId) =>
  get(local(state), [widgetId, 'selectedEngineCategory']);
export const getSelectedEngineId = (state, widgetId) =>
  get(local(state), [widgetId, 'selectedEngineId']);
export const isEditModeEnabled = (state, widgetId) =>
  get(local(state), [widgetId, 'isEditModeEnabled']);
export const isInfoPanelOpen = (state, widgetId) =>
  get(local(state), [widgetId, 'isInfoPanelOpen']);
export const isExpandedModeEnabled = (state, widgetId) =>
  get(local(state), [widgetId, 'isExpandedMode']);
export const getLibraries = (state, widgetId) =>
  get(local(state), [widgetId, 'libraries']);
export const getEntities = (state, widgetId) =>
  get(local(state), [widgetId, 'entities']);
export const getContentTemplates = (state, widgetId) =>
  get(local(state), [widgetId, 'contentTemplates']);
export const getTdoContentTemplates = (state, widgetId) =>
  get(local(state), [widgetId, 'tdoContentTemplates']);
export const getSchemasById = (state, widgetId) =>
  get(local(state), [widgetId, 'schemasById']);
export const isSaveEnabled = (state) =>
  get(local(state), 'enableSave');

export const initializeWidget = widgetId => ({
  type: INITIALIZE_WIDGET,
  meta: { widgetId }
});

export const loadEngineCategoriesSuccess = (widgetId, result) => ({
  type: LOAD_ENGINE_CATEGORIES_SUCCESS,
  payload: result,
  meta: { widgetId }
});

export const loadEngineCategoriesFailure = (widgetId, { error }) => ({
  type: LOAD_ENGINE_CATEGORIES_FAILURE,
  meta: { error, widgetId }
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

export const loadEngineResultsSuccess = (
  result,
  { startOffsetMs, stopOffsetMs, engineId, widgetId }
) => ({
  type: LOAD_ENGINE_RESULTS_SUCCESS,
  payload: result,
  meta: { widgetId, startOffsetMs, stopOffsetMs, engineId }
});

export const loadEngineResultsFailure = ({
  error,
  startOffsetMs,
  stopOffsetMs,
  engineId,
  widgetId
}) => ({
  type: LOAD_ENGINE_RESULTS_FAILURE,
  meta: { error, startOffsetMs, stopOffsetMs, engineId, widgetId }
});

export const loadTdoRequest = (widgetId, tdoId, callback) => ({
  type: LOAD_TDO,
  payload: { tdoId, callback },
  meta: { widgetId }
});

export const loadTdoSuccess = (widgetId, result) => ({
  type: LOAD_TDO_SUCCESS,
  payload: result,
  meta: { widgetId }
});

export const loadTdoFailure = (widgetId, { error }) => ({
  type: LOAD_TDO_FAILURE,
  meta: { error, widgetId }
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

export const updateTdoSuccess = (widgetId, result) => ({
  type: UPDATE_TDO_SUCCESS,
  payload: result,
  meta: { widgetId }
});

export const updateTdoFailure = (widgetId, { error }) => ({
  type: UPDATE_TDO_FAILURE,
  meta: { error, widgetId }
});

export const loadTdoContentTemplatesSuccess = (widgetId, result) => ({
  type: LOAD_TDO_CONTENT_TEMPLATES_SUCCESS,
  payload: result,
  meta: { widgetId }
});

export const loadTdoContentTemplatesFailure = (widgetId, { error }) => ({
  type: LOAD_TDO_CONTENT_TEMPLATES_FAILURE,
  meta: { error, widgetId }
});

export const updateTdoContentTemplates = (
  widgetId,
  contentTemplatesToDelete,
  contentTemplatesToCreate
) => ({
  type: UPDATE_TDO_CONTENT_TEMPLATES,
  payload: { contentTemplatesToDelete, contentTemplatesToCreate },
  meta: { widgetId }
});

export const loadContentTemplates = widgetId => ({
  type: LOAD_CONTENT_TEMPLATES,
  meta: { widgetId }
});

export const loadContentTemplatesSuccess = (widgetId, result) => ({
  type: LOAD_CONTENT_TEMPLATES_SUCCESS,
  payload: result,
  meta: { widgetId }
});

export const loadContentTemplatesFailure = (widgetId, { error }) => ({
  type: LOAD_CONTENT_TEMPLATES_FAILURE,
  meta: { error, widgetId }
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

export const toggleSaveMode = (enableSave) => ({
  type: TOGGLE_SAVE_MODE,
  payload: {
    enableSave
  }
});

export const saveAssetData = (widgetId, payload) => {
  return {
    type: SAVE_ASSET_DATA,
    payload: payload,
    meta: { widgetId }
  };
};

export const saveAssetDataFailure = (widgetId, { error }) => ({
  type: SAVE_ASSET_DATA_FAILURE,
  meta: { error, widgetId }
});

export const createFileAssetSuccess = (widgetId, assetId) => ({
  type: CREATE_FILE_ASSET_SUCCESS,
  payload: {
    assetId
  },
  meta: { widgetId }
});

export const createFileAssetFailure = (widgetId, { error }) => ({
  type: CREATE_FILE_ASSET_FAILURE,
  meta: { error, widgetId }
});

export const createBulkEditTranscriptAssetSuccess = (widgetId) => ({
  type: CREATE_BULK_EDIT_TRANSCRIPT_ASSET_SUCCESS,
  meta: { widgetId }
});

export const createBulkEditTranscriptAssetFailure = (widgetId, { error }) => ({
  type: CREATE_BULK_EDIT_TRANSCRIPT_ASSET_FAILURE,
  meta: { error, widgetId }
});
