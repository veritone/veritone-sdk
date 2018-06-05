import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const namespace = 'snackbar';

const SHOW_SNACKBAR = 'vtn/snackbar/SHOW_SNACKBAR';
const HIDE_SNACKBAR = 'vtn/snackbar/HIDE_SNACKBAR';

const SHOW_DIALOG = 'vtn/snackbar/SHOW_DIALOG';
const HIDE_DIALOG = 'vtn/snackbar/HIDE_DIALOG';

const defaultState = {
  snackbar: {
    open: false,
    message: ''
  },
  dialog: {
    open: false,
    message: '',
    title: ''
  }
};

const reducer = createReducer(defaultState, {
  [SHOW_SNACKBAR](state, action) {
    if (!action.payload.message) {
      return {
        ...state
      };
    }

    return {
      ...state,
      snackbar: {
        open: true,
        message: action.payload.message
      }
    };
  },
  // todo: implement snackbar queue as described in
  // https://material-ui.com/demos/snackbars/#consecutive-snackbars
  [HIDE_SNACKBAR](state) {
    return {
      ...state,
      snackbar: defaultState.snackbar
    };
  },
  [SHOW_DIALOG](state, action) {
    return {
      ...state,
      dialog: {
        open: true,
        title: action.payload.title,
        message: action.payload.message
      }
    };
  },
  [HIDE_DIALOG](state) {
    return {
      ...state,
      dialog: defaultState.dialog
    };
  }
});

export default reducer;

function local(state) {
  return state[namespace];
}

export function showNotification(message) {
  return {
    type: SHOW_SNACKBAR,
    payload: {
      message
    }
  };
}

export function hideSnackbarNotification() {
  return {
    type: HIDE_SNACKBAR
  };
}

export function showDialogNotification(title, message) {
  return {
    type: SHOW_DIALOG,
    payload: {
      title,
      message
    }
  };
}

export function hideDialogNotification() {
  return {
    type: HIDE_DIALOG
  };
}

export function selectSnackbarNotificationState(state) {
  return local(state).snackbar;
}

export function selectDialogNotificationState(state) {
  return local(state).dialog;
}
