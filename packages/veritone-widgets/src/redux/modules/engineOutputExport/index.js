import { forEach, get, uniqWith, groupBy, find } from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const namespace = 'engineOutputExport';

export const FETCH_ENGINE_RUNS = `vtn/${namespace}/FETCH_ENGINE_RUNS`;
export const FETCH_ENGINE_RUNS_SUCCESS = `vtn/${namespace}/FETCH_ENGINE_RUNS_SUCCESS`;
export const FETCH_ENGINE_RUNS_FAILURE = `vtn/${namespace}/FETCH_ENGINE_RUNS_FAILURE`;

export const SET_INCLUDE_MEDIA = `vtn/${namespace}/SET_INCLUDE_MEDIA`;

export const TOGGLE_CONFIG_EXPAND = `vtn/${namespace}/TOGGLE_CONFIG_EXPAND`;

export const UPDATE_SELECTED_FILE_TYPES = `vtn/${namespace}/UPDATE_SELECTED_FILE_TYPES`;

export const APPLY_SUBTITLE_OPTIONS = `vtn/${namespace}/APPLY_SUBTITLE_OPTIONS`;

export const FETCH_ENGINE_CATEGORY_EXPORT_FORMATS_SUCCESS = `vtn/${namespace}/FETCH_ENGINE_CATEGORY_EXPORT_FORMATS_SUCCESS`;
export const FETCH_ENGINE_CATEGORY_EXPORT_FORMATS_FAILURE = `vtn/${namespace}/FETCH_ENGINE_CATEGORY_EXPORT_FORMATS_FAILURE`;

const defaultState = {
  fetchingEngineRuns: false,
  fetchingCategoryExportFormats: false,
  includeMedia: false,
  enginesRan: {},
  categoryLookup: {},
  expandedCategories: {},
  outputConfigurations: [],
  engineCategoryExportFormats: [],
  fetchingEngineRunsError: '',
  fetchCategoryExportFormatsError: ''
};

export default createReducer(defaultState, {
  [FETCH_ENGINE_RUNS](state) {
    return {
      ...state,
      fetchingEngineRuns: true,
      fetchingEngineRunsError: ''
    };
  },
  [FETCH_ENGINE_RUNS_SUCCESS](state, { enginesRan }) {
    let newOutputConfigurations = [];
    const categoryLookup = {};
    const expandedCategories = {};
    forEach(enginesRan, engineRun => {
      const categoryExportFormat = find(state.engineCategoryExportFormats, {
        engineCategoryId: engineRun.category.id
      });
      if (categoryExportFormat) {
        categoryLookup[engineRun.category.id] = engineRun.category;
        expandedCategories[engineRun.category.id] = false;
        newOutputConfigurations.push({
          engineId: engineRun.id,
          categoryId: engineRun.category.id,
          formats: []
        });
      }
    });
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
      fetchingEngineRunsError: error
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
          (config.engineId === action.engineId &&
            config.categoryId === action.categoryId) ||
          (config.categoryId === action.categoryId && action.applyAll)
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
  },
  [APPLY_SUBTITLE_OPTIONS](state, action) {
    return {
      ...state,
      outputConfigurations: state.outputConfigurations.map(config => {
        if (config.categoryId === action.categoryId) {
          return {
            ...config,
            formats: config.formats.map(format => {
              return {
                ...format,
                options: { ...action.values }
              };
            })
          };
        }
        return config;
      })
    };
  },
  [FETCH_ENGINE_CATEGORY_EXPORT_FORMATS_SUCCESS](state, action) {
    return {
      ...state,
      engineCategoryExportFormats: [...action.engineCategoryExportFormats]
    };
  },
  [FETCH_ENGINE_CATEGORY_EXPORT_FORMATS_FAILURE](state, { error }) {
    return {
      ...state,
      fetchCategoryExportFormatsError: error
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
export const engineCategoryExportFormats = (state, categoryId) =>
  find(get(local(state), 'engineCategoryExportFormats'), {
    engineCategoryId: categoryId
  });
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

export const selectFileType = (
  selectedFileTypes,
  categoryId,
  engineId,
  applyAll = false
) => {
  return {
    type: UPDATE_SELECTED_FILE_TYPES,
    selectedFileTypes,
    categoryId,
    engineId,
    applyAll
  };
};

export const applySubtitleConfigs = (categoryId, values) => {
  return {
    type: APPLY_SUBTITLE_OPTIONS,
    categoryId,
    values
  };
};

export const fetchEngineCategoryExportFormatsSuccess = engineCategoryExportFormats => {
  return {
    type: FETCH_ENGINE_CATEGORY_EXPORT_FORMATS_SUCCESS,
    engineCategoryExportFormats
  };
};

export const fetchEngineCategoryExportFormatsFailure = error => {
  return {
    type: FETCH_ENGINE_CATEGORY_EXPORT_FORMATS_FAILURE,
    error
  };
};
