import { helpers } from 'veritone-redux-common';
const { createReducer, callGraphQL } = helpers;

import { get } from 'lodash';
export const namespace = 'savedsearch';

export const SAVE_SEARCH_PROFILE = 'vtn/savedSearch/SAVE_SEARCH_PROFILE';
export const SAVE_SEARCH_PROFILE_SUCCESS =
  'vtn/savedSearch/SAVE_SEARCH_PROFILE_SUCCESS';
export const SAVE_SEARCH_PROFILE_FAILURE =
  'vtn/savedSearch/SAVE_SEARCH_PROFILE_FAILURE';

export const REPLACE_SEARCH_PROFILE = 'vtn/savedSearch/REPLACE_SEARCH_PROFILE';
export const REPLACE_SEARCH_PROFILE_SUCCESS =
  'vtn/savedSearch/REPLACE_SEARCH_PROFILE_SUCCESS';
export const REPLACE_SEARCH_PROFILE_FAILURE =
  'vtn/savedSearch/REPLACE_SEARCH_PROFILE_FAILURE';

export const GET_SEARCH_PROFILES = 'vtn/savedSearch/GET_SEARCH_PROFILES';
export const GET_SEARCH_PROFILES_SUCCESS =
  'vtn/savedSearch/GET_SEARCH_PROFILES_SUCCESS';
export const GET_SEARCH_PROFILES_FAILURE =
  'vtn/savedSearch/GET_SEARCH_PROFILES_FAILURE';

export const GET_SEARCH_PROFILES_COUNT =
  'vtn/savedSearch/GET_SEARCH_PROFILES_COUNT';
export const GET_SEARCH_PROFILES_COUNT_SUCCESS =
  'vtn/savedSearch/GET_SEARCH_PROFILES_COUNT_SUCCESS';
export const GET_SEARCH_PROFILES_COUNT_FAILURE =
  'vtn/savedSearch/GET_SEARCH_PROFILES_COUNT_FAILURE';

const defaultState = {
  isSaving: false,
  isDuplicate: false,
  savingFailed: false,
  duplicateProfileName: '',
  duplicateProfileId: '',
  mySearchProfiles: [],
  loadedMySearchProfiles: new Set(),
  mySearchProfilesCount: null,
  loadingMySearchProfiles: false,
  loadingMySearchProfilesFailed: false,
  mySearchProfilesFilterByName: null,
  mySearchProfilesSortBy: 'createdDate',
  mySearchProfilesSortDirection: 'desc',

  orgSearchProfiles: [],
  loadedOrgSearchProfiles: new Set(),
  orgSearchProfilesCount: null,
  loadingOrgSearchProfiles: false,
  loadingOrgSearchProfilesFailed: false,
  orgSearchProfilesFilterByName: null,
  orgSearchProfilesSortBy: 'createdDate',
  orgSearchProfilesSortDirection: 'desc'
};

const resetMySearchProfiles = state => ({
  ...state,
  mySearchProfilesCount: null,
  loadingMySearchProfiles: true,
  loadingMySearchProfilesFailed: false,
  mySearchProfiles: [],
  loadedMySearchProfiles: new Set(),
  mySearchProfilesFilterByName: null,
  mySearchProfilesSortBy: 'createdDate',
  mySearchProfilesSortDirection: 'desc'
});

const resetOrgSearchProfiles = state => ({
  ...state,
  orgSearchProfiles: [],
  loadedOrgSearchProfiles: new Set(),
  orgSearchProfilesCount: null,
  loadingOrgSearchProfiles: false,
  loadingOrgSearchProfilesFailed: false,
  orgSearchProfilesFilterByName: null,
  orgSearchProfilesSortBy: 'createdDate',
  orgSearchProfilesSortDirection: 'desc'
});

