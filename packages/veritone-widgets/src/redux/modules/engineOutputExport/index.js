import { forEach, get, uniqWith, groupBy, noop } from 'lodash';
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

export const START_EXPORT_AND_DOWNLOAD = `vtn/${namespace}/START_EXPORT_AND_DOWNLOAD`;
export const EXPORT_AND_DOWNLOAD_FAILURE = `vtn/${namespace}/EXPORT_AND_DOWNLOAD_FAILURE`;

export const SET_ON_EXPORT_CALLBACK = `vtn/${namespace}/SET_ON_EXPORT_CALLBACK`;

export const ADD_SNACK_BAR = `vtn/${namespace}/ADD_SNACK_BAR`;
export const CLOSE_SNACK_BAR = `vtn/${namespace}/CLOSE_SNACK_BAR`;

const defaultState = {
  fetchingEngineRuns: false,
  fetchingCategoryExportFormats: false,
  includeMedia: false,
  enginesRan: {},
  categoryLookup: {},
  expandedCategories: {},
  tdoData: [],
  outputConfigurations: [],
  errorSnackBars: [],
  fetchingEngineRunsError: null,
  exportAndDownloadError: null,
  onExport: noop
};

export default createReducer(defaultState, {
  [FETCH_ENGINE_RUNS](state) {
    return {
      ...state,
      fetchingEngineRuns: true,
      fetchingEngineRunsError: null
    };
  },
  [FETCH_ENGINE_RUNS_SUCCESS](state, { enginesRan, tdoData }) {
    let newOutputConfigurations = [];
    const categoryLookup = {};
    const expandedCategories = {};
    forEach(enginesRan, engineRun => {
      if (get(engineRun, 'category.exportFormats.length')) {
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
      expandedCategories: expandedCategories,
      tdoData
    };
  },
  [FETCH_ENGINE_RUNS_FAILURE](state, { error }) {
    return {
      ...state,
      enginesRan: {},
      categoryLookup: {},
      expandedCategories: {},
      outputConfigurations: [],
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
  [SET_ON_EXPORT_CALLBACK](state, { onExport }) {
    return {
      ...state,
      onExport: onExport || noop
    };
  },
  [START_EXPORT_AND_DOWNLOAD](state) {
    return {
      ...state,
      exportAndDownloadError: null
    };
  },
  [EXPORT_AND_DOWNLOAD_FAILURE](state, { error }) {
    return {
      ...state,
      exportAndDownloadError: error
    };
  },
  [ADD_SNACK_BAR](state, { snackBarConfig }) {
    return {
      ...state,
      errorSnackBars: [...state.errorSnackBars, snackBarConfig]
    };
  },
  [CLOSE_SNACK_BAR](state, { snackBarId }) {
    return {
      ...state,
      errorSnackBars: state.errorSnackBars.map(snackBar => {
        if (snackBar.id === snackBarId) {
          return {
            ...snackBar,
            open: false
          };
        }
        return snackBar;
      })
    };
  }
});

function local(state) {
  return state[namespace];
}

export const getIncludeMedia = state => get(local(state), 'includeMedia');
export const outputConfigsByCategoryId = state =>
  groupBy(get(local(state), 'outputConfigurations'), 'categoryId');
export const getCategoryById = (state, categoryId) => {
  return get(local(state), ['categoryLookup', categoryId]);
};
export const expandedCategories = state =>
  get(local(state), 'expandedCategories');
export const getEngineById = (state, engineId) =>
  get(local(state), ['enginesRan', engineId]);
export const fetchingEngineRuns = state =>
  get(local(state), 'fetchingEngineRuns');
export const fetchingCategoryExportFormats = state =>
  get(local(state), 'fetchingCategoryExportFormats');
export const onExport = state => get(local(state), 'onExport');
export const getOutputConfigurations = state =>
  get(local(state), 'outputConfigurations');
export const getTdoData = state => get(local(state), 'tdoData');
export const errorSnackBars = state => get(local(state), 'errorSnackBars');
export const fetchingEngineRunsError = state =>
  get(local(state), 'fetchingEngineRunsError');

export const fetchEngineRuns = tdos => {
  return {
    type: FETCH_ENGINE_RUNS,
    tdoIds: tdos.map(tdo => tdo.id)
  };
};

export const fetchEngineRunsFailure = error => {
  return {
    type: FETCH_ENGINE_RUNS_FAILURE,
    error
  };
};

export const fetchEngineRunsSuccess = (enginesRan, tdoData) => {
  return {
    type: FETCH_ENGINE_RUNS_SUCCESS,
    enginesRan,
    tdoData
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

export const setOnExportCallback = cb => {
  return {
    type: SET_ON_EXPORT_CALLBACK,
    onExport: cb
  };
};

export const startExportAndDownload = () => {
  return {
    type: START_EXPORT_AND_DOWNLOAD
  };
};

export const exportAndDownloadFailure = error => {
  return {
    type: EXPORT_AND_DOWNLOAD_FAILURE,
    error
  };
};

export const addSnackBar = snackBarConfig => {
  return {
    type: ADD_SNACK_BAR,
    snackBarConfig
  };
};

export const closeSnackBar = snackBarId => {
  return {
    type: CLOSE_SNACK_BAR,
    snackBarId
  };
};
