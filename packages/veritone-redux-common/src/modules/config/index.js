import { createReducer } from 'helpers/redux';

export const namespace = 'config';
export const SET_CONFIG = 'vtn/config/SET_CONFIG';
const defaultState = {};

const reducer = createReducer(defaultState, {
  [SET_CONFIG](state, action) {
    return {
      ...state,
      ...action.payload
    };
  }
});

export default reducer;

function local(state) {
  return state[namespace];
}

export function setConfig(obj = {}) {
  return {
    type: SET_CONFIG,
    payload: obj
  };
}

export function getConfig(state) {
  return local(state);
}

/**
 * Selects application id. This should be passed down from the primary app
 * @param state
 * @returns {*}
 */
export const selectApplicationId = state => getConfig(state).applicationId;