const reducer = createReducer(defaultState, {
  [SAVE_SEARCH_PROFILE](state, action) {
    return {
      ...state,
      isSaving: true,
      isDuplicate: false,
      duplicateProfileName: undefined,
      duplicateProfileId: undefined,
      savingFailed: false
    };
  },
  [SAVE_SEARCH_PROFILE_SUCCESS](state, action) {
    return {
      ...state,
      isSaving: false,
      isDuplicate: false,
      savingFailed: false
    };
  },
  [SAVE_SEARCH_PROFILE_FAILURE](state, action) {
    const isDuplicate = action.payload[0].data.validationErrors[0].message.includes(
      'saved search with this name already exists'
    );
    return {
      ...state,
      isSaving: false,
      isDuplicate: isDuplicate,
      duplicateProfileName: isDuplicate && action.meta.variables.input.name,
      duplicateProfileId: action.payload[0].data.createSavedSearch.id,
      savingFailed: true
    };
  },
  [REPLACE_SEARCH_PROFILE](state, action) {
    return {
      ...state,
      isSaving: true,
      isDuplicate: false,
      savingFailed: false
    };
  },
  [REPLACE_SEARCH_PROFILE_SUCCESS](state, action) {
    return {
      ...state,
      isSaving: false,
      isDuplicate: false,
      savingFailed: false
    };
  },
  [REPLACE_SEARCH_PROFILE_FAILURE](state, action) {
    return {
      ...state,
      isSaving: false,
      isDuplicate: false,
      savingFailed: true
    };
  },
  [GET_SEARCH_PROFILES](state, action) {
    if (!action.meta.variables.shared) {
      // if the search, or sort changed, reset the search profiles
      if (
        state.mySearchProfilesFilterByName !==
        action.meta.variables.searchByProfileName
      ) {
        return resetMySearchProfiles(state);
      } else if (
        state.mySearchProfilesSortBy !== action.meta.variables.sortBy
      ) {
        return resetMySearchProfiles(state);
      } else if (
        state.mySearchProfilesSortDirection !==
        action.meta.variables.sortDirection
      ) {
        return resetMySearchProfiles(state);
      } else {
        return {
          ...state,
          mySearchProfilesCount: 0,
          loadingMySearchProfiles: true,
          loadingMySearchProfilesFailed: false
        };
      }
    } else {
      // if the search, or sort changed, reset the search profiles
      if (
        state.orgSearchProfilesFilterByName !==
        action.meta.variables.searchByProfileName
      ) {
        return resetOrgSearchProfiles(state);
      } else if (
        state.orgSearchProfilesSortBy !== action.meta.variables.sortBy
      ) {
        return resetOrgSearchProfiles(state);
      } else if (
        state.orgSearchProfilesSortDirection !==
        action.meta.variables.sortDirection
      ) {
        return resetOrgSearchProfiles(state);
      } else {
        return {
          ...state,
          orgSearchProfilesCount: 0,
          loadingOrgSearchProfiles: true,
          loadingOrgSearchProfilesFailed: false
        };
      }
    }
  },
  [GET_SEARCH_PROFILES_SUCCESS](state, action) {
    if (!action.meta.variables.shared) {
      const mySearchProfiles = state.mySearchProfiles;
      const loadedMySearchProfiles = state.loadedMySearchProfiles;
      get(action.payload, 'savedSearches.records').map(record => {
        if (!loadedMySearchProfiles.has(record.id)) {
          loadedMySearchProfiles.add(record.id);
          mySearchProfiles.push(record);
        }
      });
      return {
        ...state,
        mySearchProfilesCount: get(action.payload, 'totalRecords.count'),
        loadingMySearchProfiles: false,
        loadingMySearchProfilesFailed: false,
        loadedMySearchProfiles,
        mySearchProfilesFilterByName: action.meta.variables.searchByProfileName,
        mySearchProfilesSortBy: action.meta.variables.sortBy,
        mySearchProfilesSortDirection: action.meta.variables.sortDirection,
        mySearchProfiles
      };
    } else {
      const orgSearchProfiles = state.orgSearchProfiles;
      const loadedOrgSearchProfiles = state.loadedOrgSearchProfiles;
      get(action.payload, 'savedSearches.records').map(record => {
        if (!loadedOrgSearchProfiles.has(record.id)) {
          loadedOrgSearchProfiles.add(record.id);
          orgSearchProfiles.push(record);
        }
      });
      return {
        ...state,
        orgSearchProfilesCount: get(action.payload, 'totalRecords.count'),
        loadingOrgSearchProfiles: false,
        loadingOrgSearchProfilesFailed: false,
        loadedOrgSearchProfiles,
        orgSearchProfilesFilterByName:
          action.meta.variables.searchByProfileName,
        orgSearchProfilesSortBy: action.meta.variables.sortBy,
        orgSearchProfilesSortDirection: action.meta.variables.sortDirection,
        orgSearchProfiles
      };
    }
  },
  [GET_SEARCH_PROFILES_FAILURE](state, action) {
    // need to blow away results when a paginated search fails, because react-virtualized memoizes which rows it has tried to load
    if (!action.meta.variables.shared) {
      return resetMySearchProfiles(state);
    } else {
      return resetOrgSearchProfiles(state);
    }
  },
  [GET_SEARCH_PROFILES_COUNT](state, action) {
    if (!action.meta.variables.shared) {
      return {
        ...state,
        mySearchProfilesCount: 0
      };
    } else {
      return {
        ...state,
        orgSearchProfilesCount: 0
      };
    }
  },
  [GET_SEARCH_PROFILES_COUNT_SUCCESS](state, action) {
    if (!action.meta.variables.shared) {
      return {
        ...state,
        mySearchProfilesCount: get(action.payload, 'savedSearches.count')
      };
    } else {
      return {
        ...state,
        orgSearchProfilesCount: get(action.payload, 'savedSearches.count')
      };
    }
  },
  [GET_SEARCH_PROFILES_COUNT_FAILURE](state, action) {
    if (!action.meta.variables.shared) {
      return {
        ...state,
        mySearchProfilesCount: 0
      };
    } else {
      return {
        ...state,
        orgSearchProfilesCount: 0
      };
    }
  }
});

export default reducer;

function local(state) {
  return state[namespace];
}

export const isDuplicate = state => {
  return local(state).isDuplicate;
};

export const duplicateProfileName = state => {
  return local(state).duplicateProfileName;
};

export const duplicateProfileId = state => {
  return local(state).duplicateProfileId;
};

