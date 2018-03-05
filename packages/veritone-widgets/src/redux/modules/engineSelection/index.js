import { get, set, omit, without, union } from 'lodash';
import { helpers, modules } from 'veritone-redux-common';
const { createReducer } = helpers;
const { engine: engineModule } = modules;

export const CHECK_ALL_ENGINES = 'vtn/engineSelection/CHECK_ALL_ENGINES';
export const UNCHECK_ALL_ENGINES = 'vtn/engineSelection/UNCHECK_ALL_ENGINES';

export const ADD_ENGINE = 'vtn/engineSelection/ADD_ENGINE';
export const REMOVE_ENGINE = 'vtn/engineSelection/REMOVE_ENGINE';

export const CHECK_ENGINE = 'vtn/engineSelection/CHECK_ENGINE';
export const UNCHECK_ENGINE = 'vtn/engineSelection/UNCHECK_ENGINE'

export const ADD_FILTER = 'vtn/engineSelection/ADD_FILTER';
export const REMOVE_FILTER = 'vtn/engineSelection/REMOVE_FILTER';

export const SEARCH = 'vtn/engineSelection/SEARCH';
export const CLEAR_SEARCH = 'vtn/engineSelection/CLEAR_SEARCH';


export const namespace = 'engineSelection';

const defaultState = {
  searchResults: {},
  filters: {
    name: ''
  },
  orderBy: {},
  selectedEngineIds: [],
  checkedEngineIds: [],
  allEnginesChecked: false
};

export default createReducer(defaultState, {
  [engineModule.FETCH_ENGINES_SUCCESS](state, action) {
    console.log('FETCH_ENGINES_SUCCESS >>>>>>>>>>>>', state)
    const resultsPath = pathFor(action.meta.filters);
    const normalizedResults = action.payload.results.map(engine => engine.id);
    const newResults = set({}, resultsPath, normalizedResults);

    return {
      ...state,
      searchResults: Object.assign({}, state.searchResults, newResults)
    };
  },
  [CHECK_ALL_ENGINES](state, action) {
    return {
      ...state,
      checkedEngineIds: Object.keys(action.payload.engines),
      allEnginesChecked: true
    }
  },
  [UNCHECK_ALL_ENGINES](state, action) {
    return {
      ...state,
      checkedEngineIds: [],
      allEnginesChecked: false
    }
  },
  [ADD_ENGINE](state, action) {
    return {
      ...state,
      selectedEngineIds: union(
        state.selectedEngineIds,
        [action.payload.engineId]
      ),
    }
  },
  [REMOVE_ENGINE](state, action) {
    return {
      ...state,
      selectedEngineIds: without(
        state.selectedEngineIds,
        action.payload.engineId
      )
    }
  },
  [CHECK_ENGINE](state, action) {
    return {
      ...state,
      checkedEngineIds: union(
        state.checkedEngineIds,
        [action.payload.engineId]
      ),
    }
  },
  [UNCHECK_ENGINE](state, action) {
    return {
      ...state,
      checkedEngineIds: without(
        state.checkedEngineIds,
        action.payload.engineId
      )
    }
  },
  [ADD_FILTER](state, action) {
    return {
      ...state,
      filters: {
        ...state.filters,
        [action.payload.type]: action.payload.value
      }
    }
  },
  [REMOVE_FILTER](state, action) {
    return {
      ...state,
      filters: omit(state.filters, action.payload.type)
    }
  },
  [SEARCH](state, action) {
    return {
      ...state,
      filters: {
        ...state.filters,
        name: action.payload.searchQuery
      }
    }
  },
  [CLEAR_SEARCH](state, action) {
    return {
      ...state,
      filters: {
        ...state.filters,
        name: ''
      }
    }
  }
})

function local(state) {
  return state[namespace];
}

export function refetchEngines() {
  return function action(dispatch, getState) {
    const filters = getEngineFilters(getState());
    dispatch(engineModule.fetchEngines(filters));
  }
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

export function addEngine(engineId) {
  return {
    type: ADD_ENGINE,
    payload: {
      engineId
    }
  };
}

export function removeEngine(engineId) {
  return {
    type: REMOVE_ENGINE,
    payload: {
      engineId
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


export function pathFor(filters) {
  console.log('pathFor......', filters)

  return [filters.name, JSON.stringify(omit(filters, 'name', 'order'))];
}

export function getCurrentResults(state) {
  console.log('getCurrentResults....', get(local(state).searchResults, pathFor(local(state).filters)))
  return get(local(state).searchResults, pathFor(local(state).filters));
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

export const widgets = state => local(state).widgets;
