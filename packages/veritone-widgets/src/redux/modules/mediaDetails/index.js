import { get, has, find, values, uniqBy, keyBy, noop } from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const LOAD_ENGINE_CATEGORIES_SUCCESS = 'LOAD_ENGINE_CATEGORIES_SUCCESS';
export const LOAD_ENGINE_CATEGORIES_FAILURE = 'LOAD_ENGINE_CATEGORIES_FAILURE';
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
export const CREATE_BULK_EDIT_TRANSCRIPT_ASSET_FAILURE =
  'CREATE_BULK_EDIT_TRANSCRIPT_ASSET_FAILURE';
export const CREATE_BULK_EDIT_TRANSCRIPT_ASSET_SUCCESS =
  'CREATE_BULK_EDIT_TRANSCRIPT_ASSET_SUCCESS';
export const REFRESH_ENGINE_RUNS_SUCCESS = 'REFRESH_ENGINE_RUNS_SUCCESS';
export const SHOW_CONFIRM_DIALOG = 'SHOW_CONFIRM_DIALOG';
export const CLOSE_CONFIRM_DIALOG = 'CLOSE_CONFIRM_DIALOG';
export const DISCARD_UNSAVED_CHANGES = 'DISCARD_UNSAVED_CHANGES';
export const SET_EDIT_BUTTON_STATE = 'SET_EDIT_BUTTON_STATE';
export const SET_SHOW_TRANSCRIPT_BULK_EDIT_SNACK_STATE = 'SET_SHOW_TRANSCRIPT_BULK_EDIT_SNACK_STATE';
export const UPDATE_MEDIA_PLAYER_STATE = 'UPDATE_MEDIA_PLAYER_STATE';
export const RESTORE_ORIGINAL_ENGINE_RESULTS = 'RESTORE_ORIGINAL_ENGINE_RESULTS';
export const RESTORE_ORIGINAL_ENGINE_RESULTS_SUCCESS =
  'RESTORE_ORIGINAL_ENGINE_RESULTS_SUCCESS';
export const RESTORE_ORIGINAL_ENGINE_RESULTS_FAILURE =
  'RESTORE_ORIGINAL_ENGINE_RESULTS_FAILURE';

export const namespace = 'mediaDetails';

const defaultMDPState = {
  engineCategories: [],
  tdo: null,
  isLoadingTdo: false,
  selectedEngineCategory: null,
  selectedEngineId: null,
  isEditModeEnabled: false,
  isExpandedMode: false,
  entities: [],
  fetchingEntities: false,
  contentTemplates: {},
  tdoContentTemplates: {},
  schemasById: {},
  enableSave: false,
  error: null,
  alertDialogConfig: {
    show: false,
    title: '',
    description: '',
    cancelButtonLabel: '',
    confirmButtonLabel: '',
    confirmAction: noop,
    cancelAction: noop
  },
  isEditButtonDisabled: false,
  showTranscriptBulkEditSnack: false,
  currentMediaPlayerTime: 0,
  isRestoringOriginalEngineResult: false,
  isSavingEngineResults: false,
};

const defaultState = {};

