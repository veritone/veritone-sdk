import * as Actions from './actionCreators';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

const Status = {
  LOADING: 'Loading',
  LOADED: 'Loaded',
  CREATING: 'Creating',
  CREATED: 'Created',
  ERROR: 'Error'
};

const initialState = {
  rootFolderType: undefined,
  folder: {
    status: undefined,
    data: {
      id: undefined,
      name: undefined,
      description: undefined,
      orderIndex: 0,
      parent: {
        id: undefined,
        name: undefined
      },
      contentTemplates: []
    }
  },
  schemas: {
    status: undefined,
    data: {}
  }
};

export { namespace } from './actionCreators';
export default createReducer(initialState, {
  [Actions.LOAD_SCHEMAS] (state) {
    return {...state, schemas: {status: 'loading'}};
  },
  [Actions.LOAD_SCHEMAS_COMPLETE] (state, action) {
    if (action.error) {
      return {...state, schemas: {status: 'error', data:{}}}
    } else if (action.payload) {
      return {...state, schemas: {status: 'loaded', data: action.payload}};
    }
  },

  [Actions.LOAD_FOLDER] (state) {
    return {...state, folder: {status: 'loading'}};
  },
  [Actions.LOAD_FOLDER_COMPLETE] (state, action) {
    if (action.error) {
      return {...state, folder: {status: 'error', data:{}}}
    } else if (action.payload) {
      return {...state, folder: {status: 'loaded', data: {...action.payload.folder}}};
    }
  },
  
  [Actions.CREATE_FOLDER] (state) {
    return {};
  },
  [Actions.CREATE_FOLDER_COMPLETE] (state) {
    return {};
  },
  
  [Actions.UPDATE_FOLDER] (state) {
    return {};
  },
  [Actions.UPDATE_FOLDER_COMPLETE] (state) {
    return {};
  },

  [Actions.CREATE_CONTENT_TEMPLATE] (state) {
    return {}
  },
  [Actions.CREATE_CONTENT_TEMPLATE_COMPLETE] (state) {

  },

  [Actions.UPDATE_CONTENT_TEMPLATE] (state) {
    return {}
  },
  [Actions.PDATE_CONTENT_TEMPLATE_COMPLETE] (state) {
    return {}
  }
});
