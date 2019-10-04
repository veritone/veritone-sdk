import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const INIT_ROOT_FOLDER = 'folder/INIT_ROOT_FOLDER';
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

export const namespace = 'folderTree';

const fakeData = {
  rootIds: [1],
  allId: [1, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  byId: {
    1: {
      id: 1,
      name: 'RootFolder',
      contentType: 'folder',
      childs: [2, 3, 4, 5, 6, 121, 122, 123],
      subfolders: [2, 3, 4, 5, 6],
      subcontents: [121, 122, 123]
    },
    2: {
      id: 2,
      name: 'Folder 2',
      contentType: 'folder',
      childs: [124],
      parentId: 1,
      subfolders: [],
      subcontents: [124]
    },
    3: {
      id: 3,
      name: 'Folder 3',
      contentType: 'folder',
      childs: [7, 8, 125],
      parentId: 1,
      subfolders: [7, 8],
      subcontents: [125]
    },
    4: {
      id: 4,
      name: 'Folder 4',
      contentType: 'folder',
      childs: [126],
      parentId: 1,
      subfolders: [],
      subcontents: [126]
    },
    5: {
      id: 5,
      name: 'Folder 5',
      contentType: 'folder',
      childs: [],
      parentId: 1,
      subfolders: [],
      subcontents: []
    },
    6: {
      id: 6,
      name: 'Folder 6',
      contentType: 'folder',
      childs: [127],
      parentId: 1,
      subfolders: [],
      subcontents: [127]
    },
    7: {
      id: 7,
      name: 'Folder 7 long name name name',
      contentType: 'folder',
      childs: [9, 128],
      parentId: 3,
      subfolders: [9],
      subcontents: [128]
    },
    8: {
      id: 8,
      name: 'Folder 8',
      contentType: 'folder',
      childs: [129],
      parentId: 3,
      subfolders: [],
      subcontents: [129]
    },
    9: {
      id: 9,
      name: 'Folder 9',
      contentType: 'folder',
      childs: [10, 11],
      parentId: 7,
      subfolders: [10, 11],
      subcontents: []
    },
    10: {
      id: 10,
      name: 'Folder 10',
      contentType: 'folder',
      childs: [],
      parentId: 9,
      subfolders: [],
      subcontents: []
    },
    11: {
      id: 11,
      name: 'Folder 11',
      contentType: 'folder',
      childs: [],
      parentId: 9,
      subfolders: [],
      subcontents: []
    },
    121: {
      id: 121,
      parentId: 1,
      contentType: 'collection',
      name: 'Content 1',
    },
    122: {
      id: 122,
      parentId: 1,
      contentType: 'collection',
      name: 'Content 2',
    },
    123: {
      id: 123,
      parentId: 1,
      contentType: 'collection',
      name: 'Content 3',
    },
    124: {
      id: 124,
      parentId: 2,
      contentType: 'collection',
      name: 'Content 4',
    },
    125: {
      id: 125,
      parentId: 3,
      contentType: 'collection',
      name: 'Content 5',
    },
    126: {
      id: 126,
      parentId: 4,
      contentType: 'collection',
      name: 'Content 6',
    },
    // 127: {
    //   id: 127,
    //   parentId: 6,
    //   contentType: 'collection',
    //   name: 'Content 7',
    // },
    128: {
      id: 128,
      parentId: 7,
      contentType: 'collection',
      name: 'Content 8',
    },
    129: {
      id: 129,
      parentId: 8,
      contentType: 'collection',
      name: 'Content 9',
    },
    1210: {
      id: 1210,
      contentType: 'collection',
      name: 'Content 10',
    }
  }
}

const defaultFolderState = {
  fetching: false,
  fetched: false,
  error: false,
  foldersData: {
    rootIds: [],
    allId: [],
    byId: {}
  },
  expandingFolderIds: [],
  expandedFolderIds: [],
  searchFolderData: {
    allId: [],
    byId: {}
  }
};

export const initRootFolder = () => ({
  type: INIT_ROOT_FOLDER
});

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

export const initFolder = (type, isEnablePersonalFolder) => ({
  type: INIT_FOLDER,
  payload: {
    type,
    isEnablePersonalFolder
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

export default createReducer(defaultFolderState, {
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
        rootIds: [...state.foldersData.rootIds, ...rootFolderId],
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
    return {
      ...state,
      expandingFolderIds: [
        ...action.expandingFolderIds.filter(item => item !== folderId)
      ],
      expandedFolderIds: [...state.expandedFolderIds, folderId],
      foldersData: {
        ...state.foldersData,
        allId: [
          ...state.foldersData.allId,
          ...folders.map(item => item.id)
        ],
        byId: [
          ...state.foldersData.byId,
          ...folders.reduce((accum, currentFolder) => ({
            ...accum,
            [currentFolder.id]: currentFolder
          }), {})
        ]
      }
    }
  },
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