export default createReducer(defaultState, {
  [INITIALIZE_WIDGET](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...defaultMDPState
      }
    };
  },
  [LOAD_ENGINE_CATEGORIES_SUCCESS](
    state,
    {
      payload,
      meta: { warn, widgetId }
    }
  ) {
    let selectedEngineCategory = state[widgetId].selectedEngineCategory;
    const selectedEngineCategoryNewValue = find(payload, {id: get(selectedEngineCategory, 'id')});
    if (selectedEngineCategory && selectedEngineCategoryNewValue) {
      selectedEngineCategory = selectedEngineCategoryNewValue;
    }
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: null,
        warning: warn || null,
        engineCategories: payload,
        selectedEngineCategory: selectedEngineCategory
      }
    };
  },
  [LOAD_ENGINE_CATEGORIES_FAILURE](
    state,
    {
      meta: { warn, error, widgetId }
    }
  ) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: errorMessage || 'unknown error',
        warning: warn || null,
        engineCategories: []
      }
    };
  },
  [LOAD_TDO](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        isLoadingTdo: true,
        error: null,
        tdo: null
      }
    };
  },
  [LOAD_TDO_SUCCESS](
    state,
    {
      payload,
      meta: { widgetId }
    }
  ) {
    const tdo = payload;
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        isLoadingTdo: false,
        error: null,
        tdo: tdo
      }
    };
  },
  [LOAD_TDO_FAILURE](
    state,
    {
      meta: { error, widgetId }
    }
  ) {
    const errorMessage = get(error, 'message', error);
    console.log('Failed to load tdo. Disable Spinner. Show error.');
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        isLoadingTdo: false,
        error: errorMessage || 'unknown error',
        tdo: null
      }
    };
  },
  [UPDATE_TDO](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: null
      }
    };
  },
  [UPDATE_TDO_SUCCESS](
    state,
    {
      payload,
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        tdo: payload
      }
    };
  },
  [UPDATE_TDO_FAILURE](
    state,
    {
      meta: { error, widgetId }
    }
  ) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: errorMessage || 'unknown error'
      }
    };
  },
  [LOAD_TDO_CONTENT_TEMPLATES_SUCCESS](
    state,
    {
      payload,
      meta: { widgetId }
    }
  ) {
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
        error: null,
        tdoContentTemplates: tdoContentTemplates
      }
    };
  },
  [LOAD_TDO_CONTENT_TEMPLATES_FAILURE](
    state,
    {
      meta: { error, widgetId }
    }
  ) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: errorMessage || 'unknown error',
        tdoContentTemplates: {}
      }
    };
  },
  [UPDATE_TDO](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: null
      }
    };
  },
  [UPDATE_TDO_CONTENT_TEMPLATES](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: null
      }
    };
  },
  [UPDATE_TDO_CONTENT_TEMPLATES_FAILURE](
    state,
    {
      error,
      meta: { widgetId }
    }
  ) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: error ? errorMessage : null
      }
    };
  },
  [LOAD_CONTENT_TEMPLATES](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: null
      }
    };
  },
  [LOAD_CONTENT_TEMPLATES_SUCCESS](
    state,
    {
      payload,
      meta: { widgetId }
    }
  ) {
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
        error: null,
        contentTemplates: templateSchemas
      }
    };
  },
  [LOAD_CONTENT_TEMPLATES_FAILURE](
    state,
    {
      meta: { error, widgetId }
    }
  ) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: errorMessage || 'unknown error',
        contentTemplates: {}
      }
    };
  },
  [SELECT_ENGINE_CATEGORY](
    state,
    {
      payload,
      meta: { widgetId }
    }
  ) {
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
  [SET_SELECTED_ENGINE_ID](
    state,
    {
      payload,
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        selectedEngineId: payload
      }
    };
  },
  [TOGGLE_EDIT_MODE](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        isEditModeEnabled: !state[widgetId].isEditModeEnabled,
        isExpandedMode: !state[widgetId].isEditModeEnabled
      }
    };
  },
  [TOGGLE_INFO_PANEL](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        isInfoPanelOpen: !state[widgetId].isInfoPanelOpen
      }
    };
  },
  [TOGGLE_EXPANDED_MODE](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        isExpandedMode: !state[widgetId].isExpandedMode
      }
    };
  },
  [REQUEST_ENTITIES](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        fetchingEntities: true
      }
    };
  },
  [REQUEST_ENTITIES_SUCCESS](
    state,
    {
      payload,
      meta: { widgetId }
    }
  ) {
    const allEntities = uniqBy(
      values(payload).concat(state[widgetId].entities),
      'id'
    );
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        fetchingEntities: false,
        error: null,
        entities: allEntities
      }
    };
  },
  [REQUEST_ENTITIES_FAILURE](
    state,
    {
      error,
      meta: { widgetId }
    }
  ) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: errorMessage || 'unknown error',
        fetchingEntities: false
      }
    };
  },
  [REQUEST_SCHEMAS](state) {
    return {
      ...state
    };
  },
  [REQUEST_SCHEMAS_SUCCESS](
    state,
    {
      payload,
      meta: { widgetId }
    }
  ) {
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
  },
  [CREATE_FILE_ASSET_SUCCESS](
    state,
    {
      payload,
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId]
      }
    };
  },
  [REFRESH_ENGINE_RUNS_SUCCESS](
    state,
    {
      payload,
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        tdo: {
          ...state[widgetId].tdo,
          engineRuns: {
            ...state[widgetId].tdo.engineRuns,
            records: payload.engineRuns
          }
        }
      }
    };
  },
  [SHOW_CONFIRM_DIALOG](
    state,
    {
      payload,
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        alertDialogConfig: {
          ...state[widgetId].alertDialogConfig,
          ...payload
        }
      }
    };
  },
  [CLOSE_CONFIRM_DIALOG](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        alertDialogConfig: {
          ...defaultMDPState.alertDialogConfig
        }
      }
    };
  },
  [SET_EDIT_BUTTON_STATE](
    state,
    {
      isEditButtonDisabled,
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        isEditButtonDisabled
      }
    };
  },
  [SET_SHOW_TRANSCRIPT_BULK_EDIT_SNACK_STATE](
    state,
    {
      showTranscriptBulkEditSnack,
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        showTranscriptBulkEditSnack
      }
    };
  },[SAVE_ASSET_DATA](
    state,
    {
      payload,
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        isSavingEngineResults: true,
      }
    };
  },
  [SAVE_ASSET_DATA_SUCCESS](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        isSavingEngineResults: false,
      }
    };
  },
  [SAVE_ASSET_DATA_FAILURE](
    state,
    {
      meta: { error, widgetId }
    }
  ) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: errorMessage || 'Unknown error saving engine results',
        isSavingEngineResults: false,
      }
    };
  },[CREATE_BULK_EDIT_TRANSCRIPT_ASSET_SUCCESS](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        isSavingEngineResults: false,
        enableSave: true,
        showTranscriptBulkEditSnack: true,
      }
    };
  },
  [CREATE_BULK_EDIT_TRANSCRIPT_ASSET_FAILURE](
    state,
    {
      meta: { error, widgetId }
    }
  ) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: errorMessage || 'Unknown error saving bulk transcript edit',
        isSavingEngineResults: false,
        enableSave: true,
      }
    };
  },
  [UPDATE_MEDIA_PLAYER_STATE](
    state,
    {
      currentTime,
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        currentMediaPlayerTime: currentTime
      }
    };
  },
  [RESTORE_ORIGINAL_ENGINE_RESULTS](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        isEditButtonDisabled: true,
        isRestoringOriginalEngineResult: true
      }
    };
  },
  [RESTORE_ORIGINAL_ENGINE_RESULTS_SUCCESS](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        isEditButtonDisabled: false,
        isRestoringOriginalEngineResult: false
      }
    };
  },
  [RESTORE_ORIGINAL_ENGINE_RESULTS_FAILURE](
    state,
    {
      meta: { error, widgetId }
    }
  ) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        error: errorMessage || 'Unknown error restoring engine results',
        isEditButtonDisabled: false,
        isRestoringOriginalEngineResult: false
      }
    };
  },
});

