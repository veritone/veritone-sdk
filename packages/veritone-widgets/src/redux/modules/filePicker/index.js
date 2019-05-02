import { clamp, mean, isNaN, get } from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const PICK_START = 'PICK_START';
export const PICK_END = 'PICK_END';
export const UPLOAD_REQUEST = 'UPLOAD_REQUEST';
export const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';
export const UPLOAD_COMPLETE = 'UPLOAD_COMPLETE';

export const namespace = 'filePicker';

const defaultPickerState = {
  open: false,
  state: 'selecting', // selecting | uploading | complete
  progressPercentByFileKey: {},
  success: false,
  error: false,
  warning: false,
  uploadResult: null
};

const defaultState = {
  // populated like:
  // [pickerId]: { ...defaultPickerState }
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
        ...defaultPickerState,
        open: true,
        state: 'selecting'
      }
    };
  },
  [PICK_END](
    state,
    {
      meta: { id }
    }
  ) {
    return {
      ...state,
      [id]: {
        ...state[id],
        open: false
      }
    };
  },
  [UPLOAD_REQUEST](
    state,
    {
      meta: { id }
    }
  ) {
    // todo: status message
    return {
      ...state,
      [id]: {
        ...state[id],
        state: 'uploading',
        progressPercentByFileKey: {},
        success: null,
        error: null,
        warning: null,
        uploadResult: null
      }
    };
  },
  [UPLOAD_PROGRESS](
    state,
    {
      payload,
      meta: { fileKey, id }
    }
  ) {
    // todo: status message
    return {
      ...state,
      [id]: {
        ...state[id],
        progressPercentByFileKey: {
          ...state[id].progressPercentByFileKey,
          [fileKey]: payload
        }
      }
    };
  },
  [UPLOAD_COMPLETE](
    state,
    {
      payload,
      meta: { warn, error, id }
    }
  ) {
    const errorMessage = get(error, 'message', error); // Error or string
    return {
      ...state,
      [id]: {
        ...state[id],
        success: !(warn || error) || null,
        error: error ? errorMessage : null,
        warning: warn || null,
        state: 'complete',
        uploadResult: payload
      }
    };
  }
});

const local = state => state[namespace];

export const pick = id => ({
  type: PICK_START,
  meta: { id }
});

export const endPick = id => ({
  type: PICK_END,
  meta: { id }
});

export const uploadRequest = (id, files, callback) => ({
  type: UPLOAD_REQUEST,
  payload: { files, callback },
  meta: { id }
});

export const uploadProgress = (id, fileKey, data) => ({
  type: UPLOAD_PROGRESS,
  payload: {
    name: data.name,
    type: data.type,
    size: data.size,
    percent: clamp(Math.round(data.percent), 100)
  },
  meta: { fileKey, id }
});

export const uploadComplete = (id, result, { warn, error }) => ({
  type: UPLOAD_COMPLETE,
  payload: result,
  meta: { warn, error, id }
});

export const isOpen = (state, id) => get(local(state), [id, 'open']);
export const state = (state, id) =>
  get(local(state), [id, 'state'], 'selecting');

// Keep this in case we want to go back to using mean percentage progresses
export const progressPercent = (state, id) => {
  const currentProgress = get(local(state), [id, 'progressPercentByFileKey']);
  if (!currentProgress) {
    return 0;
  }

  const meanProgress = mean(Object.values(currentProgress));
  const rounded = Math.round(meanProgress);
  return isNaN(rounded) ? 0 : rounded;
};
export const percentByFiles = (state, id) => {
  const currentFiles = get(local(state), [id, 'progressPercentByFileKey'], {});
  return Object.keys(currentFiles).map(key => {
    const value = currentFiles[key];
    return {
      key,
      value
    };
  })
}
export const didSucceed = (state, id) => !!get(local(state), [id, 'success']);
export const didError = (state, id) => !!get(local(state), [id, 'error']);
export const didWarn = (state, id) => !!get(local(state), [id, 'warning']);
// todo: status message for normal cases
export const statusMessage = (state, id) =>
  get(local(state), [id, 'warning']) || get(local(state), [id, 'error']) || '';
