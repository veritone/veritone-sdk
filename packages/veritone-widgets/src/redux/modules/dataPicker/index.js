import { helpers } from 'veritone-redux-common';
import { get } from 'lodash';
const { createReducer } = helpers;

export const PICK_START = 'PICK_START';

export const namespace = 'dataPicker';

const defaultState = {
  open: false
};

export default createReducer(defaultState, {
  [PICK_START](
    state,
    {
      meta: { id }
    }
  ) {
    return {
      [id]: {
        ...state[id],
        open: true
      }
    }
  }
});

const local = state => state[namespace];

export const isOpen = (state, id) => get(local(state), [id, 'open']);
export const pick = id => ({
  type: PICK_START,
  meta: { id }
});