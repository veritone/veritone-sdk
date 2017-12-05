import { clamp, mean, isNaN } from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const PICK_START = 'PICK_START';
export const PICK_END = 'PICK_END';
export const UPLOAD_REQUEST = 'UPLOAD_REQUEST';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';
export const UPLOAD_FAILURE = 'UPLOAD_FAILURE';

export const namespace = 'filePicker';

const defaultState = {
  open: false,
  state: 'selecting', // selecting | uploading | complete
  progressPercentByFileKey: {},
  success: false,
  failure: false
};

export default createReducer(defaultState, {
  [PICK_START]() {
    return {
      ...defaultState,
      open: true
    };
  },
  [PICK_END]() {
    return defaultState;
  },
  [UPLOAD_REQUEST](state) {
    return {
      ...state,
      state: 'uploading',
      progressPercentByFileKey: {},
      success: false,
      failure: false
    };
  },
  [UPLOAD_PROGRESS](state, action) {
    return {
      ...state,
      progressPercentByFileKey: {
        ...state.progressPercentByFileKey,
        [action.meta.fileKey]: action.payload
      }
    };
  },
  [UPLOAD_SUCCESS](state, action) {
    return {
      ...state,
      success: true,
      failure: false,
      state: 'complete'
    };
  },
  [UPLOAD_FAILURE](state, action) {
    // todo: warning state for partial uploads
    return {
      ...state,
      success: false,
      failure: true,
      state: 'complete'
    };
  }
});

const local = state => state[namespace];

export const pick = () => ({
  type: PICK_START
});

export const cancelPick = () => ({
  type: PICK_END
});

export const uploadRequest = files => ({
  type: UPLOAD_REQUEST,
  payload: files
});

export const uploadProgress = (fileKey, progressPercent) => ({
  type: UPLOAD_PROGRESS,
  payload: clamp(Math.round(progressPercent), 100),
  meta: { fileKey }
});

export const uploadSuccess = result => ({
  type: UPLOAD_SUCCESS,
  payload: result
});

export const uploadFailure = err => ({
  type: UPLOAD_FAILURE,
  payload: err,
  error: true
  // meta: { file }
});

export const isOpen = state => local(state).open;
export const state = state => local(state).state;
export const progressPercentByFileKey = (state, key) =>
  local(state).progressPercentByFileKey[key];
export const progressPercent = state => {
  const meanProgress = mean(
    Object.values(local(state).progressPercentByFileKey)
  );
  const rounded = Math.round(meanProgress);
  return isNaN(rounded) ? 0 : rounded;
};
export const didSucceed = state => local(state).success;
export const didFail = state => local(state).failure;