// my search profiles
export const mySearchProfiles = state => {
  return local(state).mySearchProfiles;
};

export const loadingMySearchProfiles = state => {
  return local(state).loadingMySearchProfiles;
};

export const loadedMySearchProfiles = state => {
  return local(state).loadedMySearchProfiles;
};

export const mySearchProfilesCount = state => {
  return local(state).mySearchProfilesCount;
};

export const mySearchProfilesSortBy = state => {
  return local(state).mySearchProfilesSortBy;
};

export const mySearchProfilesSortDirection = state => {
  return local(state).mySearchProfilesSortDirection;
};

export const mySearchProfilesFilterByName = state => {
  return local(state).mySearchProfilesFilterByName;
};
// org search profiles
export const orgSearchProfiles = state => {
  return local(state).orgSearchProfiles;
};

export const loadingOrgSearchProfiles = state => {
  return local(state).loadingOrgSearchProfiles;
};

export const loadedOrgSearchProfiles = state => {
  return local(state).loadedOrgSearchProfiles;
};

export const orgSearchProfilesCount = state => {
  return local(state).orgSearchProfilesCount;
};

export const orgSearchProfilesSortBy = state => {
  return local(state).orgSearchProfilesSortBy;
};

export const orgSearchProfilesSortDirection = state => {
  return local(state).orgSearchProfilesSortDirection;
};

export const orgSearchProfilesFilterByName = state => {
  return local(state).orgSearchProfilesFilterByName;
};

export const getSearchProfilesCount = ({
  sortBy = 'createdDateTime',
  sortDirection = 'desc',
  searchByProfileName = '',
  shared = false
} = {}) => async (dispatch, getState) => {
  const query = `
    query($shared: Boolean, $searchByProfileName: String) {
      savedSearches(includeShared: $shared, filterByName: $searchByProfileName) {
        count
      }
    }`;

  const response = await callGraphQL({
    actionTypes: [
      GET_SEARCH_PROFILES_COUNT,
      GET_SEARCH_PROFILES_COUNT_SUCCESS,
      GET_SEARCH_PROFILES_COUNT_FAILURE
    ],
    query,
    variables: {
      shared,
      searchByProfileName
    },
    dispatch,
    getState
  });

  return response;
};

export const loadSearchProfiles = ({
  sortBy = 'createdDateTime',
  sortDirection = 'desc',
  searchByProfileName = '',
  limit = 20,
  offset = 0,
  shared = false
} = {}) => async (dispatch, getState) => {
  const query = `
  query($shared: Boolean, $sortBy: SavedSearchOrderBy, $sortDirection: OrderDirection, $searchByProfileName: String, $limit: Int, $offset: Int ) {
    totalRecords: savedSearches(includeShared: $shared, orderBy: createdDateTime, filterByName: $searchByProfileName, limit: 999, offset: 0) {
      count,
    },
    savedSearches(includeShared: $shared, orderBy: $sortBy, orderDirection: $sortDirection, filterByName: $searchByProfileName, limit: $limit, offset: $offset) {
      count,
      offset,
      records {
        id,
        name,
        csp,
        createdDateTime,
        sharedWithOrganization,
        owner {
          name,
          id
        }
      }
    }
  }`;

  const response = await callGraphQL({
    actionTypes: [
      GET_SEARCH_PROFILES,
      GET_SEARCH_PROFILES_SUCCESS,
      GET_SEARCH_PROFILES_FAILURE
    ],
    query,
    variables: {
      shared,
      sortBy,
      searchByProfileName,
      sortDirection,
      limit,
      offset
    },
    dispatch,
    getState
  });

  return response;
};

export const saveSearchProfile = ({
  csp,
  name,
  sharedWithOrganization
}) => async (dispatch, getState) => {
  const query = `
    mutation CreateSavedSearch($input: CreateSavedSearch!) {
      createSavedSearch(input: $input) {
        name,
        csp,
        id
      }
    }
  `;
  const response = await callGraphQL({
    actionTypes: [
      SAVE_SEARCH_PROFILE,
      SAVE_SEARCH_PROFILE_SUCCESS,
      SAVE_SEARCH_PROFILE_FAILURE
    ],
    query,
    variables: {
      input: {
        name,
        csp,
        sharedWithOrganization
      }
    },
    dispatch,
    getState
  });

  return !!response.createSavedSearch;
};

export const replaceSearchProfile = ({
  id,
  csp,
  name,
  sharedWithOrganization
}) => async (dispatch, getState) => {
  const query = `
    mutation ReplaceSavedSearch($input: ReplaceSavedSearch!) {
      replaceSavedSearch(input: $input) {
        id,
        name,
        csp
      }
    }
  `;
  const response = await callGraphQL({
    actionTypes: [
      REPLACE_SEARCH_PROFILE,
      REPLACE_SEARCH_PROFILE_SUCCESS,
      REPLACE_SEARCH_PROFILE_FAILURE
    ],
    query,
    variables: {
      input: {
        id,
        name,
        csp,
        sharedWithOrganization
      }
    },
    dispatch,
    getState
  });

  return !!response.replaceSavedSearch;
};
