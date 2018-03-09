import { clamp, mean, isNaN, get } from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const LOAD_ENGINE_CATEGORIES = 'LOAD_ENGINE_CATEGORIES';
export const LOAD_ENGINE_CATEGORIES_COMPLETE = 'LOAD_ENGINE_CATEGORIES_COMPLETE';

export const namespace = 'mediaDetails';

const defaultState = {
  engineCategories: []
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
    console.log('Reducer load complete. updating state');
    console.log(payload);
    const errorMessage = get(error, 'message', error); // Error or string
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
  }
});


const local = state => state[namespace];

export const engineCategories = (state, widgetId) =>
  get(local(state), [widgetId, 'engineCategories']);

export const loadEngineCategoriesRequest = (widgetId, mediaId, callback) => ({
  type: LOAD_ENGINE_CATEGORIES,
  payload: { mediaId, callback },
  meta: { widgetId }
});

export const loadEngineCategoriesComplete = function(widgetId, result, { warn, error }) {
  console.log('inside loadEngineCategoriesComplete');
  return {
    type: LOAD_ENGINE_CATEGORIES_COMPLETE,
      payload: result,
    meta: { warn, error, widgetId }
  }
};
