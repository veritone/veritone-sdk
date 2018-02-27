import { get, without, union } from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const CHECK_ALL_ENGINES = 'CHECK_ALL_ENGINES';
export const UNCHECK_ALL_ENGINES = 'UNCHECK_ALL_ENGINES';

export const ADD_ENGINE_ID = 'ADD_ENGINE_ID';
export const REMOVE_ENGINE_ID = 'REMOVE_ENGINE_ID';

export const CHECK_ENGINE_ID = 'CHECK_ENGINE_ID';
export const UNCHECK_ENGINE_ID = 'UNCHECK_ENGINE_ID'

export const namespace = 'engineSelection';

const defaultState = {
  selectedEngineIds: [],
  checkedEngineIds: [],
  allEnginesChecked: false
};

export default createReducer(defaultState, {
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
  [ADD_ENGINE_ID](state, action) {
    console.log('ADD ENGINE', action);
    return {
      ...state,
      selectedEngineIds: union(
        state.selectedEngineIds,
        [action.payload.engineId]
      ),
    }
  },
  [REMOVE_ENGINE_ID](state, action) {
    console.log('REMOVE ENGINE', action);
    return {
      ...state,
      selectedEngineIds: without(
        state.selectedEngineIds,
        action.payload.engineId
      )
    }
  },
  [CHECK_ENGINE_ID](state, action) {
    console.log('CHECK ENGINE', action);
    return {
      ...state,
      checkedEngineIds: union(
        state.checkedEngineIds,
        [action.payload.engineId]
      ),
    }
  },
  [UNCHECK_ENGINE_ID](state, action) {
    console.log('UNCHECK ENGINE', action);
    return {
      ...state,
      checkedEngineIds: without(
        state.checkedEngineIds,
        action.payload.engineId
      )
    }
  }
})

function local(state) {
  return state[namespace];
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

export function addEngineId(engineId) {
  console.log('addEngine()', engineId)
  return {
    type: ADD_ENGINE_ID,
    payload: {
      engineId
    }
  };
}

export function removeEngineId(engineId) {
  return {
    type: REMOVE_ENGINE_ID,
    payload: {
      engineId
    }
  };
}

export function checkEngineId(engineId) {
  console.log('addEngine()', engineId)
  return {
    type: CHECK_ENGINE_ID,
    payload: {
      engineId
    }
  };
}

export function uncheckEngineId(engineId) {
  return {
    type: UNCHECK_ENGINE_ID,
    payload: {
      engineId
    }
  };
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
