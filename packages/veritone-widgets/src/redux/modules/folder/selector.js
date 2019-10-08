import { createSelector } from 'reselect';

export const folderData = (state) => state.folderTree.foldersData;

export const folderFetching = state => state.folderTree.fetching;

export const folderFetched = state => state.folderTree.fetched;

export const folderError = state => state.folderTree.error;

export const rootFolderIds = state => state.folderTree.foldersData.rootIds;

export const folderById = state => folderId => state.folderTree.foldersData.byId[folderById];

export const folderExpanded = state => state.folderTree.expandedFolderIds;

export const selected = state => state.folderTree.selectedFolder;

export const expandingFolderIds = state => state.folderTree.expandingFolderIds;

export const foldersDataSelector = createSelector(
    [folderData],
    foldersData => foldersData
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

export const expandingFolderIdsSelector = createSelector(
    [expandingFolderIds],
    expandingFolderIds => expandingFolderIds
)
