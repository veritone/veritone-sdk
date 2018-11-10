import { get } from 'lodash';

import * as Actions from './actionCreator';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const Status = {
  LOADING: 'Loading',
  LOADED: 'Loaded',
  CREATING: 'Creating',
  CREATED: 'Created',
  ADDING: 'Adding',
  ADDED: 'Added',
  ERROR: 'Error',
  INITIAL: 'Initial'
};

const initialState = {
  libraries: [],
  libraryTypes: [],
  alertMessage: '',
  tdoStatus: Status.INITIAL,
  libraryStatus: Status.INITIAL,
  libraryTypeStatus: Status.INITIAL,
};

export { namespace } from './actionCreator';
export default createReducer(initialState, {
  //-------Libary Type Actions-------
  [Actions.LOAD_LIBRARY_TYPES] (state) {
    return {...state, libraryTypeStatus : Status.LOADING, alertMessage: ''};
  },
  [Actions.LOAD_LIBRARY_TYPES_FAILURE] (state, action) {
    return {...state, libraryTypeStatus: Status.ERROR, alertMessage: 'Fail to load library types'};
  },
  [Actions.LOAD_LIBRARY_TYPES_COMPLETE] (state, action) {
    const records = get(action, 'payload.libraryTypes.records');
    if (records) {
      const libraryTypes = records.map((value) => {
        return {...value, name: value.label};
      });
      return {...state, libraryTypes: libraryTypes, libraryTypeStatus: Status.LOADED, alertMessage: ''};
    } else {
      return {...state, libraryTypeStatus: Status.ERROR, alertMessage: 'Fail to load library types'};
    }
  },
  //-------Libary Actions-------
  [Actions.RESET_LIBRARIES] (state) {
    return { ...state, libraryStatus: Status.INITIAL };
  },
  [Actions.LOAD_LIBRARIES] (state) {
    return { ...state, libraryStatus: Status.LOADING, alertMessage: '' };
  },
  [Actions.LOAD_LIBRARIES_FAILURE] (state) {
    return { ...state, libraryStatus: Status.ERROR, alertMessage: 'Fail to load libraries' };
  },
  [Actions.LOAD_LIBRARIES_COMPLETE] (state, action) {
    const libraries = get(action, 'payload.libraries.records');
    if (libraries) {
      return {...state, libraries: libraries, libraryStatus: Status.LOADED, alertMessage: ''};
    } else {
      return {...state, libraryStatus: Status.ERROR, alertMessage: 'Fail to load libraries'};
    }
  },
  [Actions.CREATE_LIBRARY] (state) {
    return { ...state, libraryStatus: Status.CREATING, alertMessage: '' };
  },
  [Actions.CREATE_LIBRARY_FAILURE] (state, action) {
    const errorMessage = action.payload || 'Fail to create library';
    return { ...state, libraryStatus: Status.ERROR, alertMessage: errorMessage };
  },
  [Actions.CREATE_LIBRARY_COMPLETE] (state, action) {
    const newLibrary = get(action, 'payload.createLibrary');
    if (newLibrary) {
      const currentLibraries = get(state, 'libraries', []);
      currentLibraries.unshift(newLibrary);
      return {...state, libraries: currentLibraries, libraryStatus: Status.CREATED, alertMessage: ''};
    } else {
      return { ...state, libraryStatus: Status.ERROR, alertMessage: 'Fail to create library' };
    }
  },
  [Actions.GET_UPLOAD_URL] (state) {
    return { ...state, libraryStatus: Status.CREATING, alertMessage: '' };
  },
  [Actions.GET_UPLOAD_URL_FAILURE] (state, action) {
    const errorMessage = action.payload || 'Fail to retreive upload URL';
    return { ...state, libraryStatus: Status.ERROR, alertMessage: errorMessage };
  },
  //-------TDO Actions-------
  [Actions.RESET_TDOS] (state) {
    return { ...state, tdoStatus: Status.INITIAL };
  },
  [Actions.ADD_TDOS] (state) {
    return {...state, tdoStatus: Status.ADDING, alertMessage: ''};
  },
  [Actions.ADD_TDOS_FAILURE] (state) {
    return {...state, tdoStatus: Status.ERROR, alertMessage: 'Fail to add TDOs to Library'};
  },
  [Actions.ADD_TDOS_COMPLETE] (state, action) {
    const { payload } = action;
    if (payload) {
      return {...state, tdoStatus: Status.ADDED, alertMessage: ''};
    }
  }
});