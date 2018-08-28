import {
  get,
  set,
  omit,
  without,
  union,
  merge,
  difference,
  isNumber,
  isEmpty,
  intersection
} from 'lodash';
import { helpers, modules } from 'veritone-redux-common';
const { createReducer } = helpers;
const { engine: engineModule } = modules;

export const INITIALIZE_WIDGET = 'vtn/engineSelection/INITIALIZE_WIDGET';

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

export const SET_ACTIVE_SIDEBAR_PATH =
  'vtn/engineSelection/SET_ACTIVE_SIDEBAR_PATH';

export const SET_DESELECTED_ENGINES =
  'vtn/engineSelection/SET_DESELECTED_ENGINES';
export const SET_ALL_ENGINES_SELECTED =
  'vtn/engineSelection/SET_ALL_ENGINES_SELECTED';

export const namespace = 'engineSelection';

const defaultFilterState = {
  category: [],
  rating: []
};

const defaultSelectionState = {
  tabState: {
    own: {
      searchQuery: '',
      isSearchOpen: false,
      filters: defaultFilterState
    },
    explore: {
      searchQuery: '',
      isSearchOpen: false,
      filters: defaultFilterState
    }
  },
  orderBy: {},
  selectedEngineIds: [],
  checkedEngineIds: [],
  allEnginesChecked: false,
  currentTab: 'own',
  activeSidebarPath: [],
  deselectedEngineIds: [],
  allEnginesSelected: false
};
const defaultState = {
  // populated like:
  // [pickerId]: { ...defaultPickerState }
};

