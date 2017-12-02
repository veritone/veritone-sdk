import { helpers } from 'veritone-redux-common';

const { createReducer } = helpers;

export const FILE_PICKER_OPEN = 'FILE_PICKER_OPEN';
export const FILE_PICKER_CLOSE = 'FILE_PICKER_CLOSE';

export const namespace = 'filePicker';

const defaultState = {
  open: false
};

export default createReducer(defaultState, {
  [FILE_PICKER_OPEN](state, action) {
    return {
      ...state,
      open: true
    };
  },

  [FILE_PICKER_CLOSE](state, action) {
    return {
      ...state,
      open: false
    };
  }
});

const local = state => state[namespace];

export function setPickerOpen(state) {
  return {
    type: state ? FILE_PICKER_OPEN : FILE_PICKER_CLOSE
  };
}

export const pickerOpen = state => local(state).open;

// open FilePicker in a dialog, receive files in callback
// open ProgressDialog in a dialog
// get a signed URL for each object to be uploaded (key=filename)
//   update progress by (20% / num filess) as each resolves
// PUT each object to its respective URL
//   update progress by (80% / num files) as each resolves
// if all successful, show doneSuccess on progress modal for a second, then close.
// if any failed, show doneFailure on progress modal with an error message (which ones failed, which succeeded, why) + close button.

// widget should have an onSuccess callback which returns a list of objects
// object = { url: 's3-url.com/my-file.jpg', filename: 'my-file.jpg', size, type, etc }

// const picker = new FilePicker({
//   elId: '#file-picker',
//   accept: ['.jpg', '.png']
// });
// new VeritoneApp([picker]).mount();
//
// // how do i open the modal?
// picker.open();
