import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import { helpers } from 'veritone-redux-common';
import folderReducer, {
  getItems as getFolderItems,
  namespace as folderNamespace,
  getPathList as getFolderPathList,
  getFolderState
} from './folders';
import { namespace, dataPickerSelector } from './selector';

const { createReducer } = helpers;

const TOGGLE_PICKER_VIEW = 'Toggle picker view';
const TOGGLE_VIEW_TYPE = 'Toggle view type';

export const togglePickerType = (pickerType) => ({
  type: TOGGLE_PICKER_VIEW,
  payload: pickerType
})

export const toggleViewType = (viewType) => ({
  type: TOGGLE_VIEW_TYPE,
  payload: viewType
})

export { openFolder } from './folders';

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

export const getPathList =  createSelector(
  [getCurrentPickerType, getFolderPathList], // Extends: stream pathList
  (currentPickerType, folderPathList) => {
    switch (currentPickerType) {
      case 'folder':
        return folderPathList
      case 'stream':
        return [] // Expect streams pathList
      default:
        return [];
    }
  }
)

export const getCurrentState = createSelector(
  [getCurrentPickerType, getFolderState], // Extends: stream pathList
  (currentPickerType, folderState) => {
    switch (currentPickerType) {
      case 'folder':
        return folderState
      case 'stream':
        return {} // Expect streams pathList
      default:
        return {};
    }
  }
)

export { namespace }

export default combineReducers({
  currentPickerType: pickerTypeReducer,
  currentViewType: viewTypeReducer,
  [folderNamespace]: folderReducer
})
