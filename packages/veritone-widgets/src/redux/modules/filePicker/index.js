import { clamp, mean, isNaN, get } from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const PICK_START = 'PICK_START';
export const PICK_END = 'PICK_END';
export const UPLOAD_REQUEST = 'UPLOAD_REQUEST';
export const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';
export const UPLOAD_COMPLETE = 'UPLOAD_COMPLETE';

export const namespace = 'filePicker';

const defaultState = {
  open: false,
  state: 'selecting', // selecting | uploading | complete
  progressPercentByFileKey: {},
  success: false,
  error: false,
  warning: false,
  uploadResult: null
};

export default createReducer(defaultState, {
  [PICK_START]() {
    return {
      ...defaultState,
      open: true,
      state: 'selecting'
    };
  },
  [PICK_END](state) {
    return {
      ...state,
      open: false
    };
  },
  [UPLOAD_REQUEST](state) {
    // todo: status message
    return {
      ...state,
      state: 'uploading',
      progressPercentByFileKey: {},
      success: null,
      error: null,
      warning: null,
      uploadResult: null
    };
  },
  [UPLOAD_PROGRESS](state, action) {
    // todo: status message
    return {
      ...state,
      progressPercentByFileKey: {
        ...state.progressPercentByFileKey,
        [action.meta.fileKey]: action.payload
      }
    };
  },
  [UPLOAD_COMPLETE](state, { payload, meta: { warn, error } }) {
    const errorMessage = get(error, 'message', error); // Error or string
    return {
      ...state,
      success: !(warn || error) || null,
      error: error ? errorMessage : null,
      warning: warn || null,
      state: 'complete',
      uploadResult: payload
    };
  }
});

const local = state => state[namespace];

export const pick = () => ({
  type: PICK_START
});

export const endPick = () => ({
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

export const uploadComplete = (result, { warn, error }) => ({
  type: UPLOAD_COMPLETE,
  payload: result,
  meta: { warn, error }
});

export const isOpen = state => local(state).open;
export const state = state => local(state).state;
export const progressPercent = state => {
  const meanProgress = mean(
    Object.values(local(state).progressPercentByFileKey)
  );
  const rounded = Math.round(meanProgress);
  return isNaN(rounded) ? 0 : rounded;
};
export const didSucceed = state => !!local(state).success;
export const didError = state => !!local(state).error;
export const didWarn = state => !!local(state).warning;
// todo: status message for normal cases
export const statusMessage = state =>
  local(state).warning || local(state).error || '';
