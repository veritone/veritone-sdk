import { helpers } from 'veritone-redux-common';
import _ from 'lodash';
const { createReducer } = helpers;

export const INIT = 'folder/INIT';
export const INIT_ROOT_FOLDER = 'folder/INIT_ROOT_FOLDER';
export const INIT_CONFIG = 'folder/INIT_CONFIG';
export const INIT_ROOT_FOLDER_START = 'folder/INIT_ROOT_FOLDER_START';
export const INIT_ROOT_FOLDER_SUCCESS = 'folder/INIT_ROOT_FOLDER_SUCCESS';
export const INIT_ROOT_FOLDER_ERROR = 'folder/INIT_ROOT_FOLDER_ERROR';
export const INIT_FOLDER = 'folder/INIT_FOLDER'
export const INIT_FOLDER_START = 'folder/INIT_FOLDER_START';
export const INIT_FOLDER_SUCCESS = 'folder/INIT_FOLDER_SUCCESS';
export const INIT_FOLDER_ERROR = 'folder/INIT_FOLDER_ERROR';
export const FETCH_MORE = 'folder/FETCH_MORE';
export const FETCH_MORE_START = 'folder/FETCH_MORE_START';
export const FETCH_MORE_SUCCESS = 'folder/FETCH_MORE_SUCCESS';
export const FETCH_MORE_ERROR = 'folder/FETCH_MORE_ERROR';
export const SEARCH_FOLDER = 'folder/SEARCH_FOLDER';
export const SEARCH_START = 'folder/SEARCH_START';
export const SEARCH_SUCCESS = 'folder/SEARCH_SUCCESS';
export const SEARCH_ERROR = 'folder/SEARCH_ERROR';
export const SELECT_FOLDER = 'folder/SELECT_FOLDER';
export const SELECT_ALL_FOLDER = 'folder/SELECT_ALL_FOLDER';

export const namespace = 'folderTree';

const defaultFolderState = {
  config: {},
  fetching: false,
  fetched: false,
  error: false,
  foldersData: {
    rootIds: [],
    allId: [],
    byId: {}
  },
  selectedFolder: {},
  expandingFolderIds: [],
  expandedFolderIds: [],
  searching: false,
  searchFolderData: {
    allId: [],
    byId: {}
  }
};

export const init = config => ({
  type: INIT,
  payload: {
    config
  }
})

export const initRootFolder = (config) => ({
  type: INIT_ROOT_FOLDER,
  payload: {
    config
  }
});

export const initConfig = (config) => ({
  type: INIT_CONFIG,
  payload: {
    config
  }
})

export const initRootFolderStart = () => ({
  type: INIT_ROOT_FOLDER_START
});

export const initRootFolderSuccess = (rootFolder) => ({
  type: INIT_ROOT_FOLDER_SUCCESS,
  payload: {
    rootFolder
  }
});
export const initRootFolderError = () => ({
  type: INIT_ROOT_FOLDER_ERROR
});

export const initFolder = config => ({
  type: INIT_FOLDER,
  payload: {
    config
  }
});

export const initFolderStart = () => ({
  type: INIT_FOLDER_START
});

export const initFolderSuccess = (folders, rootFolderId) => ({
  type: INIT_FOLDER_SUCCESS,
  payload: {
    folders,
    rootFolderId
  }
});

export const initFolderError = () => ({
  type: INIT_FOLDER_ERROR
});

export const fetchMore = (folderId) => ({
  type: FETCH_MORE,
  payload: {
    folderId
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

export const fetchMoreError = () => ({
  type: FETCH_MORE_ERROR
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

export const selectFolder = selected => ({
  type: SELECT_FOLDER,
  payload: {
    selected
  }
});

export const selectAllFolder = () => ({
  type: SELECT_FOLDER
});

export default createReducer(defaultFolderState, {
  [INIT_CONFIG]: (state, action) => ({
    ...state,
    config: {
      ...state.config,
      ...action.payload.config
    }
  }),
  [INIT_FOLDER_START]: (state, action) => ({
    ...state,
    fetching: true,
  }),
  [INIT_FOLDER_SUCCESS]: (state, action) => {
    const { folders, rootFolderId } = action.payload;
    const folderIds = folders.map(folder => folder.id);
    const folderByIds = folders.reduce((accum, currentFolder) => ({
      ...accum,
      [currentFolder.id]: currentFolder
    }), {})
    return {
      ...state,
      fetching: false,
      fetched: true,
      foldersData: {
        ...state.foldersData,
        rootIds: [...rootFolderId],
        allId: [...state.foldersData.byId, ...rootFolderId, ...folderIds],
        byId: {
          ...state.foldersData.byId,
          ...folderByIds
        }
      }
    }
  },
  [INIT_FOLDER_ERROR]: (state, action) => ({
    ...state,
    fetching: false,
    fetched: true,
    error: true
  }),
  [FETCH_MORE_START]: (state, action) => ({
    ...state,
    expandingFolderIds: [...state.expandingFolderIds, action.payload.folderId]
  }),
  [FETCH_MORE_SUCCESS]: (state, action) => {
    const { folders, folderId } = action.payload;
    const folderByIds = folders.reduce((accum, currentFolder) => ({
      ...accum,
      [currentFolder.id]: currentFolder
    }), {})
    return {
      ...state,
      expandingFolderIds: [
        ...state.expandingFolderIds.filter(item => item !== folderId)
      ],
      expandedFolderIds: [...state.expandedFolderIds, folderId],
      foldersData: {
        ...state.foldersData,
        allId: _.uniq([
          ...state.foldersData.allId,
          ...folders.map(item => item.id)
        ]),
        byId: {
          ...state.foldersData.byId,
          [folderId]: {
            ...state.foldersData.byId[folderId],
            childs: folders.map(item => item.id)
          },
          ...folderByIds
        }
      }
    }
  },
  [SELECT_FOLDER]: (state, action) => ({
    ...state,
    selectedFolder: action.payload.selected
  }),
  [SELECT_ALL_FOLDER]: (state, action) => ({
    ...state,
    selectedFolder: {
      ...state.foldersData.allId.reduce((accum, currentFolderId) => ({
        ...accum,
        [currentFolderId]: true
      }), {})
    }
  }),
  [SEARCH_START]: (state, action) => ({
    ...state,
    fetching: true,
    fetched: false,
    error: false
  }),
  [SEARCH_SUCCESS]: (state, action) => {
    const { searchValue, folders } = action.payload;
    return {
      ...state,
      fetching: false,
      fetched: true,
      searchFolderData: {
        ...state.searchFolderData,
        allId: [...state.searchFolderData.allId, searchValue],
        byId: {
          ...state.searchFolderData.byId,
          [searchValue]: {
            allId: [...folders.map(item => item.id)],
            byId: {
              ...folders.reduce((accum, currentFolder) => ({
                ...accum,
                [currentFolder.id]: currentFolder
              }), {})
            }
          }
        }
      }
    }
  },
  [SEARCH_ERROR]: (state, action) => ({
    ...state,
    fetching: false,
    fetched: true,
    error: true
  })
});


