import { createSelector } from 'reselect';

export const folderData = state => state.folderTree.foldersData;

export const folderFetching = state => state.folderTree.fetching;

export const folderFetched = state => state.folderTree.fetched;

export const folderError = state => state.folderTree.error;

export const rootFolderIds = state => state.folderTree.foldersData.rootIds;

export const folderById = state => folderId => state.folderTree.foldersData.byId[folderId];

export const folderExpanded = state => state.folderTree.expandedFolderIds;

export const selected = state => state.folderTree.selectedFolder;

export const processingFolder = state => state.folderTree.processingFolder;

export const config = state => state.folderTree.config;

export const searchValue = state => state.folderTree.currentSearchValue;

export const searchData = state => state.folderTree.searchFolderData;

export const initialSuccess = state => state.folderTree.initialSuccess;

export const foldersDataSelector = createSelector(
  [folderData, searchValue, searchData],
  (foldersData, searchValue, searchData) => {
    if (searchValue !== '') {
      return searchData.byId[searchValue]
    }
    return foldersData
  }
);

export const folderFetchingStatus = createSelector(
  [folderFetching],
  folderFetching => folderFetching
);

export const folderFetchedStatus = createSelector(
  [folderFetched],
  folderFetched => folderFetched
);

export const folderErrorStatus = createSelector(
  [folderError],
  folderError => folderError
);

export const selectedFolder = createSelector(
  [selected],
  (selected) => {
    return selected;
  }
);

export const processingFolderSelector = createSelector(
  [processingFolder],
  processingFolder => processingFolder
)

export const getInitialStatus = createSelector(
  [initialSuccess],
  initialSuccess => initialSuccess
)
