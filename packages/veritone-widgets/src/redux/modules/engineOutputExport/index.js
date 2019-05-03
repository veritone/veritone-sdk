import { forEach, get, uniqWith, pick } from 'lodash';
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

export const APPLY_SPEAKER_TOGGLE = `vtn/${namespace}/APPLY_SPEAKER_TOGGLE`;
export const STORE_SPEAKER_TOGGLE = `vtn/${namespace}/STORE_SPEAKER_TOGGLE`;
export const STORE_HAS_SPEAKER_DATA = `vtn/${namespace}/STORE_HAS_SPEAKER_DATA`;

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
  speakerToggleCache: {
    withSpeakerData: true // Default value across all categories
  },
  hasSpeakerData: false,
  outputConfigurations: [],
  errorSnackBars: [],
  fetchEngineRunsFailed: false,
  exportAndDownloadFailed: false,
  isBulkExport: false,
  transcriptCategoryType: 'transcript',
  speakerCategoryType: 'speaker'
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
    const isBulkExport = Object.keys(payload).length > 1;
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
        if (isBulkExport) {
          if (!categoryLookup[engineRun.category.id]) {
            newOutputConfigurations.push({
              categoryId: engineRun.category.id,
              categoryType: engineRun.category.categoryType,
              formats: []
            });
          }
        } else {
          newOutputConfigurations.push({
            engineId: engineRun.id,
            categoryType: engineRun.category.categoryType,
            formats: []
          });
        }
        categoryLookup[engineRun.category.id] = engineRun.category;
        expandedCategories[engineRun.category.id] = false;
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
      subtitleConfigCache: {},
      outputConfigurations: newOutputConfigurations,
      expandedCategories: expandedCategories,
      isBulkExport,
      fetchEngineRunsFailed: false,
      includeMedia: false
    };
  },
  [FETCH_ENGINE_RUNS_FAILURE](state) {
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
  [SET_INCLUDE_MEDIA](
    state,
    {
      payload: { includeMedia }
    }
  ) {
    return {
      ...state,
      includeMedia: includeMedia
    };
  },
  [TOGGLE_CONFIG_EXPAND](
    state,
    {
      payload: { categoryId }
    }
  ) {
    return {
      ...state,
      expandedCategories: {
        ...state.expandedCategories,
        [categoryId]: !state.expandedCategories[categoryId]
      }
    };
  },
  [UPDATE_SELECTED_FILE_TYPES](
    state,
    {
      payload: { engineId, categoryId, selectedFileTypes }
    }
  ) {
    return {
      ...state,
      outputConfigurations: state.outputConfigurations.map(config => {
        if (
          (engineId && config.engineId === engineId) ||
          config.categoryId === categoryId
        ) {
          const storedSubtitleConfig = get(state, [
            'subtitleConfigCache',
            categoryId
          ]);
          const storedSpeakerToggle = state.hasSpeakerData
            ? get(state, ['speakerToggleCache', categoryId]) ||
              get(state, 'speakerToggleCache')
            : {};
          return {
            ...config,
            formats: selectedFileTypes.map(type => {
              return {
                extension: type,
                options: storedSubtitleConfig
                  ? {
                      ...storedSubtitleConfig,
                      ...storedSpeakerToggle
                    }
                  : {
                      ...storedSpeakerToggle
                    }
              };
            })
          };
        }
        return config;
      })
    };
  },
  [APPLY_SPEAKER_TOGGLE](
    state,
    {
      payload: { categoryId, values }
    }
  ) {
    return {
      ...state,
      outputConfigurations: state.outputConfigurations.map(config => {
        let engineCategoryId;
        if (!config.categoryId && config.engineId) {
          engineCategoryId = get(state, [
            'enginesRan',
            config.engineId,
            'category',
            'id'
          ]);
        }
        if (
          config.categoryId === categoryId ||
          engineCategoryId === categoryId
        ) {
          return {
            ...config,
            formats: config.formats.map(format => {
              return {
                ...format,
                options: {
                  ...format.options,
                  withSpeakerData: values
                }
              };
            })
          };
        }
        return config;
      })
    };
  },
  [STORE_SPEAKER_TOGGLE](
    state,
    {
      payload: { categoryId, config }
    }
  ) {
    return {
      ...state,
      speakerToggleCache: {
        ...state.speakerToggleCache,
        ...config
      }
    };
  },
  [STORE_HAS_SPEAKER_DATA](
    state,
    {
      payload: { hasSpeakerData }
    }
  ) {
    return {
      ...state,
      hasSpeakerData
    };
  },
  [APPLY_SUBTITLE_CONFIGS](
    state,
    {
      payload: { categoryId, values }
    }
  ) {
    return {
      ...state,
      outputConfigurations: state.outputConfigurations.map(config => {
        let engineCategoryId;
        if (!config.categoryId && config.engineId) {
          engineCategoryId = get(state, [
            'enginesRan',
            config.engineId,
            'category',
            'id'
          ]);
        }
        if (
          config.categoryId === categoryId ||
          engineCategoryId === categoryId
        ) {
          return {
            ...config,
            formats: config.formats.map(format => {
              return {
                ...format,
                options: { ...values }
              };
            })
          };
        }
        return config;
      })
    };
  },
  [STORE_SUBTITLE_CONFIGS](
    state,
    {
      payload: { categoryId, config }
    }
  ) {
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
  [ADD_SNACK_BAR](
    state,
    {
      payload: { snackBarConfig }
    }
  ) {
    return {
      ...state,
      errorSnackBars: [...state.errorSnackBars, snackBarConfig]
    };
  },
  [CLOSE_SNACK_BAR](
    state,
    {
      payload: { snackBarId }
    }
  ) {
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
export const outputConfigsByCategoryId = state => {
  const outputConfigsByCategoryId = {};
  const outputConfigurations = get(local(state), 'outputConfigurations');
  forEach(outputConfigurations, config => {
    if (config.categoryId) {
      if (!outputConfigsByCategoryId[config.categoryId]) {
        outputConfigsByCategoryId[config.categoryId] = [];
      }
      outputConfigsByCategoryId[config.categoryId].push(config);
    } else if (config.engineId) {
      // Look up engine category id using engineId
      const categoryId = get(
        getEngineById(state, config.engineId),
        'category.id'
      );
      if (!outputConfigsByCategoryId[categoryId]) {
        outputConfigsByCategoryId[categoryId] = [];
      }
      outputConfigsByCategoryId[categoryId].push(config);
    }
  });
  return outputConfigsByCategoryId;
};
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
export const speakerCategoryType = state =>
  get(local(state), 'speakerCategoryType');
export const transcriptCategoryType = state =>
  get(local(state), 'transcriptCategoryType');
export const getSubtitleConfig = (state, categoryId) =>
  get(local(state), ['subtitleConfigCache', categoryId]);
export const getSpeakerToggle = (state, categoryId) => {
  // If the category speaker toggle is undefined, then
  // fallback to the default across all categories
  const speakerToggleCache =
    get(local(state), ['speakerToggleCache', categoryId]) ||
    get(local(state), 'speakerToggleCache');
  return speakerToggleCache;
};
export const hasSpeakerData = state => get(local(state), 'hasSpeakerData');
export const isBulkExport = state => get(local(state), 'isBulkExport');
export const selectedFormats = state =>
  get(local(state), 'outputConfigurations').reduce((accumulator, configObj) => {
    return [...accumulator, ...configObj.formats];
  }, []);

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
              signedIconPath
              iconPath
              category {
                id
                name
                categoryType
                iconClass
                exportFormats {
                  format
                  label
                  types
                }
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

  if (!selectedFormats(getState()).length) {
    const e = {
      name: 'no_formats_selected',
      message: 'Please select from at least one option'
    };

    dispatch({
      type: EXPORT_AND_DOWNLOAD_FAILURE,
      error: true,
      payload: e
    });

    let error = new Error('No file formats selected');
    // wrap this single error for consistency with graphQL errors, which are always
    // wrapped.
    error.errors = [e];
    throw error;
  }

  return await callGraphQLApi({
    actionTypes: [
      START_EXPORT_AND_DOWNLOAD,
      EXPORT_AND_DOWNLOAD_SUCCESS,
      EXPORT_AND_DOWNLOAD_FAILURE
    ],
    query,
    variables: {
      includeMedia: getIncludeMedia(getState()),
      outputConfigurations: getOutputConfigurations(getState()).map(config =>
        pick(config, ['engineId', 'categoryId', 'formats'])
      ),
      tdoData
    },
    dispatch,
    getState
  });
};

export const setIncludeMedia = includeMedia => {
  return {
    type: SET_INCLUDE_MEDIA,
    payload: {
      includeMedia
    }
  };
};

export const toggleConfigExpand = categoryId => {
  return {
    type: TOGGLE_CONFIG_EXPAND,
    payload: {
      categoryId
    }
  };
};

export const selectFileType = (selectedFileTypes, categoryId, engineId) => {
  return {
    type: UPDATE_SELECTED_FILE_TYPES,
    payload: {
      selectedFileTypes,
      categoryId,
      engineId
    }
  };
};

export const applySubtitleConfigs = (categoryId, values) => {
  return {
    type: APPLY_SUBTITLE_CONFIGS,
    payload: {
      categoryId,
      values
    }
  };
};

export const applySpeakerToggle = (categoryId, values) => {
  return {
    type: APPLY_SPEAKER_TOGGLE,
    payload: {
      categoryId,
      values
    }
  };
};

export const storeSpeakerToggle = (categoryId, config) => {
  return {
    type: STORE_SPEAKER_TOGGLE,
    payload: {
      categoryId,
      config
    }
  };
};

export const setHasSpeakerData = hasSpeakerData => {
  return {
    type: STORE_HAS_SPEAKER_DATA,
    payload: {
      hasSpeakerData
    }
  };
};

export const addSnackBar = snackBarConfig => {
  return {
    type: ADD_SNACK_BAR,
    payload: {
      snackBarConfig
    }
  };
};

export const closeSnackBar = snackBarId => {
  return {
    type: CLOSE_SNACK_BAR,
    payload: {
      snackBarId
    }
  };
};

export const storeSubtitleConfigs = (categoryId, config) => {
  return {
    type: STORE_SUBTITLE_CONFIGS,
    payload: {
      categoryId,
      config
    }
  };
};
