import { forEach, get, uniqWith, groupBy } from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const namespace = 'engineOutputExport';

export const FETCH_ENGINE_RUNS = `vtn/${namespace}/FETCH_ENGINE_RUNS`;
export const FETCH_ENGINE_RUNS_SUCCESS = `vtn/${namespace}/FETCH_ENGINE_RUNS_SUCCESS`;
export const FETCH_ENGINE_RUNS_FAILURE = `vtn/${namespace}/FETCH_ENGINE_RUNS_FAILURE`;

export const SET_INCLUDE_MEDIA = `vtn/${namespace}/SET_INCLUDE_MEDIA`;

export const TOGGLE_CONFIG_EXPAND = `vtn/${namespace}/TOGGLE_CONFIG_EXPAND`;

export const UPDATE_SELECTED_FILE_TYPES = `vtn/${namespace}/UPDATE_SELECTED_FILE_TYPES`;

// TODO: convert this to an api call or get it from the user org. (need to clarify this)
const fakeOrgSetting = {
  '67cd4dd0-2f75-445d-a6f0-2f297d6cd182': {
    vlf: 'enabled',
    ttml: 'enabled',
    txt: 'disabled'
  }
};

const defaultState = {
  fetchingEngineRuns: false,
  includeMedia: false,
  enginesRan: {},
  categoryLookup: {},
  expandedCategories: {},
  orgSettings: fakeOrgSetting,
  outputConfigurations: []
};

export default createReducer(defaultState, {
  [FETCH_ENGINE_RUNS](state) {
    return {
      ...state,
      fetchingEngineRuns: true
    };
  },
  [FETCH_ENGINE_RUNS_SUCCESS](state, { enginesRan }) {
    let newOutputConfigurations = [];
    const categoryLookup = {};
    const expandedCategories = {};
    forEach(enginesRan, engineRun => {
      if (state.orgSettings[engineRun.category.id]) {
        categoryLookup[engineRun.category.id] = engineRun.category;
        expandedCategories[engineRun.category.id] = false;
        newOutputConfigurations.push({
          engineId: engineRun.id,
          categoryId: engineRun.category.id,
          formats: []
        });
      }
    });
    newOutputConfigurations = state.outputConfigurations.concat(
      newOutputConfigurations
    );
    newOutputConfigurations = uniqWith(
      newOutputConfigurations,
      (output1, output2) => {
        return (
          output1.engineId === output2.engineId &&
          output1.categoryId === output2.categoryId
        );
      }
    );

    return {
      ...state,
      fetchingEngineRuns: false,
      enginesRan: {
        ...state.enginesRan,
        ...enginesRan
      },
      categoryLookup: {
        ...state.categoryLookup,
        ...categoryLookup
      },
      outputConfigurations: newOutputConfigurations,
      expandedCategories: expandedCategories
    };
  },
  [FETCH_ENGINE_RUNS_FAILURE](state, { error }) {
    return {
      ...state,
      fetchingEngineRuns: false,
      error
    };
  },
  [SET_INCLUDE_MEDIA](state, action) {
    return {
      ...state,
      includeMedia: action.includeMedia
    };
  },
  [TOGGLE_CONFIG_EXPAND](state, action) {
    return {
      ...state,
      expandedCategories: {
        ...state.expandedCategories,
        [action.categoryId]: !state.expandedCategories[action.categoryId]
      }
    };
  },
  [UPDATE_SELECTED_FILE_TYPES](state, action) {
    return {
      ...state,
      outputConfigurations: state.outputConfigurations.map(config => {
        if (
          config.engineId === action.engineId &&
          config.categoryId === action.categoryId
        ) {
          return {
            ...config,
            formats: action.selectedFileTypes.map(type => {
              return {
                extension: type,
                options: {}
              };
            })
          };
        }
        return config;
      })
    };
  }
});

function local(state) {
  return state[namespace];
}

export const includeMedia = state => get(local(state), 'includeMedia');
export const outputConfigsByCategoryId = state =>
  groupBy(get(local(state), 'outputConfigurations'), 'categoryId');
export const getCategoryById = (state, categoryId) => {
  return get(local(state), ['categoryLookup', categoryId]);
};
export const expandedCategories = state =>
  get(local(state), 'expandedCategories');
export const getEngineById = (state, engineId) =>
  get(local(state), ['enginesRan', engineId]);
export const categoryFormatOptions = (state, categoryId) =>
  get(local(state), ['orgSettings', categoryId]);
export const fetchingEngineRuns = state =>
  get(local(state), 'fetchingEngineRuns');

export const fetchEngineRuns = tdos => {
  return {
    type: FETCH_ENGINE_RUNS,
    tdoIds: tdos.map(tdo => tdo.id)
  };
};

export const fetchEngineRunsFailure = error => {
  return {
    type: FETCH_ENGINE_RUNS_FAILURE,
    fetchEngineRunError: error
  };
};

export const fetchEngineRunsSuccess = enginesRan => {
  return {
    type: FETCH_ENGINE_RUNS_SUCCESS,
    enginesRan
  };
};

export const setIncludeMedia = includeMedia => {
  return {
    type: SET_INCLUDE_MEDIA,
    includeMedia
  };
};

export const toggleConfigExpand = categoryId => {
  return {
    type: TOGGLE_CONFIG_EXPAND,
    categoryId
  };
};

export const selectFileType = (selectedFileTypes, categoryId, engineId) => {
  return {
    type: UPDATE_SELECTED_FILE_TYPES,
    selectedFileTypes,
    categoryId,
    engineId
  };
};