export default createReducer(defaultState, {
  [INITIALIZE_WIDGET](state, action) {
    return {
      ...defaultState,
      searchResults: state.searchResults || {},
      [action.meta.id]: {
        ...defaultSelectionState
      }
    };
  },
  [engineModule.FETCH_ENGINES_SUCCESS](state, action) {
    const id = action.meta.id;
    const resultsPath = pathFor(action.meta.searchQuery, action.meta.filters);
    const normalizedResults = action.payload.results.map(engine => engine.id);
    const newResults = set({}, resultsPath, normalizedResults);

    /*
    * Check if engines in deselectedEngineIds
    * if so then ignore
    * otherwise add to selected
    */
    const selectedEngineIds = state[id].allEnginesSelected
      ? difference(normalizedResults, state[id].deselectedEngineIds)
      : [];

    return {
      ...state,
      searchResults: merge({}, state.searchResults, newResults),
      [id]: {
        ...state[id],
        selectedEngineIds: [
          ...new Set([...state[id].selectedEngineIds, ...selectedEngineIds])
        ]
      }
    };
  },
  [CHECK_ALL_ENGINES](state, action) {
    const id = action.meta.id;
    const engineIds = action.payload.engines;

    return {
      ...state,
      [id]: {
        ...state[id],
        checkedEngineIds: engineIds,
        allEnginesChecked: true
      }
    };
  },
  [UNCHECK_ALL_ENGINES](state, action) {
    const id = action.meta.id;
    return {
      ...state,
      [id]: {
        ...state[id],
        checkedEngineIds: [],
        allEnginesChecked: false
      }
    };
  },
  [SELECT_ENGINE](state, action) {
    const id = action.meta.id;
    return {
      ...state,
      [id]: {
        ...state[id],
        selectedEngineIds: union(
          state[id].selectedEngineIds,
          action.payload.engineIds
        ),
        deselectedEngineIds: without(
          state[id].deselectedEngineIds,
          ...action.payload.engineIds
        ),
        checkedEngineIds: [],
        allEnginesChecked: false
      }
    };
  },
  [DESELECT_ENGINE](state, action) {
    const id = action.meta.id;
    return {
      ...state,
      [id]: {
        ...state[id],
        selectedEngineIds: without(
          state[id].selectedEngineIds,
          ...action.payload.engineIds
        ),
        deselectedEngineIds: union(
          state[id].deselectedEngineIds,
          action.payload.engineIds
        ),
        checkedEngineIds: [],
        allEnginesChecked: false
      }
    };
  },
  [CHECK_ENGINE](state, action) {
    const id = action.meta.id;
    return {
      ...state,
      [id]: {
        ...state[id],
        checkedEngineIds: union(state[id].checkedEngineIds, [
          action.payload.engineId
        ])
      }
    };
  },
  [UNCHECK_ENGINE](state, action) {
    const id = action.meta.id;
    return {
      ...state,
      [id]: {
        ...state[id],
        checkedEngineIds: without(
          state[id].checkedEngineIds,
          action.payload.engineId
        ),
        allEnginesChecked: false
      }
    };
  },
  [ADD_FILTER](state, action) {
    const id = action.meta.id;
    const currentTab = state[id].currentTab;
    return {
      ...state,
      [id]: {
        ...state[id],
        tabState: {
          ...state[id].tabState,
          [currentTab]: {
            ...state[id].tabState[currentTab],
            filters: {
              ...state[id].tabState[currentTab].filters,
              [action.payload.type]: action.payload.value
            }
          }
        },
        checkedEngineIds: [],
        allEnginesChecked: false
      }
    };
  },
  [REMOVE_FILTER](state, action) {
    const id = action.meta.id;
    const currentTab = state[id].currentTab;
    return {
      ...state,
      [id]: {
        ...state[id],
        tabState: {
          ...state[id].tabState,
          [currentTab]: {
            ...state[id].tabState[currentTab],
            filters: omit(
              state[id].tabState[currentTab].filters,
              action.payload.type
            )
          }
        },
        checkedEngineIds: [],
        allEnginesChecked: false
      }
    };
  },
  [CLEAR_ALL_FILTERS](state, action) {
    const id = action.meta.id;
    const currentTab = state[id].currentTab;
    return {
      ...state,
      [id]: {
        ...state[id],
        tabState: {
          ...state[id].tabState,
          [currentTab]: {
            ...state[id].tabState[currentTab],
            filters: defaultFilterState
          }
        },
        checkedEngineIds: [],
        allEnginesChecked: false
      }
    };
  },
  [SET_ACTIVE_SIDEBAR_PATH](state, action) {
    const id = action.meta.id;
    return {
      ...state,
      [id]: {
        ...state[id],
        activeSidebarPath: [...action.payload.path]
      }
    };
  },
  [SEARCH](state, action) {
    const id = action.meta.id;
    const currentTab = state[id].currentTab;
    return {
      ...state,
      [id]: {
        ...state[id],
        tabState: {
          ...state[id].tabState,
          [currentTab]: {
            ...state[id].tabState[currentTab],
            searchQuery: action.payload.searchQuery
          }
        },
        checkedEngineIds: [],
        allEnginesChecked: false
      }
    };
  },
  [CLEAR_SEARCH](state, action) {
    const id = action.meta.id;
    const currentTab = state[id].currentTab;
    return {
      ...state,
      [id]: {
        ...state[id],
        tabState: {
          ...state[id].tabState,
          [currentTab]: {
            ...state[id].tabState[currentTab],
            searchQuery: '',
            isSearchOpen: false
          }
        },
        checkedEngineIds: [],
        allEnginesChecked: false
      }
    };
  },
  [CHANGE_TAB](state, action) {
    const id = action.meta.id;
    return {
      ...state,
      [id]: {
        ...state[id],
        currentTab: action.payload.tab,
        activeSidebarPath: []
      }
    };
  },
  [TOGGLE_SEARCH](state, action) {
    const id = action.meta.id;
    const currentTab = state[id].currentTab;
    return {
      ...state,
      [id]: {
        ...state[id],
        tabState: {
          ...state[id].tabState,
          [currentTab]: {
            ...state[id].tabState[currentTab],
            isSearchOpen: !state[id].tabState[currentTab].isSearchOpen,
            searchQuery: ''
          }
        }
      }
    };
  },
  [SET_DESELECTED_ENGINES](state, action) {
    const id = action.meta.id;
    return {
      ...state,
      [id]: {
        ...state[id],
        deselectedEngineIds: action.payload.deselectedEngineIds
      }
    };
  },
  [SET_ALL_ENGINES_SELECTED](state, action) {
    const id = action.meta.id;
    return {
      ...state,
      [id]: {
        ...state[id],
        allEnginesSelected: action.payload.allEnginesSelected
      }
    };
  }
});

function local(state) {
  return state[namespace];
}

export function initializeWidget(id) {
  return {
    type: INITIALIZE_WIDGET,
    meta: { id }
  };
}

export function refetchEngines(id) {
  return function action(dispatch, getState) {
    const searchQuery = getSearchQuery(getState(), id);
    const filters = getEngineFilters(getState(), id);
    dispatch(
      engineModule.fetchEngines(
        { offset: 0, limit: 1000, owned: false },
        searchQuery,
        filters,
        {
          status: ['deployed']
        },
        id
      )
    );
  };
}

export function searchEngines(id, { name }) {
  return {
    type: SEARCH,
    payload: {
      searchQuery: name
    },
    meta: { id }
  };
}

export function addEngineFilter(id, { type, value }) {
  return {
    type: ADD_FILTER,
    payload: {
      type,
      value
    },
    meta: { id }
  };
}

