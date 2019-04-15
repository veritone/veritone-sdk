import { get, has, find, values, uniqBy, keyBy, noop } from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer, callGraphQLApi } = helpers;
import { getEditModeEnabled as isFaceEditEnabled } from './faceEngineOutput';
import { getEditModeEnabled as isTranscriptEditEnabled } from './transcriptWidget';

export const namespace = 'mediaDetails';

export const LOAD_ENGINE_CATEGORIES_SUCCESS = `vtn/${namespace}_LOAD_ENGINE_CATEGORIES_SUCCESS`;
export const LOAD_ENGINE_CATEGORIES_FAILURE = `vtn/${namespace}_LOAD_ENGINE_CATEGORIES_FAILURE`;
export const LOAD_TDO = `vtn/${namespace}_LOAD_TDO`;
export const LOAD_TDO_SUCCESS = `vtn/${namespace}_LOAD_TDO_SUCCESS`;
export const LOAD_TDO_FAILURE = `vtn/${namespace}_LOAD_TDO_FAILURE`;
export const UPDATE_TDO = `vtn/${namespace}_UPDATE_TDO`;
export const UPDATE_TDO_SUCCESS = `vtn/${namespace}_UPDATE_TDO_SUCCESS`;
export const UPDATE_TDO_FAILURE = `vtn/${namespace}_UPDATE_TDO_FAILURE`;
export const LOAD_CONTENT_TEMPLATES = `vtn/${namespace}_LOAD_CONTENT_TEMPLATES`;
export const LOAD_CONTENT_TEMPLATES_SUCCESS = `vtn/${namespace}_LOAD_CONTENT_TEMPLATES_SUCCESS`;
export const LOAD_CONTENT_TEMPLATES_FAILURE = `vtn/${namespace}_LOAD_CONTENT_TEMPLATES_FAILURE`;
export const LOAD_TDO_CONTENT_TEMPLATES_SUCCESS = `vtn/${namespace}_LOAD_TDO_CONTENT_TEMPLATES_SUCCESS`;
export const LOAD_TDO_CONTENT_TEMPLATES_FAILURE = `vtn/${namespace}_LOAD_TDO_CONTENT_TEMPLATES_FAILURE`;
export const UPDATE_TDO_CONTENT_TEMPLATES = `vtn/${namespace}_UPDATE_TDO_CONTENT_TEMPLATES`;
export const UPDATE_TDO_CONTENT_TEMPLATES_FAILURE = `vtn/${namespace}_UPDATE_TDO_CONTENT_TEMPLATES_FAILURE`;
export const SELECT_ENGINE_CATEGORY = `vtn/${namespace}_SELECT_ENGINE_CATEGORY`;
export const SET_SELECTED_ENGINE_ID = `vtn/${namespace}_SET_SELECTED_ENGINE_ID`;
export const SET_SELECTED_COMBINE_ENGINE_ID = `vtn/${namespace}_SET_SELECTED_COMBINE_ENGINE_ID`;
export const SET_SELECTED_COMBINE_VIEW_TYPE = `vtn/${namespace}_SET_SELECTED_COMBINE_VIEW_TYPE`;
export const TOGGLE_EDIT_MODE = `vtn/${namespace}_TOGGLE_EDIT_MODE`;
export const TOGGLE_INFO_PANEL = `vtn/${namespace}_TOGGLE_INFO_PANEL`;
export const INITIALIZE_WIDGET = `vtn/${namespace}_INITIALIZE_WIDGET`;
export const TOGGLE_EXPANDED_MODE = `vtn/${namespace}_TOGGLE_EXPANDED_MODE`;
export const REQUEST_ENTITIES = `vtn/${namespace}_REQUEST_ENTITIES`;
export const REQUEST_ENTITIES_SUCCESS = `vtn/${namespace}_REQUEST_ENTITIES_SUCCESS`;
export const REQUEST_ENTITIES_FAILURE = `vtn/${namespace}_REQUEST_ENTITIES_FAILURE`;
export const REQUEST_SCHEMAS = `vtn/${namespace}_REQUEST_SCHEMAS`;
export const REQUEST_SCHEMAS_SUCCESS = `${namespace}_REQUEST_SCHEMAS_SUCCESS`;
export const REQUEST_SCHEMAS_FAILURE = `${namespace}_REQUEST_SCHEMAS_FAILURE`;
export const TOGGLE_SAVE_MODE = `${namespace}_TOGGLE_SAVE_MODE`;
export const CREATE_FILE_ASSET_SUCCESS = `${namespace}_CREATE_FILE_ASSET_SUCCESS`;
export const CREATE_FILE_ASSET_FAILURE = `${namespace}_CREATE_FILE_ASSET_FAILURE`;
export const CREATE_BULK_EDIT_TRANSCRIPT_ASSET_FAILURE = `${namespace}_CREATE_BULK_EDIT_TRANSCRIPT_ASSET_FAILURE`;
export const CREATE_BULK_EDIT_TRANSCRIPT_ASSET_SUCCESS = `${namespace}_CREATE_BULK_EDIT_TRANSCRIPT_ASSET_SUCCESS`;
export const REFRESH_ENGINE_RUNS_SUCCESS = `${namespace}_REFRESH_ENGINE_RUNS_SUCCESS`;
export const SHOW_CONFIRM_DIALOG = `${namespace}_SHOW_CONFIRM_DIALOG`;
export const CLOSE_CONFIRM_DIALOG = `${namespace}_CLOSE_CONFIRM_DIALOG`;
export const DISCARD_UNSAVED_CHANGES = `${namespace}_DISCARD_UNSAVED_CHANGES`;
export const SET_EDIT_BUTTON_STATE = `${namespace}_SET_EDIT_BUTTON_STATE`;
export const UPDATE_MEDIA_PLAYER_STATE = `${namespace}_UPDATE_MEDIA_PLAYER_STATE`;
export const RESTORE_ORIGINAL_ENGINE_RESULTS = `${namespace}_RESTORE_ORIGINAL_ENGINE_RESULTS`;
export const RESTORE_ORIGINAL_ENGINE_RESULTS_SUCCESS = `${namespace}_RESTORE_ORIGINAL_ENGINE_RESULTS_SUCCESS`;
export const RESTORE_ORIGINAL_ENGINE_RESULTS_FAILURE = `${namespace}_RESTORE_ORIGINAL_ENGINE_RESULTS_FAILURE`;
export const CREATE_QUICK_EXPORT = `${namespace}_CREATE_QUICK_EXPORT`;
export const CREATE_QUICK_EXPORT_SUCCESS = `${namespace}_CREATE_QUICK_EXPORT_SUCCESS`;
export const CREATE_QUICK_EXPORT_FAILURE = `${namespace}_CREATE_QUICK_EXPORT_FAILURE`;
export const CANCEL_EDIT = `${namespace}_CANCEL_EDIT`;
export const INSERT_INTO_INDEX_FAILURE = `${namespace}_INSERT_INTO_INDEX_FAILURE`;
export const EMIT_ENTITY_UPDATED_EVENT_FAILURE = `${namespace}_EMIT_ENTITY_UPDATED_EVENT_FAILURE`;

