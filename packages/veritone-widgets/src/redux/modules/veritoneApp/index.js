import { without } from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const namespace = 'veritoneApp';

export const WIDGET_ADDED = 'vtn/veritoneApp/WIDGET_ADDED';
export const WIDGET_REMOVED = 'vtn/veritoneApp/WIDGET_REMOVED';

const defaultState = {
  widgets: []
};

const reducer = createReducer(defaultState, {
  [WIDGET_ADDED](
    state,
    {
      payload: { widget }
    }
  ) {
    return {
      ...state,
      widgets: [...state.widgets, widget]
    };
  },

  [WIDGET_REMOVED](
    state,
    {
      payload: { widget }
    }
  ) {
    return {
      ...state,
      widgets: without(state.widgets, widget)
    };
  }
});

export default reducer;

function local(state) {
  return state[namespace];
}

export function widgetAdded(widget, saga) {
  return {
    type: WIDGET_ADDED,
    payload: { widget, saga }
  };
}

export function widgetRemoved(widget, saga) {
  return {
    type: WIDGET_REMOVED,
    payload: { widget, saga }
  };
}

export const widgets = state => local(state).widgets;