export function removeEngineFilter(id, { type, value }) {
  return {
    type: REMOVE_FILTER,
    payload: {
      type,
      value
    },
    meta: { id }
  };
}

export function checkAllEngines(id, engines) {
  return {
    type: CHECK_ALL_ENGINES,
    payload: {
      engines
    },
    meta: { id }
  };
}

export function uncheckAllEngines(id) {
  return {
    type: UNCHECK_ALL_ENGINES,
    payload: {},
    meta: { id }
  };
}

export function selectEngines(id, engineIds) {
  return {
    type: SELECT_ENGINE,
    payload: {
      engineIds
    },
    meta: { id }
  };
}

export function deselectEngines(id, engineIds) {
  return {
    type: DESELECT_ENGINE,
    payload: {
      engineIds
    },
    meta: { id }
  };
}

export function checkEngine(id, engineId) {
  return {
    type: CHECK_ENGINE,
    payload: {
      engineId
    },
    meta: { id }
  };
}

export function uncheckEngine(id, engineId) {
  return {
    type: UNCHECK_ENGINE,
    payload: {
      engineId
    },
    meta: { id }
  };
}

export function clearSearch(id) {
  return {
    type: CLEAR_SEARCH,
    payload: {},
    meta: { id }
  };
}

export function clearAllFilters(id) {
  return {
    type: CLEAR_ALL_FILTERS,
    payload: {},
    meta: { id }
  };
}

export function changeTab(id, tab) {
  return {
    type: CHANGE_TAB,
    payload: {
      tab
    },
    meta: { id }
  };
}

export function toggleSearch(id) {
  return {
    type: TOGGLE_SEARCH,
    payload: {},
    meta: { id }
  };
}

export function setDeselectedEngineIds(id, deselectedEngineIds) {
  return {
    type: SET_DESELECTED_ENGINES,
    payload: {
      deselectedEngineIds
    },
    meta: { id }
  };
}

export function setAllEnginesSelected(id, allEnginesSelected) {
  return {
    type: SET_ALL_ENGINES_SELECTED,
    payload: {
      allEnginesSelected
    },
    meta: { id }
  };
}

export function setActiveSidebarPath(id, path) {
  return {
    type: SET_ACTIVE_SIDEBAR_PATH,
    payload: {
      path
    },
    meta: { id }
  };
}

export function pathFor(searchQuery, filters) {
  return [searchQuery, JSON.stringify(filters)];
}

export function getCurrentTab(state, id) {
  return get(local(state), [id, 'currentTab']);
}

export function isSearchOpen(state, id) {
  return get(local(state), [
    id,
    'tabState',
    getCurrentTab(state, id),
    'isSearchOpen'
  ]);
}

export function getCurrentResults(state, id) {
  const results = get(
    get(local(state), 'searchResults'),
    pathFor(
      get(local(state), [
        id,
        'tabState',
        getCurrentTab(state, id),
        'searchQuery'
      ]),
      get(local(state), [id, 'tabState', getCurrentTab(state, id), 'filters'])
    )
  );
  return results;
}

export function getSearchQuery(state, id) {
  return get(local(state), [
    id,
    'tabState',
    getCurrentTab(state, id),
    'searchQuery'
  ]);
}

export function getEngineFilters(state, id) {
  return get(local(state), [
    id,
    'tabState',
    getCurrentTab(state, id),
    'filters'
  ]);
}

export function engineIsSelected(state, engineId, id) {
  return get(local(state), [id, 'selectedEngineIds']).includes(engineId);
}

export function engineIsChecked(state, engineId, id) {
  return get(local(state), [id, 'checkedEngineIds']).includes(engineId);
}

export function allEnginesChecked(state, id) {
  return get(local(state), [id, 'allEnginesChecked']);
}

export function getSelectedEngineIds(state, id) {
  return get(local(state), [id, 'selectedEngineIds']);
}

export function getDeselectedEngineIds(state, id) {
  return get(local(state), [id, 'deselectedEngineIds']);
}

export function getCheckedEngineIds(state, id) {
  return get(local(state), [id, 'checkedEngineIds']);
}

export function getActiveSidebarPath(state, id) {
  return get(local(state), [id, 'activeSidebarPath']);
}

export function getFilteredSelectedEngineids(state, id) {
  const selectedEngineIds = getSelectedEngineIds(state, id);
  const currentResults = getCurrentResults(state, id);

  return intersection(selectedEngineIds, currentResults);
}

export function hasActiveFilters(state, id) {
  const filters = getEngineFilters(state, id);
  const searchQuery = getSearchQuery(state, id);

  return (
    Object.values(filters).some(val => isNumber(val) || !isEmpty(val)) ||
    !!searchQuery
  );
}
