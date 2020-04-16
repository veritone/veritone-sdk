import { namespace } from './selector';

export const INIT = `${namespace}/INIT`;
export const INIT_ROOT_FOLDER = `${namespace}/INIT_ROOT_FOLDER`;
export const INIT_CONFIG = `${namespace}/INIT_CONFIG`;
export const INIT_ROOT_FOLDER_START = `${namespace}/INIT_ROOT_FOLDER_START`;
export const INIT_ROOT_FOLDER_SUCCESS = `${namespace}/INIT_ROOT_FOLDER_SUCCESS`;
export const INIT_ROOT_FOLDER_ERROR = `${namespace}/INIT_ROOT_FOLDER_ERROR`;
export const INIT_FOLDER = `${namespace}/INIT_FOLDER`;
export const INIT_FOLDER_START = `${namespace}/INIT_FOLDER_START`;
export const INIT_FOLDER_SUCCESS = `${namespace}/INIT_FOLDER_SUCCESS`;
export const INIT_FOLDER_ERROR = `${namespace}/INIT_FOLDER_ERROR`;
export const FETCH_MORE = `${namespace}/FETCH_MORE`;
export const FETCH_MORE_START = `${namespace}/FETCH_MORE_START`;
export const FETCH_MORE_SUCCESS = `${namespace}/FETCH_MORE_SUCCESS`;
export const FETCH_MORE_ERROR = `${namespace}/FETCH_MORE_ERROR`;
export const SEARCH_FOLDER = `${namespace}/SEARCH_FOLDER`;
export const SEARCH_START = `${namespace}/SEARCH_START`;
export const SEARCH_SUCCESS = `${namespace}/SEARCH_SUCCESS`;
export const SEARCH_ERROR = `${namespace}/SEARCH_ERROR`;
export const SEARCH_UPDATE_DATA = `${namespace}/SEARCH_UPDATE_DATA`;
export const CLEAR_SEARCH = `${namespace}/CLEAR_SEARCH`;
export const SELECT_FOLDER = `${namespace}/SELECT_FOLDER`;
export const SELECT_ALL_FOLDER = `${namespace}/SELECT_ALL_FOLDER`;
export const CREATE_FOLDER = `${namespace}/CREATE_FOLDER`;
export const CREATE_FOLDER_START = `${namespace}/CREATE_FOLDER_START`;
export const CREATE_FOLDER_SUCCESS = `${namespace}/CREATE_FOLDER_SUCCESS`;
export const CREATE_FOLDER_ERROR = `${namespace}/CREATE_FOLDER_ERROR`;
export const DELETE_FOLDER = `${namespace}/DELETE_FOLDER`;
export const DELETE_FOLDER_START = `${namespace}/DELETE_FOLDER_START`;
export const DELETE_FOLDER_SUCCESS = `${namespace}/DELETE_FOLDER_SUCCESS`;
export const DELETE_FOLDER_ERROR = `${namespace}/DELETE_FOLDER_ERROR`;
export const EDIT_FOLDER = `${namespace}/EDIT_FOLDER`;
export const EDIT_FOLDER_START = `${namespace}/EDIT_FOLDER_START`;
export const EDIT_FOLDER_SUCCESS = `${namespace}/EDIT_FOLDER_SUCCESS`;
export const EDIT_FOLDER_ERROR = `${namespace}/EDIT_FOLDER_ERROR`;
export const INIT_FOLDER_FROM_APP = `${namespace}/INIT_FOLDER_FROM_APP`;
export const INIT_FOLDER_FROM_APP_START = `${namespace}/INIT_FOLDER_FROM_APP_START`;
export const INIT_FOLDER_FROM_APP_SUCCESS = `${namespace}/INIT_FOLDER_FROM_APP_SUCCESS`;
export const INIT_FOLDER_FROM_APP_ERROR = `${namespace}/INIT_FOLDER_FROM_APP_ERROR`;
export const UNSELECT_FOLDER = `${namespace}/UNSELECT_FOLDER`;
export const UNSELECT_ALL_FOLDER = `${namespace}/UNSELECT_ALL_FOLDER`;
export const UNSELECT_CURRENT_FOLDER = `${namespace}/UNSELECT_CURRENT_FOLDER`;
export const EVENT_CHANNEL = `${namespace}/EVENT_CHANNEL`;

export const init = config => ({
  type: INIT,
  payload: {
    config
  }
})


export const initConfig = (config) => ({
  type: INIT_CONFIG,
  payload: {
    config
  }
})
//rootFolder
export const initRootFolder = (config) => ({
  type: INIT_ROOT_FOLDER,
  payload: {
    config
  }
});

export const initRootFolderStart = () => ({
  type: INIT_ROOT_FOLDER_START
});

export const initRootFolderSuccess = (folders, rootFolderId) => ({
  type: INIT_ROOT_FOLDER_SUCCESS,
  payload: {
    folders,
    rootFolderId
  }
});
export const initRootFolderError = () => ({
  type: INIT_ROOT_FOLDER_ERROR
});

