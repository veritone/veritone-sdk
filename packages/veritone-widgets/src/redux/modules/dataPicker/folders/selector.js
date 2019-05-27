import { createSelector } from 'reselect';
import { dataPickerSelector } from '../selector';

export const namespace = 'folderData';

const folderSelector = createSelector(
  dataPickerSelector,
  (state) => state[namespace]
);

export const getPathList = createSelector(
  folderSelector,
  (state) => state.currentPathList
)

export const getFolders = createSelector(
  folderSelector,
  (state) => state.folders
)

export const getFolderDetail = (id) => createSelector(
  getFolders,
  (state) => state.folders[id] || {}
)

export const getItems = createSelector(
  [folderSelector, getPathList],
  (folders, currentPathList) => {
    if (currentPathList.length === 0) {
      return [];
    };

    const { id } = currentPathList.slice(-1)[0];
    const { childFolders = [], childTDOs = [] } = folders.byId[id];
    return [
      ...childFolders,
      ...childTDOs
    ];
  }
)

export const getSort = createSelector(
  folderSelector,
  (state) => ({
    type: state.currentSortType,
    direction: state.currentSortDirection
  })
)