const defaultMDPState = {
  engineCategories: [],
  tdo: null,
  isLoadingTdo: false,
  selectedEngineCategory: null,
  selectedEngineId: null,
  isEditModeEnabled: false,
  isExpandedMode: false,
  entities: [],
  isFetchingEntities: false,
  contentTemplates: {},
  tdoContentTemplates: [],
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
  currentMediaPlayerTime: 0,
  isRestoringOriginalEngineResult: false,
  categoryCombinationMapper: [
    {
      combineType: 'speaker',
      withType: 'transcript',
      viewTypes: [
        {
          name: 'Show Engine Output',
          id: 'show-speaker-view',
          combine: true
        },
        {
          name: 'Hide Engine Output',
          id: 'transcript-view'
        }
      ],
      quickExportOptions: {
        withSpeakerData: true
      }
    }
  ]
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
    const selectedEngineCategoryNewValue = find(payload, {
      id: get(selectedEngineCategory, 'id')
    });
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
    const tdoContentTemplates = [];
    if (payload && payload.records) {
      payload.records.forEach(asset => {
        if (!asset.sourceData || !asset.sourceData.schema) {
          return;
        }
        const contentTemplate = Object.assign({}, asset.sourceData.schema);
        if (asset.transform) {
          try {
            contentTemplate.data = JSON.parse(asset.transform);
          } catch (err) {
            return;
          }
        }
        if (contentTemplate.dataRegistry && contentTemplate.dataRegistry.name) {
          contentTemplate.name = contentTemplate.dataRegistry.name;
          delete contentTemplate.dataRegistry;
        }
        // keep asset id on the content template for asset CRUD
        contentTemplate.assetId = asset.id;
        tdoContentTemplates.push(contentTemplate);
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
        tdoContentTemplates: []
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
  [SET_SELECTED_COMBINE_ENGINE_ID](
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
        selectedCombineEngineId: payload
      }
    };
  },
  [SET_SELECTED_COMBINE_VIEW_TYPE](
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
        selectedCombineViewTypeId: payload
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
  [REQUEST_ENTITIES](state) {
    return {
      ...state,
      isFetchingEntities: true
    };
  },
  [REQUEST_ENTITIES_SUCCESS](state, { payload }) {
    const allEntities = uniqBy(
      values(payload).concat(get(state, 'entities', [])),
      'id'
    );
    return {
      ...state,
      isFetchingEntities: false,
      error: null,
      entities: allEntities
    };
  },
  [REQUEST_ENTITIES_FAILURE](state, { error }) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      error: errorMessage || 'unknown error',
      isFetchingEntities: false
    };
  },
  [REQUEST_SCHEMAS](state) {
    return {
      ...state
    };
  },
  [REQUEST_SCHEMAS_SUCCESS](state, { payload }) {
    return {
      ...state,
      schemasById: {
        ...state.schemasById,
        ...keyBy(Object.values(payload), 'id')
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
  [CREATE_BULK_EDIT_TRANSCRIPT_ASSET_SUCCESS](
    state,
    {
      meta: { widgetId }
    }
  ) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        enableSave: true,
        showTranscriptBulkEditSnack: true
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
        enableSave: true
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
  [CANCEL_EDIT](state) {
    return {
      ...state
    };
  },
  [INSERT_INTO_INDEX_FAILURE](
    state,
    {
      meta: { error }
    }
  ) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      error: errorMessage || 'unknown error'
    };
  },
  [EMIT_ENTITY_UPDATED_EVENT_FAILURE](
    state,
    {
      meta: { error }
    }
  ) {
    const errorMessage = get(error, 'message', error);
    return {
      ...state,
      error: errorMessage || 'unknown error'
    };
  }
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
export const getSelectedCombineEngineId = (state, widgetId) =>
  get(local(state), [widgetId, 'selectedCombineEngineId']);
export const getSelectedCombineViewTypeId = (state, widgetId) =>
  get(local(state), [widgetId, 'selectedCombineViewTypeId']);
export const isEditModeEnabled = (state, widgetId) =>
  isTranscriptEditEnabled(state) || isFaceEditEnabled(state);
export const isInfoPanelOpen = (state, widgetId) =>
  get(local(state), [widgetId, 'isInfoPanelOpen']);
export const isExpandedModeEnabled = (state, widgetId) =>
  get(local(state), [widgetId, 'isExpandedMode']);
export const getEntities = state => get(local(state), 'entities');
export const isFetchingEntities = state =>
  get(local(state), 'isFetchingEntities');
export const getContentTemplates = (state, widgetId) =>
  get(local(state), [widgetId, 'contentTemplates']);
export const getTdoContentTemplates = (state, widgetId) =>
  get(local(state), [widgetId, 'tdoContentTemplates']);
export const getSchemasById = state => get(local(state), 'schemasById');
export const isSaveEnabled = state => get(local(state), 'enableSave');
export const getWidgetError = (state, widgetId) =>
  get(local(state), [widgetId, 'error']) || get(local(state), 'error');
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
export const categoryExportFormats = (state, widgetId) =>
  get(getSelectedEngineCategory(state, widgetId), 'exportFormats', []);
export const categoryCombinationMapper = (state, widgetId) =>
  get(local(state), [widgetId, 'categoryCombinationMapper']);
export const getCombineViewTypes = (state, widgetId) => {
  const localWidgetState = get(local(state), widgetId, {});
  const {
    selectedEngineCategory,
    selectedCombineEngineId,
    categoryCombinationMapper
  } = localWidgetState;

  const withType = get(selectedEngineCategory, 'categoryType');
  const combineMapper = find(categoryCombinationMapper, ['withType', withType]);
  const viewTypes = get(combineMapper, 'viewTypes', []);
  if (selectedCombineEngineId) {
    return viewTypes;
  } else {
    return viewTypes.filter(view => !view.combine);
  }
};

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

export const setCombineEngineId = (widgetId, engineId) => ({
  type: SET_SELECTED_COMBINE_ENGINE_ID,
  payload: engineId,
  meta: { widgetId }
});

export const setSelectedCombineViewTypeId = (widgetId, viewTypeId) => {
  return {
    type: SET_SELECTED_COMBINE_VIEW_TYPE,
    payload: viewTypeId,
    meta: { widgetId }
  };
};

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

export const createFileAssetSuccess = widgetId => ({
  type: CREATE_FILE_ASSET_SUCCESS,
  meta: { widgetId }
});

export const createFileAssetFailure = (widgetId, { error }) => ({
  type: CREATE_FILE_ASSET_FAILURE,
  meta: { error, widgetId }
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

export const updateMediaPlayerState = (widgetId, mediaPlayerState) => ({
  type: UPDATE_MEDIA_PLAYER_STATE,
  ...mediaPlayerState,
  meta: { widgetId }
});

export const restoreOriginalEngineResults = (
  widgetId,
  tdo,
  engineId,
  engineCategoryType,
  engineResults,
  removeAllUserEdits
) => ({
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

export const restoreOriginalEngineResultsSuccess = widgetId => ({
  type: RESTORE_ORIGINAL_ENGINE_RESULTS_SUCCESS,
  meta: { widgetId }
});

export const cancelEdit = (widgetId, selectedEngineId) => ({
  type: CANCEL_EDIT,
  meta: { widgetId, selectedEngineId }
});

export const insertIntoIndexFailure = error => ({
  type: INSERT_INTO_INDEX_FAILURE,
  meta: { error }
});

export const emitEntityUpdatedEventFailure = error => ({
  type: EMIT_ENTITY_UPDATED_EVENT_FAILURE,
  meta: { error }
});

export const createQuickExport = (
  tdoId,
  formatTypes,
  engineId,
  categoryId,
  selectedCombineEngineId,
  selectedCombineCategoryId,
  formatOptions = {}
) => async (dispatch, getState) => {
  const query = `
    mutation createExportRequest(
      $includeMedia: Boolean,
      $tdoData: [CreateExportRequestForTDO!]!,
      $outputConfigurations: [CreateExportRequestOutputConfig!]
    ) {
      createExportRequest(input: {
        includeMedia: $includeMedia
        tdoData: $tdoData
        outputConfigurations: $outputConfigurations
      }) {
        id
        status
        organizationId
        createdDateTime
        modifiedDateTime
        requestorId
        assetUri
      }
    }
  `;

  const outputConfigurations = [
    {
      engineId,
      categoryId,
      formats: formatTypes.map(type => {
        return {
          extension: type,
          options: formatOptions
        };
      })
    }
  ];

  if (selectedCombineEngineId) {
    outputConfigurations.push({
      categoryId: selectedCombineCategoryId,
      engineId: selectedCombineEngineId,
      formats: []
    });
  }

  return await callGraphQLApi({
    actionTypes: [
      CREATE_QUICK_EXPORT,
      CREATE_QUICK_EXPORT_SUCCESS,
      CREATE_QUICK_EXPORT_FAILURE
    ],
    query,
    variables: {
      includeMedia: false,
      outputConfigurations,
      tdoData: { tdoId }
    },
    dispatch,
    getState
  });
};
