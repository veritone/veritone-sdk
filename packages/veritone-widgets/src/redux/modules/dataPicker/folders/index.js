import { helpers } from 'veritone-redux-common';

const { createReducer } = helpers;

export const FETCH_ROOT_FOLDER_REQUEST  = 'request fetch root folder';
export const FETCH_ROOT_FOLDER_SUCCESS = 'request fetch root folder success';
export const FETCH_ROOT_FOLDER_FAILURE = 'request fetch root folder failure';
export const FETCH_FOLDER_REQUEST = 'request fetch folder';
export const FETCH_FOLDER_SUCCESS = 'request fetch folder success';
export const FETCH_FOLDER_FAILURE = 'request fetch folder failure';
export const OPEN_FOLDER = 'open folder';
export const SELECT_CRUMB_FOLDER = 'select crumb';
export const SORT_ITEMS = 'sort items';
export const TRIGGER_PAGGINATION = 'trigger paggination';

export const openFolder = ({ id, name }) => ({
  type: OPEN_FOLDER,
  payload: { id, name }
})

export const fetchRootFolder = () => ({
  type: FETCH_ROOT_FOLDER_REQUEST,
})

export const fetchRootFolderSuccess = (data) => ({
  type: FETCH_ROOT_FOLDER_SUCCESS,
  payload: data,
})

export const fetchFolderSuccess = (data) => ({
  type: FETCH_FOLDER_SUCCESS,
  payload: data
})

export const fetchFolder = (id) => ({
  type: FETCH_FOLDER_REQUEST,
  payload: {
    id
  }
})

const initialState = {
  folders: {
    byId: {},
    isLoading: false,
    isLoaded: false
  },
  currentPathList: [{id: null }], // initial root pathList
  currentSortType: '',
  currentSortDirection: 'asc'
}

const folderReducer = createReducer(initialState, {
  [OPEN_FOLDER]: (state, { payload: { id, name } }) => ({
    ...state,
    currentPathList: [...state.currentPathList, {
      name,
      id,
    }]
  }),
  [FETCH_ROOT_FOLDER_REQUEST]: (state, _) => ({
    ...state,
    folders: {
      ...state.folders,
      isLoading: true
    }
  }),
  [FETCH_ROOT_FOLDER_SUCCESS]: (state, {payload: { id, name}}) => ({
    ...state,
    rootFolderId: id,
    currentPathList: [{ id }],
    folders: {
      ...state.folders,
      byId: {
        ...state.folders.byId,
        [id]: {
          id,
          name
        }
      },
    }
  }),
  [FETCH_ROOT_FOLDER_FAILURE]: (state, { payload: { id } } ) => ({
    ...state,
    folders: {
      ...state.folders,
      isLoading: false,
      isLoaded: true,
      isError: true
    }
  }),
  [SELECT_CRUMB_FOLDER]: (state, { payload: { index } }) => ({
    ...state,
    currentPathList: state.currentPathList.slice(0, index + 1)
  }),
  [FETCH_FOLDER_REQUEST]: (state, { payload: { id } }) => ({
    ...state,
    folders: {
      ...state.folders,
      byId: {
        ...state.folders.byId,
        [id]: {
          ...state.folders.byId[id],
          isLoading: true
        }
      },
    }
  }),
  [FETCH_FOLDER_SUCCESS]: (state, {
    payload: { id, childFolders, childTDOs
    }}) => ({
    ...state,
    folders: {
      ...state.folders,
      byId: {
        ...state.folders.byId,
        [id]: {
          ...state.folders.byId[id],
          isLoading: false,
          isLoaded: true,
          childTDOs: state.folders.byId[id].childTDOs ? [
            ...state.folders.byId[id].childTDOs,
            ...childTDOs.records
          ] : childTDOs.records,
          childFolders: state.folders.byId[id].childFolders ?
            [
              ...state.folders.byId[id].childFolders,
              ...childFolders.records
            ] : childFolders.records
        }
      },
    },
  }),
  [FETCH_FOLDER_FAILURE]: (state, { payload: { id } }) => ({
    ...state,
    folders: {
      ...state.folders,
      byId: {
        ...state.folders.byId,
        [id]: {
          ...state.folders.byId[id],
          isLoading: false,
          isLoaded: true,
          isError: true
        }
      }
    }
  }),
  [SORT_ITEMS]: (state, { payload: { type, direction } }) => ({
    ...state,
    currentSortType: type,
    currentSortDirection: direction
  })
});

export * from './saga';
export * from './selector';

export default folderReducer;
