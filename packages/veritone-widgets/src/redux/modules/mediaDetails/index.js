import { clamp, mean, isNaN, get } from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const LOAD_ENGINE_CATEGORIES = 'LOAD_ENGINE_CATEGORIES';
export const LOAD_ENGINE_CATEGORIES_COMPLETE = 'LOAD_ENGINE_CATEGORIES_COMPLETE';
export const LOAD_TDO = 'LOAD_TDO';
export const LOAD_TDO_COMPLETE = 'LOAD_TDO_COMPLETE';

export const namespace = 'mediaDetails';

const defaultState = {
  engineCategories: [],
  tdo: null
};

export default createReducer(defaultState, {
  [LOAD_ENGINE_CATEGORIES](state, {meta: {widgetId}}) {
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
  [LOAD_ENGINE_CATEGORIES_COMPLETE](state, { payload, meta: { warn, error, widgetId } }) {
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
  [LOAD_TDO_COMPLETE](state, { payload, meta: { warn, error, widgetId } }) {
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
  }
});


const local = state => state[namespace];

export const engineCategories = (state, widgetId) =>
  get(local(state), [widgetId, 'engineCategories']);
export const tdo = (state, widgetId) =>
  get(local(state), [widgetId, 'tdo']);

export const loadEngineCategoriesRequest = (widgetId, mediaId, callback) => ({
  type: LOAD_ENGINE_CATEGORIES,
  payload: { mediaId, callback },
  meta: { widgetId }
});

export const loadEngineCategoriesComplete = (widgetId, result, { warn, error }) => ({
  type: LOAD_ENGINE_CATEGORIES_COMPLETE,
  payload: result,
  meta: { warn, error, widgetId }
});

export const loadTdoRequest = (widgetId, mediaId, callback) => ({
  type: LOAD_TDO,
  payload: { mediaId, callback },
  meta: { widgetId }
});

export const loadTdoComplete = (widgetId, result, { warn, error }) => ({
  type: LOAD_TDO_COMPLETE,
  payload: result,
  meta: { warn, error, widgetId }
});
