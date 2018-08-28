import { createReducer } from 'helpers/redux';
import { omit, isFunction } from 'lodash';

import { guid } from 'helpers/misc';

export const namespace = 'confirmation';

export const CONFIRM = 'vtn/confirmation/CONFIRM';
export const SHOW_CONFIRMATION = 'vtn/confirmation/SHOW_CONFIRMATION';
export const APPROVE_CONFIRM_ACTION = 'vtn/confirmation/APPROVE_CONFIRM_ACTION';
export const CANCEL_CONFIRM_ACTION = 'vtn/confirmation/CANCEL_CONFIRM_ACTION';

const reducer = createReducer(
  { confirmations: {} },
  {
    [SHOW_CONFIRMATION](state, action) {
      return {
        ...state,
        confirmations: {
          ...state.confirmations,
          [action.meta.id]: action.payload
        }
      };
    },
    // close matching dialog on approve/cancel
    [APPROVE_CONFIRM_ACTION](state, action) {
      return {
        ...state,
        confirmations: omit(state.confirmations, action.meta.id)
      };
    },
    [CANCEL_CONFIRM_ACTION](state, action) {
      return {
        ...state,
        confirmations: omit(state.confirmations, action.meta.id)
      };
    }
  }
);

export default reducer;

function local(state) {
  return state[namespace];
}

export const withConfirmation = (actionCreator, configOrConfigFn) => (
  ...args
) => {
  const {
    message = 'fixme',
    confirmButtonLabel = 'Confirm',
    cancelButtonLabel = 'Cancel'
  } = isFunction(configOrConfigFn)
    ? configOrConfigFn(...args)
    : configOrConfigFn || {};

  const wrappedAction = actionCreator(...args);

  return {
    type: CONFIRM,
    meta: {
      id: guid()
    },
    payload: {
      wrappedAction,
      message,
      confirmButtonLabel,
      cancelButtonLabel
    }
  };
};

export const getConfirmations = state => local(state).confirmations;

export const approveConfirmAction = id => ({
  type: APPROVE_CONFIRM_ACTION,
  meta: { id }
});

export const cancelConfirmAction = id => ({
  type: CANCEL_CONFIRM_ACTION,
  meta: { id }
});

// called by saga only
export const _showConfirmationDialog = ({ id, ...kwargs }) => ({
  type: SHOW_CONFIRMATION,
  payload: kwargs,
  meta: { id }
});
