import { createSelector } from 'reselect';

export const folderData = (state) => state.folderTree.foldersData;

export const folderFetching = state => state.folderTree.fetching;

export const folderFetched = state => state.folderTree.fetched;

export const folderError = state => state.folderTree.error;

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