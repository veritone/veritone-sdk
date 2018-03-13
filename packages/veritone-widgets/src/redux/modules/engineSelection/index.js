import { get, set, omit, without, union, merge, isArray } from 'lodash';
import { helpers, modules } from 'veritone-redux-common';
const { createReducer } = helpers;
const { engine: engineModule } = modules;

export const CHECK_ALL_ENGINES = 'vtn/engineSelection/CHECK_ALL_ENGINES';
export const UNCHECK_ALL_ENGINES = 'vtn/engineSelection/UNCHECK_ALL_ENGINES';

export const ADD_ENGINES = 'vtn/engineSelection/ADD_ENGINES';
export const REMOVE_ENGINES = 'vtn/engineSelection/REMOVE_ENGINES';

export const CHECK_ENGINE = 'vtn/engineSelection/CHECK_ENGINE';
export const UNCHECK_ENGINE = 'vtn/engineSelection/UNCHECK_ENGINE';

export const ADD_FILTER = 'vtn/engineSelection/ADD_FILTER';
export const REMOVE_FILTER = 'vtn/engineSelection/REMOVE_FILTER';
export const CLEAR_ALL_FILTERS = 'vtn/engineSelection/CLEAR_ALL_FILTERS';

export const SEARCH = 'vtn/engineSelection/SEARCH';
export const CLEAR_SEARCH = 'vtn/engineSelection/CLEAR_SEARCH';

export const CHANGE_TAB = 'vtn/engineSelection/CHANGE_TAB';
export const TOGGLE_SEARCH = 'vtn/engineSelection/TOGGLE_SEARCH';

export const namespace = 'engineSelection';

const defaultState = {
  searchResults: {},
  searchQuery: '',
  filters: {
    category: [],
    rating: []
  },
  orderBy: {},
  selectedEngineIds: [],
  checkedEngineIds: [],
  allEnginesChecked: false,
  currentTabIndex: 0,
  isSearchOpen: false
};

export default createReducer(defaultState, {
  [engineModule.FETCH_ENGINES_SUCCESS](state, action) {
    const resultsPath = pathFor(action.meta.searchQuery, action.meta.filters);
    const normalizedResults = action.payload.results.map(engine => engine.id);
    const newResults = set({}, resultsPath, normalizedResults);

    return {
      ...state,
      searchResults: merge({}, state.searchResults, newResults)
    };
  },
  [CHECK_ALL_ENGINES](state, action) {
    const engineIds = isArray(action.payload.engines)
      ? action.payload.engines
      : Object.keys(action.payload.engines);
    return {
      ...state,
      checkedEngineIds: engineIds,
      allEnginesChecked: true
    };
  },
  [UNCHECK_ALL_ENGINES](state, action) {
    return {
      ...state,
      checkedEngineIds: [],
      allEnginesChecked: false
    };
  },
  [ADD_ENGINES](state, action) {
    return {
      ...state,
      selectedEngineIds: union(
        state.selectedEngineIds,
        action.payload.engineIds
      ),
      checkedEngineIds: [],
      allEnginesChecked: false
    };
  },
  [REMOVE_ENGINES](state, action) {
    return {
      ...state,
      selectedEngineIds: without(
        state.selectedEngineIds,
        ...action.payload.engineIds
      ),
      checkedEngineIds: [],
      allEnginesChecked: false
    };
  },
  [CHECK_ENGINE](state, action) {
    return {
      ...state,
      checkedEngineIds: union(state.checkedEngineIds, [action.payload.engineId])
    };
  },
  [UNCHECK_ENGINE](state, action) {
    return {
      ...state,
      checkedEngineIds: without(
        state.checkedEngineIds,
        action.payload.engineId
      ),
      allEnginesChecked: false
    };
  },
  [ADD_FILTER](state, action) {
    return {
      ...state,
      filters: {
        ...state.filters,
        [action.payload.type]: action.payload.value
      },
      checkedEngineIds: [],
      allEnginesChecked: false
    };
  },
  [REMOVE_FILTER](state, action) {
    return {
      ...state,
      filters: omit(state.filters, action.payload.type),
      checkedEngineIds: [],
      allEnginesChecked: false
    };
  },
  [CLEAR_ALL_FILTERS](state, action) {
    return {
      ...state,
      filters: {
        category: [],
        rating: []
      },
      checkedEngineIds: [],
      allEnginesChecked: false
    };
  },
  [SEARCH](state, action) {
    return {
      ...state,
      searchQuery: action.payload.searchQuery,
      checkedEngineIds: [],
      allEnginesChecked: false
    };
  },
  [CLEAR_SEARCH](state, action) {
    return {
      ...state,
      searchQuery: '',
      checkedEngineIds: [],
      allEnginesChecked: false,
      isSearchOpen: false
    };
  },
  [CHANGE_TAB](state, action) {
    return {
      ...state,
      currentTabIndex: action.payload.tabIndex,
      isSearchOpen: false
    };
  },
  [TOGGLE_SEARCH](state, action) {
    return {
      ...state,
      isSearchOpen: !state.isSearchOpen
    };
  }
});

