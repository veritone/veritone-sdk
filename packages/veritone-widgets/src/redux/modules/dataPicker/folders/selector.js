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
  (state) => state.byId[id] || {}
)

export const getFolderState = createSelector(
  [getFolders, getPathList],
  (folders, currentPathlist) => {
    if (currentPathlist.length === 0) {
      return {
        isLoading: folders.isLoading,
        isLoaded: folders.isLoaded,
        isError: folders.isError
      }
    }
    const { id } = currentPathlist.slice(-1);
    const { isLoading, isLoaded, isError } = folders.byId[id] || {};
    return {
      isLoading,
      isLoaded,
      isError
    }
  }
)

export const getItems = createSelector(
  [getFolders, getPathList],
  (folders, currentPathList) => {
    if (currentPathList.length === 0) {
      return [];
    };

    const { id } = currentPathList.slice(-1)[0];
    const { childFolders = [], childTDOs = [] } = folders.byId[id];
    return [
      ...childFolders.map(folder => ({ ...folder, type: 'folder' })),
      ...childTDOs.map(tdo => ({...tdo, type: 'tdo'}))
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
