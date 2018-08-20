import * as Actions from './actionCreators';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

const Status = {
  LOADING: 'Loading',
  LOADED: 'Loaded',
  ERROR: 'Error'
};

const initialState = {};

export { namespace } from './actionCreators';
export default createReducer(initialState, {
  [Actions.RESET_MEDIA_PLAYER](state) {
    return initialState;
  },
  [Actions.LOAD_LIVESTREAM_DATA](state) {
    return { ...state, status: Status.LOADING };
  },
  [Actions.LOAD_LIVESTREAM_DATA_COMPLETE](state, action) {
    if (action.error) {
      return {
        ...state,
        status: Status.ERROR,
        error: action.error
      };
    } else if (action.payload) {
      return {
        ...state,
        status: Status.LOADED,
        data: action.payload
      };
    }
  }
});