function local(state) {
  return state[namespace];
}

export function refetchEngines() {
  return function action(dispatch, getState) {
    const searchQuery = getSearchQuery(getState());
    const filters = getEngineFilters(getState());
    dispatch(engineModule.fetchEngines(searchQuery, filters));
  };
}

export function searchEngines({ name }) {
  return {
    type: SEARCH,
    payload: {
      searchQuery: name
    }
  };
}

export function addEngineFilter({ type, value }) {
  return {
    type: ADD_FILTER,
    payload: {
      type,
      value
    }
  };
}

export function removeEngineFilter({ type, value }) {
  return {
    type: REMOVE_FILTER,
    payload: {
      type,
      value
    }
  };
}

export function checkAllEngines(engines) {
  return {
    type: CHECK_ALL_ENGINES,
    payload: {
      engines
    }
  };
}

export function uncheckAllEngines() {
  return {
    type: UNCHECK_ALL_ENGINES,
    payload: {}
  };
}

export function addEngines(engineIds) {
  return {
    type: ADD_ENGINES,
    payload: {
      engineIds
    }
  };
}

export function removeEngines(engineIds) {
  return {
    type: REMOVE_ENGINES,
    payload: {
      engineIds
    }
  };
}

export function checkEngine(engineId) {
  return {
    type: CHECK_ENGINE,
    payload: {
      engineId
    }
  };
}

export function uncheckEngine(engineId) {
  return {
    type: UNCHECK_ENGINE,
    payload: {
      engineId
    }
  };
}

export function clearSearch() {
  return {
    type: CLEAR_SEARCH,
    payload: {}
  };
}

export function clearAllFilters() {
  return {
    type: CLEAR_ALL_FILTERS,
    payload: {}
  };
}

export function changeTab(tabIndex) {
  return {
    type: CHANGE_TAB,
    payload: {
      tabIndex
    }
  };
}

export function toggleSearch() {
  return {
    type: TOGGLE_SEARCH,
    payload: {}
  };
}

export function pathFor(searchQuery, filters, orderBy) {
  return [searchQuery, JSON.stringify(filters)];
}

export function getCurrentTabIndex(state) {
  return local(state).currentTabIndex;
}

export function isSearchOpen(state) {
  return local(state).isSearchOpen;
}

export function getCurrentResults(state) {
  const results = get(
    local(state).searchResults,
    pathFor(local(state).searchQuery, local(state).filters)
  );
  return results;
}

export function getSearchQuery(state) {
  return local(state).searchQuery;
}

export function getEngineFilters(state) {
  return local(state).filters;
}

export function engineIsSelected(state, engineId) {
  return local(state).selectedEngineIds.includes(engineId);
}

export function engineIsChecked(state, engineId) {
  return local(state).checkedEngineIds.includes(engineId);
}

export function allEnginesChecked(state) {
  return local(state).allEnginesChecked;
}

export function getSelectedEngineIds(state) {
  return local(state).selectedEngineIds;
}

export function getCheckedEngineIds(state) {
  return local(state).checkedEngineIds;
}

export const widgets = state => local(state).widgets;
