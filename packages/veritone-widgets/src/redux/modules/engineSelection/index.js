import {
  get,
  set,
  omit,
  without,
  union,
  merge,
  isArray,
  difference
} from 'lodash';
import { helpers, modules } from 'veritone-redux-common';
const { createReducer } = helpers;
const { engine: engineModule } = modules;

export const CHECK_ALL_ENGINES = 'vtn/engineSelection/CHECK_ALL_ENGINES';
export const UNCHECK_ALL_ENGINES = 'vtn/engineSelection/UNCHECK_ALL_ENGINES';

export const SELECT_ENGINE = 'vtn/engineSelection/SELECT_ENGINE';
export const DESELECT_ENGINE = 'vtn/engineSelection/DESELECT_ENGINE';

export const CHECK_ENGINE = 'vtn/engineSelection/CHECK_ENGINE';
export const UNCHECK_ENGINE = 'vtn/engineSelection/UNCHECK_ENGINE';

export const ADD_FILTER = 'vtn/engineSelection/ADD_FILTER';
export const REMOVE_FILTER = 'vtn/engineSelection/REMOVE_FILTER';
export const CLEAR_ALL_FILTERS = 'vtn/engineSelection/CLEAR_ALL_FILTERS';

export const SEARCH = 'vtn/engineSelection/SEARCH';
export const CLEAR_SEARCH = 'vtn/engineSelection/CLEAR_SEARCH';

export const CHANGE_TAB = 'vtn/engineSelection/CHANGE_TAB';
export const TOGGLE_SEARCH = 'vtn/engineSelection/TOGGLE_SEARCH';

export const SET_DESELECTED_ENGINES =
  'vtn/engineSelection/SET_DESELECTED_ENGINES';
export const SET_ALL_ENGINES_SELECTED =
  'vtn/engineSelection/SET_ALL_ENGINES_SELECTED';

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
  isSearchOpen: false,
  deselectedEngineIds: [],
  allEnginesSelected: false
};

export default createReducer(defaultState, {
  [engineModule.FETCH_ENGINES_SUCCESS](state, action) {
    const resultsPath = pathFor(action.meta.searchQuery, action.meta.filters);
    const normalizedResults = action.payload.results.map(engine => engine.id);
    const newResults = set({}, resultsPath, normalizedResults);

    /*
    * Check if engines in deselectedEngineIds
    * if so then ignore
    * otherwise add to selected
    */
    const selectedEngineIds = state.allEnginesSelected
      ? difference(normalizedResults, state.deselectedEngineIds)
      : [];

    return {
      ...state,
      selectedEngineIds: [
        ...new Set([...state.selectedEngineIds, ...selectedEngineIds])
      ],
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
  [SELECT_ENGINE](state, action) {
    return {
      ...state,
      selectedEngineIds: union(
        state.selectedEngineIds,
        action.payload.engineIds
      ),
      deselectedEngineIds: without(
        state.deselectedEngineIds,
        ...action.payload.engineIds
      ),
      checkedEngineIds: [],
      allEnginesChecked: false
    };
  },
  [DESELECT_ENGINE](state, action) {
    return {
      ...state,
      selectedEngineIds: without(
        state.selectedEngineIds,
        ...action.payload.engineIds
      ),
      deselectedEngineIds: union(
        state.deselectedEngineIds,
        action.payload.engineIds
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
      filters: defaultState.filters,
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
  },
  [SET_DESELECTED_ENGINES](state, action) {
    return {
      ...state,
      deselectedEngineIds: action.payload.deselectedEngineIds
    };
  },
  [SET_ALL_ENGINES_SELECTED](state, action) {
    return {
      ...state,
      allEnginesSelected: action.payload.allEnginesSelected
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

export function selectEngines(engineIds) {
  return {
    type: SELECT_ENGINE,
    payload: {
      engineIds
    }
  };
}

export function deselectEngines(engineIds) {
  return {
    type: DESELECT_ENGINE,
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

export function setDeselectedEngineIds(deselectedEngineIds) {
  return {
    type: SET_DESELECTED_ENGINES,
    payload: {
      deselectedEngineIds
    }
  };
}

export function setAllEnginesSelected(allEnginesSelected) {
  return {
    type: SET_ALL_ENGINES_SELECTED,
    payload: {
      allEnginesSelected
    }
  };
}

export function pathFor(searchQuery, filters) {
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

export function getDeselectedEngineIds(state) {
  return local(state).deselectedEngineIds;
}

export function getCheckedEngineIds(state) {
  return local(state).checkedEngineIds;
}
