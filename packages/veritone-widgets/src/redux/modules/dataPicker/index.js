import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import { helpers } from 'veritone-redux-common';
import folderReducer, {
  getItems as getFolderItems,
  namespace as folderNamespace,
  folderSaga
} from './folders';
import { dataPickerSelector } from './selector';

const { createReducer } = helpers;

const TOGGLE_PICKER_VIEW = 'Toggle picker view';
const TOGGLE_VIEW_TYPE = 'Toggle view type';



const pickerTypeReducer = createReducer('folder', {
  [TOGGLE_PICKER_VIEW]: (_, { payload }) => payload
});

const viewTypeReducer = createReducer('list', {
  [TOGGLE_VIEW_TYPE]: (_, { payload }) => payload
})

export const getCurrentPickerType = createSelector(
  dataPickerSelector,
  (state) => state.currentPickerType
)

export const getCurrentViewType = createSelector(
  dataPickerSelector,
  (state) => state.currentViewType
);

export const getItems = createSelector(
  [getCurrentPickerType, getFolderItems], // Extends: streamData
  (currentPickerType, folderItems) => {
    switch(currentPickerType) {
      case 'folder':
        return folderItems;
      case 'stream':
        return []; // Expect streams items
      default:
        return []
    }
  }
)

export default combineReducers({
  currentPickerType: pickerTypeReducer,
  currentViewType: viewTypeReducer,
  [folderNamespace]: folderReducer
});

