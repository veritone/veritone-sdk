import { helpers } from 'veritone-redux-common';
import omit from 'lodash/omit';
import uniq from 'lodash/uniq';
import includes from 'lodash/includes';

const { createReducer } = helpers;

export const namespace = 'folderTree';

export const folderType = {
  cms: {
    orgFolderName: 'My Organization',
    ownerFolderName: 'My Folder',
    rootFolderType: 'cms',
    childs: 'tdo',
    childsType: 'childTDOs'
  },
  watchlist: {
    orgFolderName: 'Shared Watchlist',
    ownerFolderName: 'My Watchlist',
    rootFolderType: 'watchlist',
    child: 'watchlist',
    childsType: 'childWatchlists'
  },
  collection: {
    orgFolderName: 'Shared Collection',
    ownerFolderName: 'My Collection',
    rootFolderType: 'collection ',
    child: 'collection',
    childsType: 'childCollections'
  }
}

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


const defaultFolderState = {
  config: {},
  initialSuccess: false,
  fetching: false,
  fetched: false,
  error: false,
  foldersData: {
    rootIds: [],
    allId: [],
    byId: {}
  },
  selectedFolder: {},
  processingFolder: [],
  expandedFolderIds: [],
  searching: false,
  currentSearchValue: '',
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

export const deleteFolder = folderId => ({
  type: DELETE_FOLDER,
  payload: {
    folderId
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

export default createReducer(defaultFolderState, {
  [INIT_CONFIG]: (state, action) => ({
    ...state,
    config: {
      ...state.config,
      ...action.payload.config
    }
  }),
  [INIT_ROOT_FOLDER_START]: (state, action) => ({
    ...state,
    fetching: true
  }),
  [INIT_ROOT_FOLDER_SUCCESS]: (state, action) => {
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
      initialSuccess: true,
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
  [INIT_ROOT_FOLDER_ERROR]: (state, action) => ({
    ...state,
    fetching: false,
    fetched: true,
    error: true
  }),
  [INIT_FOLDER_START]: (state, action) => ({
    ...state,
    processingFolder: [...state.processingFolder, action.payload.folderId]
  }),
  [INIT_FOLDER_SUCCESS]: (state, action) => {
    const { folder } = action.payload;
    const folderId = folder.id;
    const parentId = folder.parentId;
    const allIdNew = includes(state.foldersData.allId, folderId)
      ? [...state.foldersData.allId] : [...state.foldersData.allId, folderId]
    const newParent = parentId ? {
      [parentId]: {
        ...state.foldersData.byId[parentId],
        childs: uniq([...state.foldersData.byId[parentId].childs, folderId])
      }
    } : {}
    return {
      ...state,
      fetching: false,
      fetched: true,
      initialSuccess: true,
      foldersData: {
        ...state.foldersData,
        allId: [...allIdNew],
        byId: {
          ...state.foldersData.byId,
          [folderId]: {
            ...state.foldersData.byId[folderId],
            ...folder
          },
          ...newParent
        }
      }
    }
  },
  [INIT_FOLDER_ERROR]: (state, action) => ({
    ...state,
    processingFolder: [
      ...state.processingFolder.filter(item => item !== action.payload.folderId)
    ],
  }),
  [FETCH_MORE_START]: (state, action) => ({
    ...state,
    processingFolder: [...state.processingFolder, action.payload.folderId]
  }),
  [FETCH_MORE_SUCCESS]: (state, action) => {
    const { folders, folderId } = action.payload;
    const folderByIds = folders.reduce((accum, currentFolder) => ({
      ...accum,
      [currentFolder.id]: currentFolder
    }), {});
    const folderChilds = [...folders.map(item => item.id)];
    return {
      ...state,
      processingFolder: [
        ...state.processingFolder.filter(item => item !== folderId)
      ],
      expandedFolderIds: [...state.expandedFolderIds, folderId],
      foldersData: {
        ...state.foldersData,
        allId: uniq([
          ...state.foldersData.allId,
          ...folders.map(item => item.id)
        ]),
        byId: {
          ...state.foldersData.byId,
          [folderId]: {
            ...state.foldersData.byId[folderId],
            childs: folderChilds,
            hasContent: folderChilds.length > 0
          },
          ...folderByIds
        }
      }
    }
  },
  [FETCH_MORE_ERROR]: (state, action) => ({
    ...state,
    processingFolder: [
      ...state.processingFolder.filter(item => item !== action.payload.folderId)
    ]
  }),
  [SELECT_FOLDER]: (state, action) => {
    const { selected, workSpace } = action.payload;
    return {
      ...state,
      selectedFolder: {
        ...state.selectedFolder,
        [workSpace]: selected
      }
    }
  },
  [SELECT_ALL_FOLDER]: (state, action) => ({
    ...state,
    selectedFolder: {
      ...state.searchFolder,
      [action.payload.workSpace]: state.foldersData.allId.reduce((accum, currentFolderId) => ({
        ...accum,
        [currentFolderId]: true
      }), {})

    }
  }),
  [SEARCH_START]: (state, action) => ({
    ...state,
    currentSearchValue: action.payload.searchValue,
    fetching: true,
    searching: true,
    fetched: false,
    error: false
  }),
  [SEARCH_SUCCESS]: (state, action) => {
    const { searchValue, folders } = action.payload;
    return {
      ...state,
      fetching: false,
      fetched: true,
      searching: false,
      searchFolderData: {
        ...state.searchFolderData,
        allId: [...state.searchFolderData.allId, searchValue],
        byId: {
          ...state.searchFolderData.byId,
          [searchValue]: {
            rootIds: [],
            allId: [...folders.map(item => item.id)],
            byId: {
              ...folders.reduce((accum, currentFolder) => ({
                ...accum,
                [currentFolder.id]: {
                  ...currentFolder,
                  parentId: null,
                  hasContent: false
                }
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
    searching: false,
    error: true
  }),
  [DELETE_FOLDER_START]: (state, action) => ({
    ...state,
    processingFolder: [...state.processingFolder, action.payload.folderId]
  }),
  [DELETE_FOLDER_ERROR]: (state, action) => ({
    ...state,
    processingFolder: [
      ...state.processingFolder.filter(item => item !== action.payload.folderId)
    ]
  }),
  [DELETE_FOLDER_SUCCESS]: (state, action) => {
    const { folderId, parentId } = action.payload;
    return {
      ...state,
      processingFolder: [
        ...state.processingFolder.filter(item => item !== folderId)
      ],
      foldersData: {
        ...state.foldersData,
        allId: [...state.foldersData.allId.filter(item => item !== folderId)],
        byId: {
          ...omit(state.foldersData.byId, folderId),
          [parentId]: {
            ...state.foldersData.byId[parentId],
            childs: [...state.foldersData.byId[parentId].childs.filter(child => child !== folderId)]
          }
        }
      }
    }
  },
  [EDIT_FOLDER_START]: (state, action) => ({
    ...state,
    processingFolder: [...state.processingFolder, action.payload.folderId]
  }),
  [EDIT_FOLDER_ERROR]: (state, action) => ({
    ...state,
    processingFolder: [
      ...state.processingFolder.filter(item => item !== action.payload.folderId)
    ]
  }),
  [EDIT_FOLDER_SUCCESS]: (state, action) => {
    const { folder } = action.payload;
    const folderId = folder.id;
    return {
      ...state,
      processingFolder: [
        ...state.processingFolder.filter(item => item !== folderId)
      ],
      foldersData: {
        ...state.foldersData,
        byId: {
          ...state.foldersData.byId,
          [folderId]: {
            ...state.foldersData.byId[folderId],
            ...folder
          }
        }
      }
    }
  }
});
