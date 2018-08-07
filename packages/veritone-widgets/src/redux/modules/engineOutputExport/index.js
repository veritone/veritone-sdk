import { forEach, get, uniqWith, groupBy } from 'lodash';
import { helpers } from 'veritone-redux-common';
const { createReducer, callGraphQLApi } = helpers;

export const namespace = 'engineOutputExport';

export const FETCH_ENGINE_RUNS = `vtn/${namespace}/FETCH_ENGINE_RUNS`;
export const FETCH_ENGINE_RUNS_SUCCESS = `vtn/${namespace}/FETCH_ENGINE_RUNS_SUCCESS`;
export const FETCH_ENGINE_RUNS_FAILURE = `vtn/${namespace}/FETCH_ENGINE_RUNS_FAILURE`;

export const SET_INCLUDE_MEDIA = `vtn/${namespace}/SET_INCLUDE_MEDIA`;

export const TOGGLE_CONFIG_EXPAND = `vtn/${namespace}/TOGGLE_CONFIG_EXPAND`;

export const UPDATE_SELECTED_FILE_TYPES = `vtn/${namespace}/UPDATE_SELECTED_FILE_TYPES`;

export const APPLY_SUBTITLE_CONFIGS = `vtn/${namespace}/APPLY_SUBTITLE_CONFIGS`;
export const STORE_SUBTITLE_CONFIGS = `vtn/${namespace}/STORE_SUBTITLE_CONFIGS`;

export const START_EXPORT_AND_DOWNLOAD = `vtn/${namespace}/START_EXPORT_AND_DOWNLOAD`;
export const EXPORT_AND_DOWNLOAD_SUCCESS = `vtn/${namespace}/EXPORT_AND_DOWNLOAD_SUCCESS`;
export const EXPORT_AND_DOWNLOAD_FAILURE = `vtn/${namespace}/EXPORT_AND_DOWNLOAD_FAILURE`;

export const ADD_SNACK_BAR = `vtn/${namespace}/ADD_SNACK_BAR`;
export const CLOSE_SNACK_BAR = `vtn/${namespace}/CLOSE_SNACK_BAR`;

const defaultState = {
  fetchingEngineRuns: false,
  fetchingCategoryExportFormats: false,
  includeMedia: false,
  enginesRan: {},
  categoryLookup: {},
  expandedCategories: {},
  subtitleConfigCache: {},
  outputConfigurations: [],
  errorSnackBars: [],
  fetchEngineRunsFailed: false,
  exportAndDownloadFailed: false
};

export default createReducer(defaultState, {
  [FETCH_ENGINE_RUNS](state) {
    return {
      ...state,
      fetchingEngineRuns: true,
      fetchEngineRunsFailed: null
    };
  },
  [FETCH_ENGINE_RUNS_SUCCESS](state, { payload }) {
    let newOutputConfigurations = [];
    const categoryLookup = {};
    const expandedCategories = {};
    const enginesRan = Object.values(payload).reduce((accumulator, tdo) => {
      const engines = get(tdo, 'engineRuns.records');
      if (engines) {
        engines.forEach(record => {
          if (record.status !== 'failed') {
            accumulator[record.engine.id] = record.engine;
          }
        });
      }
      return accumulator;
    }, {});
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
      fetchEngineRunsFailed: false,
      includeMedia: false
    };
  },
  [FETCH_ENGINE_RUNS_FAILURE](state, action) {
    return {
      ...state,
      enginesRan: {},
      categoryLookup: {},
      expandedCategories: {},
      outputConfigurations: [],
      fetchingEngineRuns: false,
      fetchEngineRunsFailed: true
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
          const storedSubtitleConfig = get(state, [
            'subtitleConfigCache',
            action.categoryId
          ]);
          return {
            ...config,
            formats: action.selectedFileTypes.map(type => {
              return {
                extension: type,
                options: storedSubtitleConfig
                  ? {
                      ...storedSubtitleConfig
                    }
                  : {}
              };
            })
          };
        }
        return config;
      })
    };
  },
  [APPLY_SUBTITLE_CONFIGS](state, action) {
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
  [STORE_SUBTITLE_CONFIGS](state, { categoryId, config }) {
    return {
      ...state,
      subtitleConfigCache: {
        ...state.subtitleConfigCache,
        [categoryId]: {
          ...config
        }
      }
    };
  },
  [START_EXPORT_AND_DOWNLOAD](state) {
    return {
      ...state,
      exportAndDownloadFailed: false
    };
  },
  [EXPORT_AND_DOWNLOAD_FAILURE](state) {
    return {
      ...state,
      exportAndDownloadFailed: true
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
export const getOutputConfigurations = state =>
  get(local(state), 'outputConfigurations');
export const errorSnackBars = state => get(local(state), 'errorSnackBars');
export const fetchEngineRunsFailed = state =>
  get(local(state), 'fetchEngineRunsFailed');
export const getSubtitleConfig = (state, categoryId) =>
  get(local(state), ['subtitleConfigCache', categoryId]);

export const fetchEngineRuns = tdos => async (dispatch, getState) => {
  // TODO: Update the temporalDataObjects query to accept multiple ids.
  const tdoQueries = tdos.map(tdo => tdo.tdoId).reduce((accumulator, id) => {
    const subquery = `
      tdo${id}:  temporalDataObject(id: "${id}") {
        id
        engineRuns {
          records {
            engine {
              id
              name
              signedLogoPath
              iconPath
              category {
                id
                name
                iconClass
                exportFormats
              }
            },
            status
          }
        }
      }
    `;
    return accumulator + subquery;
  }, '');

  const query = `
    query {
      ${tdoQueries}
    }
  `;

  return await callGraphQLApi({
    actionTypes: [
      FETCH_ENGINE_RUNS,
      FETCH_ENGINE_RUNS_SUCCESS,
      FETCH_ENGINE_RUNS_FAILURE
    ],
    query,
    dispatch,
    getState
  });
};

export const exportAndDownload = tdoData => async (dispatch, getState) => {
  const query = `
    mutation createExportRequest(
      $includeMedia: Boolean,
      $tdoData: [CreateExportRequestForTDO!]!,
      $outputConfigurations: [CreateExportRequestOutputConfig!]
    ) {
      createExportRequest(input: {
        includeMedia: $includeMedia
        tdoData: $tdoData
        outputConfigurations: $outputConfigurations
      }) {
        id
        status
        organizationId
        createdDateTime
        modifiedDateTime
        requestorId
        assetUri
      }
    }
  `;

  return await callGraphQLApi({
    actionTypes: [
      START_EXPORT_AND_DOWNLOAD,
      EXPORT_AND_DOWNLOAD_SUCCESS,
      EXPORT_AND_DOWNLOAD_FAILURE
    ],
    query,
    variables: {
      includeMedia: getIncludeMedia(getState()),
      outputConfigurations: getOutputConfigurations(getState()),
      tdoData
    },
    dispatch,
    getState
  });
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
    type: APPLY_SUBTITLE_CONFIGS,
    categoryId,
    values
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

export const storeSubtitleConfigs = (categoryId, config) => {
  return {
    type: STORE_SUBTITLE_CONFIGS,
    categoryId,
    config
  };
};
