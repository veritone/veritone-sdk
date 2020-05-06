import { helpers } from 'veritone-redux-common';
import omit from 'lodash/omit';
import uniq from 'lodash/uniq';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import * as actions from './actions';;

const { createReducer } = helpers;

export const namespace = 'folderTree';

export const folderType = {
  cms: {
    orgFolderName: 'My Organization',
    ownerFolderName: 'My Folder',
    rootFolderType: 'cms',
    childs: 'tdo',
    childsType: 'childTDOs',
    deleteContent: 'deleteTDO'

  },
  watchlist: {
    orgFolderName: 'Shared Watchlist',
    ownerFolderName: 'My Watchlist',
    rootFolderType: 'watchlist',
    child: 'watchlist',
    childsType: 'childWatchlists',
    deleteContent: 'deleteWatchlist'

  },
  collection: {
    orgFolderName: 'Shared Collections',
    ownerFolderName: 'My Collection',
    rootFolderType: 'collection ',
    child: 'collection',
    childsType: 'childCollections',
    deleteContent: 'deleteCollection'
  }
}

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
  },
  event: {}
};

export const folderReducer = createReducer(defaultFolderState, {
  [actions.INIT_CONFIG]: (state, action) => ({
    ...state,
    config: {
      ...state.config,
      ...action.payload.config
    }
  }),
  [actions.INIT_ROOT_FOLDER_START]: (state, action) => ({
    ...state,
    fetching: true
  }),
  [actions.INIT_ROOT_FOLDER_SUCCESS]: (state, action) => {
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
        allId: uniq([...state.foldersData.allId, ...rootFolderId, ...folderIds]),
        byId: {
          ...state.foldersData.byId,
          ...folderByIds
        }
      }
    }
  },
  [actions.INIT_ROOT_FOLDER_ERROR]: (state, action) => ({
    ...state,
    fetching: false,
    fetched: true,
    error: true
  }),
  [actions.INIT_FOLDER_START]: (state, action) => ({
    ...state,
    processingFolder: [...state.processingFolder, action.payload.folderId]
  }),
  [actions.INIT_FOLDER_SUCCESS]: (state, action) => {
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
  [actions.INIT_FOLDER_ERROR]: (state, action) => ({
    ...state,
    processingFolder: [
      ...state.processingFolder.filter(item => item !== action.payload.folderId)
    ],
  }),
  [actions.FETCH_MORE_START]: (state, action) => ({
    ...state,
    processingFolder: [...state.processingFolder, action.payload.folderId]
  }),
  [actions.FETCH_MORE_SUCCESS]: (state, action) => {
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
  [actions.FETCH_MORE_ERROR]: (state, action) => ({
    ...state,
    processingFolder: [
      ...state.processingFolder.filter(item => item !== action.payload.folderId)
    ]
  }),
  [actions.SELECT_FOLDER]: (state, action) => {
    const { selected, workSpace } = action.payload;
    return {
      ...state,
      selectedFolder: {
        ...state.selectedFolder,
        [workSpace]: selected
      }
    }
  },
  [actions.SELECT_ALL_FOLDER]: (state, action) => ({
    ...state,
    selectedFolder: {
      ...state.searchFolder,
      [action.payload.workSpace]: state.foldersData.allId.reduce((accum, currentFolderId) => ({
        ...accum,
        [currentFolderId]: true
      }), {})

    }
  }),
  [actions.SEARCH_START]: (state, action) => ({
    ...state,
    currentSearchValue: action.payload.searchValue,
    fetching: true,
    searching: true,
    fetched: false,
    error: false
  }),
  [actions.SEARCH_SUCCESS]: (state, action) => {
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
  [actions.SEARCH_ERROR]: (state, action) => ({
    ...state,
    fetching: false,
    fetched: true,
    searching: false,
    error: true
  }),
  [actions.CLEAR_SEARCH]: (state) => ({
    ...state,
    currentSearchValue: ''
  }),
  [actions.DELETE_FOLDER_START]: (state, action) => ({
    ...state,
    processingFolder: [...state.processingFolder, action.payload.folderId]
  }),
  [actions.DELETE_FOLDER_ERROR]: (state, action) => ({
    ...state,
    processingFolder: [
      ...state.processingFolder.filter(item => item !== action.payload.folderId)
    ]
  }),
  [actions.DELETE_FOLDER_SUCCESS]: (state, action) => {
    const { folderId, parentId } = action.payload;
    const targetParentFolder = state.foldersData.byId[parentId] || {};
    if (isEmpty(targetParentFolder)) {
      return state;
    }
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
            ...targetParentFolder,
            childs: [...targetParentFolder.childs.filter(child => child !== folderId)]
          }
        }
      }
    }
  },
  [actions.EDIT_FOLDER_START]: (state, action) => ({
    ...state,
    processingFolder: [...state.processingFolder, action.payload.folderId]
  }),
  [actions.EDIT_FOLDER_ERROR]: (state, action) => ({
    ...state,
    processingFolder: [
      ...state.processingFolder.filter(item => item !== action.payload.folderId)
    ]
  }),
  [actions.EDIT_FOLDER_SUCCESS]: (state, action) => {
    const { folder } = action.payload;
    const folderId = folder.id;
    const targetFolder = state.foldersData.byId[folderId] || {};
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
            ...targetFolder,
            ...folder
          }
        }
      }
    }
  },
  [actions.UNSELECT_ALL_FOLDER]: (state, action) => ({
    ...state,
    selectedFolder: {}
  }),
  [actions.UNSELECT_FOLDER]: (state, action) => {
    const { workSpace, folderId } = action.payload;
    const selected = state.selectedFolder[workSpace];
    return {
      ...state,
      selectedFolder: {
        ...state.selectedFolder,
        [workSpace]: { ...omit(selected, folderId) }
      }
    }
  },
  [actions.UNSELECT_CURRENT_FOLDER]: (state, action) => {
    const { workSpace } = action.payload;
    return {
      ...state,
      selectedFolder: {
        ...state.selectedFolder,
        [workSpace]: {}
      }
    }
  },
  [actions.EVENT_CHANNEL]: (state, action) => ({
    ...state,
    event: {
      ...state.event,
      [action.payload.workSpace]: {
        eventType: action.payload.eventType,
        data: action.payload.data
      }
    }
  })
});


