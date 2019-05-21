import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import get from 'lodash/get';
import { helpers } from 'veritone-redux-common';
const { createReducer, callGraphQLApi } = helpers;

export const namespace = 'multiEngineSelection';

export const FETCH_ENGINES = `vtn/${namespace}/FETCH_ENGINES`;
export const FETCH_ENGINES_SUCCESS = `vtn/${namespace}/FETCH_ENGINES_SUCCESS`;
export const FETCH_ENGINES_FAILURE = `vtn/${namespace}/FETCH_ENGINES_FAILURE`;
export const TOGGLE_ENGINE = `vtn/${namespace}/TOGGLE_ENGINE`;

const defaultState = {};
const PAGE_SIZE = 100;
export const MAX_SELECTIONS = 6;

const getPickerID = action => get(action, 'meta.variables.id');

export const loadingEngines = (state, id) =>
  get(local(state), [id, 'loadingEngines']);
export const loadingEnginesFailed = (state, id) =>
  get(local(state), [id, 'loadingEnginesFailed']);
export const engines = (state, id) => {
  return get(local(state), [id, 'engines']);
};
export const selectedEngines = (state, id, ids) => {
  if (id) {
    return get(local(state), [id, 'selected']);
  } else {
    const pickers = ids || Object.keys(local(state));
    const selected = {};

    pickers.forEach(id => {
      Object.assign(selected, get(local(state), [id, 'selected']));
    });
    return selected;
  }
};
export const canSelectMore = (state, id) => {
  const existingSelections = selectedEngines(state, id);
  return (
    !existingSelections ||
    Object.keys(existingSelections).length < MAX_SELECTIONS
  );
};

export const hasMorePages = (state, id) => {
  return get(local(state), [id, 'lastCount']) >= PAGE_SIZE;
};

export const lastSearch = (state, id) => {
  return get(local(state), [id, 'lastSearch']);
};

const reducer = createReducer(defaultState, {
  [FETCH_ENGINES](state, action) {
    const newSearch = get(action, 'meta.variables.search');
    const lastSearch = get(state, [getPickerID(action), 'lastSearch']);
    const engines =
      newSearch !== lastSearch
        ? []
        : get(state, [getPickerID(action), 'engines']);

    return {
      ...state,
      [getPickerID(action)]: {
        loadingEngines: true,
        loadingEnginesFailed: false,
        engines: engines,
        selected: get(state, [getPickerID(action), 'selected']) || {},
        lastSearch: newSearch
      }
    };
  },
  [TOGGLE_ENGINE](state, action) {
    const id = action.id;
    const rowId = action.rowId;
    const toggleSelection = (state, id, rowId) => {
      const selected = { ...get(state, [id, 'selected']) };
      if (selected.hasOwnProperty(rowId)) {
        delete selected[rowId];
      } else {
        const engines = get(state, [id, 'engines']);
        selected[rowId] = engines.find(engine => engine.id === rowId);
      }
      return selected;
    };

    // only toggle one picker
    if (id) {
      let nextState = { ...state };
      const selected = toggleSelection(state, id, rowId);
      nextState[id].selected = selected;
      return nextState;
    } else {
      // toggle all pickers
      let nextState = { ...state };
      const ids = Object.keys(nextState);
      ids.forEach(id => {
        nextState[id].selected = toggleSelection(nextState, id, rowId);
      });
      return nextState;
    }
  },
  [FETCH_ENGINES_SUCCESS](state, action) {
    let engines = get(state, [getPickerID(action), 'engines']) || [];
    let enginesNextPage = get(action, 'payload.engines.records');

    let myOrgId = get(action, 'payload.me.organizationId');
    enginesNextPage.forEach(
      engine => (engine.owned = engine.ownerOrganization.id === myOrgId)
    );

    engines = engines.concat(enginesNextPage);
    let lastSearch = get(state, [getPickerID(action), 'lastSearch']);
    if (
      isNil(lastSearch) ||
      lastSearch === get(action, 'meta.variables.search')
    ) {
      return {
        ...state,
        [getPickerID(action)]: {
          loadingEngines: false,
          loadingEnginesFailed: false,
          engines,
          offset:
            get(action, 'meta.variables.offset') +
            get(action, 'payload.engines.count'),
          lastCount: get(action, 'payload.engines.count'),
          lastSearch,
          selected: get(state, [getPickerID(action), 'selected'])
        }
      };
    } else {
      return state;
    }
  },
  [FETCH_ENGINES_FAILURE](state, action) {
    return {
      ...state,
      [getPickerID(action)]: {
        loadingEngines: false,
        loadingEnginesFailed: true,
        engines: [],
        offset: 0,
        lastCount: 0,
        lastSearch: undefined,
        selected: {}
      }
    };
  }
});

export default reducer;

function local(state) {
  return state[namespace];
}

export const toggleEngine = ({ id, rowId }) => {
  return {
    type: TOGGLE_ENGINE,
    id,
    rowId
  };
};

export const fetchEngines = ({ category, id, owned, engineName }) => async (
  dispatch,
  getState
) => {
  const lastSearch = get(local(getState()), [id, 'lastSearch']);
  let offset = get(local(getState()), [id, 'offset']) || 0;
  if (!isEqual(engineName, lastSearch)) {
    offset = 0;
  }

  const query = `
    query {
      engines(offset: ${offset}, limit: ${PAGE_SIZE}, category: "${category}", name: "${engineName}", state: active, orderBy: {field: name, direction: asc}, owned: ${owned ===
    true}) {
        records {
          id,
          name,
          displayName,
          logoPath,
          builds {
            records {
              id,
              name,
              version,
              price
            }
          },
          description,
          deployedVersion,
          ownerOrganization {
            name,
            id
          }
        },
        count
      },
      me {
        organizationId
      }
    }
  `;

  return await callGraphQLApi({
    actionTypes: [FETCH_ENGINES, FETCH_ENGINES_SUCCESS, FETCH_ENGINES_FAILURE],
    query,
    dispatch,
    variables: {
      id: id,
      offset: offset,
      search: engineName,
      owned
    },
    getState
  });
};
