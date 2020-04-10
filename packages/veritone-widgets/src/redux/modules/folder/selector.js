import { createSelector } from 'reselect';

export const namespace = 'folderTree';

export const folderSelector = state => state[namespace];

export const folderData = state => state[namespace].foldersData;

export const folderFetching = state => state[namespace].fetching;

export const folderFetched = state => state[namespace].fetched;

export const folderError = state => state[namespace].error;

export const rootFolderIds = state => state[namespace].foldersData.rootIds;

export const folderById = state => folderId => state[namespace].foldersData.byId[folderId];

export const folderExpanded = state => state[namespace].expandedFolderIds;

export const selected = state => state[namespace].selectedFolder;

export const processingFolder = state => state[namespace].processingFolder;

export const config = state => state[namespace].config;

export const searching = state => state[namespace].searching;

export const searchValue = state => state[namespace].currentSearchValue;

export const searchData = state => state[namespace].searchFolderData;

export const initialSuccess = state => state[namespace].initialSuccess;

export const eventSelector = state => state[namespace].event;

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
  selected => selected
);

export const processingFolderSelector = createSelector(
  [processingFolder],
  processingFolder => processingFolder
)

export const getInitialStatus = createSelector(
  [initialSuccess],
  initialSuccess => initialSuccess
)
