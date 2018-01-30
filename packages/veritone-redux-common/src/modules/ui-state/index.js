// reducer supporting shared-components/withUIState decorator
import { createReducer } from 'helpers/redux';
// import { } from 'lodash';

export const namespace = 'ui-state';

export const SET_STATE = 'vtn/ui-state/SET_STATE';
export const CLEAR_STATE = 'vtn/ui-state/CLEAR_STATE';

const defaultState = {};

const reducer = createReducer(defaultState, {
  [SET_STATE](state, action) {
    return {
      ...state,
      [action.meta.key]: {
        ...state[action.meta.key],
        ...action.payload
      }
    };
  },

  [CLEAR_STATE](state, action) {
    let newState = {
      ...state
    };
    delete newState[action.meta.key];

    return newState;
  }
});

export default reducer;

function local(state) {
  return state[namespace];
}

export function setStateForKey(key, mergeState) {
  return {
    type: SET_STATE,
    meta: {
      key
    },
    payload: {
      ...mergeState
    }
  };
}

export function getStateForKey(state, key) {
  return local(state)[key];
}

export function clearStateForKey(key) {
  return {
    type: CLEAR_STATE,
    meta: {
      key
    }
  };
}
