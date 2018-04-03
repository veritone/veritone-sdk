import { get } from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const LOAD_ENGINE_CATEGORIES = 'LOAD_ENGINE_CATEGORIES';
export const LOAD_ENGINE_CATEGORIES_COMPLETE =
  'LOAD_ENGINE_CATEGORIES_COMPLETE';
export const LOAD_ENGINE_RESULTS = 'LOAD_ENGINE_RESULTS';
export const LOAD_ENGINE_RESULTS_COMPLETE = 'LOAD_ENGINE_RESULTS_COMPLETE';
export const LOAD_TDO = 'LOAD_TDO';
export const LOAD_TDO_SUCCESS = 'LOAD_TDO_SUCCESS';
export const UPDATE_TDO = 'UPDATE_TDO';
export const UPDATE_TDO_COMPLETE = 'UPDATE_TDO_COMPLETE';
export const SELECT_ENGINE_CATEGORY = 'SELECT_ENGINE_CATEGORY';
export const SET_SELECTED_ENGINE_ID = 'SET_SELECTED_ENGINE_ID';
export const TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE';
export const TOGGLE_INFO_PANEL = 'TOGGLE_INFO_PANEL';

export const namespace = 'mediaDetails';

const defaultState = {
  engineCategories: [],
  engineResultsByEngineId: {},
  tdo: null,
  selectedEngineCategory: null,
  selectedEngineId: null,
  editModeEnabled: false
};

export default createReducer(defaultState, {
  [LOAD_ENGINE_CATEGORIES](state, { meta: { widgetId } }) {
    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: null,
        error: null,
        warning: null,
        engineCategories: null
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
  [LOAD_ENGINE_RESULTS](state, { meta: { widgetId } }) {
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
  [LOAD_ENGINE_RESULTS_COMPLETE](
    state,
    { payload, meta: { warn, error, widgetId } }
  ) {
    const errorMessage = get(error, 'message', error);

    // TODO: merge new results with existing instead of replacing
    const engineResultsByEngineId =
      state[widgetId].engineResultsByEngineId || {};
    if (payload && get(payload, 'records.length')) {
      payload.records.forEach(result => {
        engineResultsByEngineId[result.engineId] = [result.jsondata];
      });
    }

    return {
      ...state,
      [widgetId]: {
        ...state[widgetId],
        success: !(warn || error) || null,
        error: error ? errorMessage : null,
        warning: warn || null,
        engineResultsByEngineId: {
          ...engineResultsByEngineId
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
        editModeEnabled: !state[widgetId].editModeEnabled
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
  }
});

const local = state => state[namespace];

export const engineCategories = (state, widgetId) =>
  get(local(state), [widgetId, 'engineCategories']);
export const engineResultsByEngineId = (state, widgetId) =>
  get(local(state), [widgetId, 'engineResultsByEngineId']);
export const tdo = (state, widgetId) => get(local(state), [widgetId, 'tdo']);
export const selectedEngineCategory = (state, widgetId) =>
  get(local(state), [widgetId, 'selectedEngineCategory']);
export const selectedEngineId = (state, widgetId) =>
  get(local(state), [widgetId, 'selectedEngineId']);
export const editModeEnabled = (state, widgetId) =>
  get(local(state), [widgetId, 'editModeEnabled']);
export const infoPanelIsOpen = (state, widgetId) =>
  get(local(state), [widgetId, 'infoPanelIsOpen']);

export const loadEngineCategoriesRequest = (widgetId, tdoId, callback) => ({
  type: LOAD_ENGINE_CATEGORIES,
  payload: { tdoId, callback },
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
  tdoId,
  engineId,
  startOffsetMs,
  stopOffsetMs,
  callback
) => ({
  type: LOAD_ENGINE_RESULTS,
  payload: { tdoId, engineId, startOffsetMs, stopOffsetMs, callback },
  meta: { widgetId }
});

export const loadEngineResultsComplete = (
  widgetId,
  result,
  { warn, error }
) => ({
  type: LOAD_ENGINE_RESULTS_COMPLETE,
  payload: result,
  meta: { warn, error, widgetId }
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