const local = state => state[namespace];

export const getEngineCategories = (state, widgetId) =>
  get(local(state), [widgetId, 'engineCategories']);
export const getTdo = (state, widgetId) => get(local(state), [widgetId, 'tdo']);
export const isLoadingTdo = (state, widgetId) =>
  get(local(state), [widgetId, 'isLoadingTdo']);
export const getTdoMetadata = (state, widgetId) =>
  get(local(state), [widgetId, 'tdo', 'details']);
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
export const getEntities = (state, widgetId) =>
  get(local(state), [widgetId, 'entities']);
export const getContentTemplates = (state, widgetId) =>
  get(local(state), [widgetId, 'contentTemplates']);
export const getTdoContentTemplates = (state, widgetId) =>
  get(local(state), [widgetId, 'tdoContentTemplates']);
export const getSchemasById = (state, widgetId) =>
  get(local(state), [widgetId, 'schemasById']);
export const isSaveEnabled = state => get(local(state), 'enableSave');
export const getWidgetError = (state, widgetId) =>
  get(local(state), [widgetId, 'error']);
export const getAlertDialogConfig = (state, widgetId) =>
  get(local(state), [widgetId, 'alertDialogConfig']);
export const isEditButtonDisabled = (state, widgetId) =>
  get(local(state), [widgetId, 'isEditButtonDisabled']);