export const initFolder = folderId => ({
  type: INIT_FOLDER,
  payload: {
    folderId
  }
});
//folder
export const initFolderStart = folderId => ({
  type: INIT_FOLDER_START,
  payload: {
    folderId
  }
});

export const initFolderSuccess = (folder) => ({
  type: INIT_FOLDER_SUCCESS,
  payload: {
    folder
  }
});

export const initFolderError = folderId => ({
  type: INIT_FOLDER_ERROR,
  payload: {
    folderId
  }
});

export const fetchMore = (folderId, isReload = false) => ({
  type: FETCH_MORE,
  payload: {
    folderId,
    isReload
  }
});

export const fetchMoreStart = folderId => ({
  type: FETCH_MORE_START,
  payload: {
    folderId
  }
});

export const fetchMoreSuccess = (folders, folderId) => ({
  type: FETCH_MORE_SUCCESS,
  payload: {
    folders,
    folderId
  }
});

export const fetchMoreError = folderId => ({
  type: FETCH_MORE_ERROR,
  payload: {
    folderId
  }
});

export const searchFolder = searchValue => ({
  type: SEARCH_FOLDER,
  payload: {
    searchValue
  }
});

export const searchFolderStart = searchValue => ({
  type: SEARCH_START,
  payload: {
    searchValue
  }
});

export const searchFolderSuccess = (searchValue, folders) => ({
  type: SEARCH_SUCCESS,
  payload: {
    searchValue,
    folders
  }
});

export const searchFolderError = searchValue => ({
  type: SEARCH_ERROR,
  payload: {
    searchValue
  }
});

export const clearSearchData = () => ({
  type: CLEAR_SEARCH
});

export const updateSearchData = () => ({
  type: SEARCH_UPDATE_DATA
});

export const selectFolder = (workSpace, selected) => ({
  type: SELECT_FOLDER,
  payload: {
    workSpace,
    selected
  }
});

export const selectAllFolder = workSpace => ({
  type: SELECT_ALL_FOLDER,
  payload: {
    workSpace
  }
});

export const createFolder = (folderName, parentFolderId) => ({
  type: CREATE_FOLDER,
  payload: {
    name: folderName,
    parentId: parentFolderId
  }
});

export const createFolderStart = () => ({
  type: CREATE_FOLDER_START
});

export const createFolderSuccess = () => ({
  type: CREATE_FOLDER_SUCCESS
});

export const createFolderError = () => ({
  type: CREATE_FOLDER_ERROR
});

export const deleteFolder = (folderId, workSpace) => ({
  type: DELETE_FOLDER,
  payload: {
    folderId,
    workSpace
  }
});

export const deleteFolderStart = folderId => ({
  type: DELETE_FOLDER_START,
  payload: {
    folderId
  }
});

export const deleteFolderSuccess = (folderId, parentId) => ({
  type: DELETE_FOLDER_SUCCESS,
  payload: {
    folderId,
    parentId
  }
});

export const deleteFolderError = folderId => ({
  type: DELETE_FOLDER_ERROR,
  payload: {
    folderId
  }
});

export const modifyFolder = (folderId, folderName, isEditName, isMoveFolder, parentId) => ({
  type: EDIT_FOLDER,
  payload: {
    folderId,
    folderName,
    isEditName,
    isMoveFolder,
    parentId
  }
});

export const modifyFolderStart = folderId => ({
  type: EDIT_FOLDER_START,
  payload: {
    folderId
  }
});

export const modifyFolderSuccess = folder => ({
  type: EDIT_FOLDER_SUCCESS,
  payload: {
    folder
  }
});

export const modifyFolderError = folderId => ({
  type: EDIT_FOLDER_ERROR,
  payload: {
    folderId
  }
});

export const initFolderFromApp = folderId => ({
  type: INIT_FOLDER_FROM_APP,
  payload: {
    folderId
  }
});

export const initFolderFromAppStart = folderId => ({
  type: INIT_FOLDER_FROM_APP_START,
  payload: {
    folderId
  }
});

export const initFolderFromAppSuccess = folderId => ({
  type: INIT_FOLDER_FROM_APP_SUCCESS,
  payload: {
    folderId
  }
});

export const unSelectFolder = (folderId, workSpace) => ({
  type: UNSELECT_FOLDER,
  payload: {
    folderId,
    workSpace
  }
});

export const unSelectAllFolder = () => ({
  type: UNSELECT_ALL_FOLDER
});

export const unSelectCurrentFolder = (workSpace) => ({
  type: UNSELECT_CURRENT_FOLDER,
  payload: {
    workSpace
  }
});

export const initFolderFromAppError = folderId => ({
  type: INIT_FOLDER_FROM_APP_ERROR,
  payload: {
    folderId
  }
});

export const eventChannel = (workSpace, eventType, data) => ({
  type: EVENT_CHANNEL,
  payload: {
    workSpace,
    eventType,
    data
  }
});