export const showTranscriptBulkEditSnack = (state, widgetId) =>
  get(local(state), [widgetId, 'showTranscriptBulkEditSnack']);
export const currentMediaPlayerTime = (state, widgetId) =>
  get(local(state), [widgetId, 'currentMediaPlayerTime']);
export const isRestoringOriginalEngineResult = (state, widgetId) =>
  get(local(state), [widgetId, 'isRestoringOriginalEngineResult']);
export const isSavingEngineResults = (state, widgetId) =>
  get(local(state), [widgetId, 'isSavingEngineResults']);

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

export const loadTdoFailure = (widgetId, error) => ({
  type: LOAD_TDO_FAILURE,
  meta: { error, widgetId }
});

export const updateTdoRequest = (widgetId, tdoId, tdoDataToUpdate) => ({
  type: UPDATE_TDO,
  payload: { tdoId, tdoDataToUpdate },
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

export const toggleEditMode = (widgetId, selectedEngineCategory) => ({
  type: TOGGLE_EDIT_MODE,
  payload: {
    selectedEngineCategory
  },
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

export const toggleSaveMode = enableSave => ({
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

export const saveAssetDataSuccess = (widgetId) => ({
  type: SAVE_ASSET_DATA_SUCCESS,
  meta: { widgetId }
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

export const createBulkEditTranscriptAssetFailure = (widgetId, { error }) => ({
  type: CREATE_BULK_EDIT_TRANSCRIPT_ASSET_FAILURE,
  meta: { error, widgetId }
});

export const createBulkEditTranscriptAssetSuccess = (widgetId) => ({
  type: CREATE_BULK_EDIT_TRANSCRIPT_ASSET_SUCCESS,
  meta: { widgetId }
});

export const refreshEngineRunsSuccess = (engineRuns, widgetId) => ({
  type: REFRESH_ENGINE_RUNS_SUCCESS,
  payload: {
    engineRuns
  },
  meta: { widgetId }
});

export const openConfirmModal = (widgetId, modalConfig) => ({
  type: SHOW_CONFIRM_DIALOG,
  payload: {
    show: true,
    ...modalConfig
  },
  meta: { widgetId }
});

export const closeConfirmModal = widgetId => ({
  type: CLOSE_CONFIRM_DIALOG,
  meta: { widgetId }
});

export const discardUnsavedChanges = () => ({
  type: DISCARD_UNSAVED_CHANGES
});

export const setEditButtonState = (widgetId, isEditButtonDisabled) => ({
  type: SET_EDIT_BUTTON_STATE,
  isEditButtonDisabled,
  meta: { widgetId }
});

export const setShowTranscriptBulkEditSnackState = (widgetId, showTranscriptBulkEditSnack) => ({
  type: SET_SHOW_TRANSCRIPT_BULK_EDIT_SNACK_STATE,
  showTranscriptBulkEditSnack,
  meta: { widgetId }
});

export const updateMediaPlayerState = (widgetId, mediaPlayerState) => ({
  type: UPDATE_MEDIA_PLAYER_STATE,
  ...mediaPlayerState,
  meta: { widgetId }
});

export const restoreOriginalEngineResults = (widgetId, tdo, engineId, engineCategoryType, engineResults, removeAllUserEdits) => ({
  type: RESTORE_ORIGINAL_ENGINE_RESULTS,
  payload: {
    tdo,
    engineId,
    engineCategoryType,
    engineResults,
    removeAllUserEdits
  },
  meta: { widgetId }
});

export const restoreOriginalEngineResultsFailure = (widgetId, { error }) => ({
  type: RESTORE_ORIGINAL_ENGINE_RESULTS_FAILURE,
  meta: { error, widgetId }
});

export const restoreOriginalEngineResultsSuccess = (widgetId) => ({
  type: RESTORE_ORIGINAL_ENGINE_RESULTS_SUCCESS,
  meta: { widgetId }
});
