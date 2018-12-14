import { get, set, isEqual, cloneDeep, forEach, find } from 'lodash';

// if memory becomes a problem, use immutable js by:
// 1. uncomment lines that have "// with immutable js"
// 2. comment out or remove lines that have "// without immutable js"
// import { fromJS } from 'immutable';  // with immutable js

import { saveAsset } from '../../../../shared/asset';
import { helpers } from 'veritone-redux-common';

const { createReducer, callGraphQLApi } = helpers;

export const transcriptNamespace = 'veritoneTranscriptWidget';
export const UNDO = transcriptNamespace + '_UNDO';
export const REDO = transcriptNamespace + '_REDO';
export const RESET = transcriptNamespace + '_RESET';
export const CHANGE = transcriptNamespace + '_CHANGE';
export const CLEAR_DATA = transcriptNamespace + '_CLEAR_DATA';
export const RECEIVE_DATA = transcriptNamespace + '_RECEIVE_DATA';
export const UPDATE_EDIT_STATUS = transcriptNamespace + '_UPDATE_EDIT_STATUS';
export const TRANSCRIPT_EDIT_BUTTON_CLICKED =
  transcriptNamespace + '_TRANSCRIPT_EDIT_BUTTON_CLICKED';
export const SAVE_TRANSCRIPT_EDITS =
  transcriptNamespace + '_SAVE_TRANSCRIPT_EDITS';
export const SAVE_TRANSCRIPT_EDITS_SUCCESS =
  transcriptNamespace + '_SAVE_TRANSCRIPT_EDITS_SUCCESS';
export const SAVE_TRANSCRIPT_EDITS_FAILURE =
  transcriptNamespace + '_SAVE_TRANSCRIPT_EDITS_FAILURE';
export const SAVE_BULK_EDIT_TEXT_ASSET =
  transcriptNamespace + '_SAVE_BULK_EDIT_TEXT_ASSET';
export const SAVE_BULK_EDIT_TEXT_ASSET_SUCCESS =
  transcriptNamespace + '_SAVE_BULK_EDIT_TEXT_ASSET_SUCCESS';
export const SAVE_BULK_EDIT_TEXT_ASSET_FAILURE =
  transcriptNamespace + '_SAVE_BULK_EDIT_TEXT_ASSET_FAILURE';
export const GET_PRIMARY_TRANSCRIPT_ASSET =
  transcriptNamespace + '_GET_PRIMARY_TRANSCRIPT_ASSET';
export const GET_PRIMARY_TRANSCRIPT_ASSET_SUCCESS =
  transcriptNamespace + '_GET_PRIMARY_TRANSCRIPT_ASSET_SUCCESS';
export const GET_PRIMARY_TRANSCRIPT_ASSET_FAILURE =
  transcriptNamespace + '_GET_PRIMARY_TRANSCRIPT_ASSET_FAILURE';
export const GET_VTN_STANDARD_ASSETS =
  transcriptNamespace + '_GET_VTN_STANDARD_ASSETS';
export const GET_VTN_STANDARD_ASSETS_SUCCESS =
  transcriptNamespace + '_GET_VTN_STANDARD_ASSETS_SUCCESS';
export const GET_VTN_STANDARD_ASSETS_FAILURE =
  transcriptNamespace + '_GET_VTN_STANDARD_ASSETS_FAILURE';
export const RUN_BULK_EDIT_JOB = transcriptNamespace + '_RUN_BULK_EDIT_JOB';
export const RUN_BULK_EDIT_JOB_SUCCESS =
  transcriptNamespace + '_RUN_BULK_EDIT_JOB_SUCCESS';
export const RUN_BULK_EDIT_JOB_FAILURE =
  transcriptNamespace + '_RUN_BULK_EDIT_JOB_FAILURE';
export const SET_SHOW_TRANSCRIPT_BULK_EDIT_SNACK_STATE =
  transcriptNamespace + '_SET_SHOW_TRANSCRIPT_BULK_EDIT_SNACK_STATE';
export const CLOSE_ERROR_SNACKBAR =
  transcriptNamespace + 'CLOSE_ERROR_SNACKBAR';
export const TOGGLE_EDIT_MODE = transcriptNamespace + '_TOGGLE_EDIT_MODE';
export const OPEN_CONFIRMATION_DIALOG =
  transcriptNamespace + '_OPEN_CONFIRMATION_DIALOG';
export const CLOSE_CONFIRMATION_DIALOG =
  transcriptNamespace + '_CLOSE_CONFIRMATION_DIALOG';

const removeableIndex = 1; // index 0 is reserved for initial value
const maxBulkHistorySize = 100; // Only alow user to undo 50 times in bulk edit
const maxSnippetHistorySize = 500; // Only alow user to undo 500 times in snippet edit
const initialState = {
  data: [],
  past: [],
  future: [],
  present: null,
  isBulkEdit: false,
  showTranscriptBulkEditSnack: false,
  error: null,
  savingTranscript: false,
  editModeEnabled: false,
  showConfirmationDialog: false,
  confirmationType: 'cancelEdits',
  combineCategory: 'speaker'
};

const transcriptReducer = createReducer(initialState, {
  [UNDO](state, action) {
    const newPast = state.past || [];
    const newFuture = state.future || [];
    let newCurrentData = state.data || [];
    let newPresent;

    if (newPast.length > 0) {
      newPresent = newPast.pop();
      // newCurrentData = newPresent.toJS();          // with immutable js
      newCurrentData = cloneDeep(newPresent); // without immutable js
      state.present && newFuture.push(state.present);
    } else {
      // newPresent = fromJS(state.data);       // with immutable js
      newPresent = cloneDeep(state.data); // without immutable js
    }

    return {
      ...state,
      data: newCurrentData,
      past: newPast,
      future: newFuture,
      present: newPresent
    };
  },

  [REDO](state, action) {
    const newPast = state.past || [];
    const newFuture = state.future || [];
    let newCurrentData = state.data || [];
    let newPresent;

    if (newFuture.length > 0) {
      newPresent = newFuture.pop();
      // newCurrentData = newPresent.toJS();    // with immutable js
      newCurrentData = cloneDeep(newPresent); // without immutable js
      state.present && newPast.push(state.present);
    } else {
      // newPresent = fromJS(state.data);       // with immutable js
      newPresent = cloneDeep(state.data); // without immutable js
    }

    return {
      ...state,
      data: newCurrentData,
      past: newPast,
      future: newFuture,
      present: newPresent
    };
  },

  [RESET](state, action) {
    const past = state.past || [];
    let initialData;
    let initialPresent;
    if (past.length > 0) {
      initialPresent = past[0];
      // initialData = initialPresent.toJS();   // with immutable js
      initialData = cloneDeep(initialPresent); // without immutable js
    } else {
      initialData = state.data;
      initialPresent = state.present;
    }

    return {
      ...state,
      data: initialData,
      past: [],
      future: [],
      present: initialPresent
    };
  },

  [CHANGE](state, action) {
    let newState = state;
    const editType = action.data.type;
    switch (editType) {
      case 'snippet':
        newState = handleSnippetEdit(state, action);
        break;

      case 'bulk':
        newState = handleBulkEdit(state, action);
        break;
    }

    return newState;
  },

  [CLEAR_DATA](state, action) {
    return { ...state, data: [], past: [], future: [], present: null };
  },

  [RECEIVE_DATA](state, action) {
    const past = state.past;
    const { data, editableData } = action;

    // const oldData = (past && past.length > 0) ? past[0].toJS() : state.data;     // with immutable js
    const oldData = get(past, '[0]', state.data); // without immutable js

    if (isEqual(data, oldData)) {
      return { ...state };
    } else {
      // const present = fromJS(data);    // with immutable js
      const present = cloneDeep(data); // without immutable js
      return { ...state, data: data, editableData: editableData, past: [], future: [], present: present };
    }
  },
  [SAVE_TRANSCRIPT_EDITS](state) {
    return {
      ...state,
      error: null,
      savingTranscript: true
    };
  },
  [SAVE_TRANSCRIPT_EDITS_SUCCESS](state) {
    return {
      ...state,
      error: null,
      savingTranscript: false
    };
  },
  [SAVE_TRANSCRIPT_EDITS_FAILURE](
    state,
    {
      payload: { error }
    }
  ) {
    return {
      ...state,
      error,
      savingTranscript: false
    };
  },
  [SET_SHOW_TRANSCRIPT_BULK_EDIT_SNACK_STATE](
    state,
    { showTranscriptBulkEditSnack }
  ) {
    return {
      ...state,
      showTranscriptBulkEditSnack
    };
  },
  [CLOSE_ERROR_SNACKBAR](state) {
    return {
      ...state,
      error: null
    };
  },
  [TOGGLE_EDIT_MODE](state) {
    return {
      ...state,
      editModeEnabled: !state.editModeEnabled
    };
  },
  [OPEN_CONFIRMATION_DIALOG](
    state,
    {
      payload: { confirmationType }
    }
  ) {
    return {
      ...state,
      showConfirmationDialog: true,
      confirmationType: confirmationType || 'cancelEdits'
    };
  },
  [CLOSE_CONFIRMATION_DIALOG](state) {
    return {
      ...state,
      showConfirmationDialog: false,
      confirmationType: 'cancelEdits'
    };
  }
});

function handleBulkEdit(state, action) {
  const changedData = action.data.newValue;
  const newData = [
    {
      series: [
        {
          startTimeMs: changedData.startTimeMs,
          stopTimeMs: changedData.stopTimeMs,
          words: [
            {
              word: changedData.value,
              confidence: 1
            }
          ]
        }
      ]
    }
  ];

  const newPast = state.past || [];
  // const newPresent = fromJS(newData);          // with immutable js
  const newPresent = cloneDeep(newData); // without immutable js
  // const prevPresent = state.present;           // with immutable js
  const prevPresent = cloneDeep(state.present); // without immutable js
  newPast.push(prevPresent);
  newPast.length > maxBulkHistorySize && newPast.splice(removeableIndex, 0); // remove extra history
  return {
    ...state,
    data: newData,
    past: newPast,
    future: [],
    present: newPresent,
    isBulkEdit: true
  };
}

function handleSnippetEdit(state, action) {
  const newPast = state.past || [];
  // const prevPresent = state.present;             // with immutable js
  const prevPresent = cloneDeep(state.present); // without immutable js

  const changedData = action.data.newValue;
  const targetData = action.data.originalValue;
  const initialPresent = newPast.length > 0 ? newPast[0] : prevPresent;

  let entryIndex = -1;
  let isNoContent = false;
  const chunkIndex = initialPresent.findIndex(chunk => {
    // const series = chunk.get('series');      // with immutable js
    const series = get(chunk, 'series'); // without immutable js
    entryIndex = series.findIndex(entry => {
      // const orgStartTime = entry.get('startTimeMs');   // with immutable js
      // const orgStopTime = entry.get('stopTimeMs');     // with immutable js
      // const orgWords = entry.get('words');             // with immutable js

      const orgStartTime = get(entry, 'startTimeMs'); // without immutable js
      const orgStopTime = get(entry, 'stopTimeMs'); // without immutable js
      const orgWords = get(entry, 'words', undefined); // without immutable js

      if (
        targetData.startTimeMs === orgStartTime &&
        targetData.stopTimeMs === orgStopTime
      ) {
        if (!orgWords) {
          isNoContent = !targetData.value;
          return isNoContent;
        } else {
          // sort word options base on confidence

          const sortedWords = orgWords.sort(
            (first, second) =>
              // first.get('confidence') < second.get('confidence')   // with immutable js
              get(first, 'confidence') < get(second, 'confidence') // without immutable js
          );

          // const orgValues = sortedWords.first().get('word');     // with immutable js
          const orgValues = get(sortedWords, '[0].word'); // without immutable js
          return orgValues === targetData.value;
        }
      }

      return false;
    });
    return entryIndex >= 0;
  });

  if (chunkIndex >= 0 && entryIndex >= 0) {
    newPast.length > maxSnippetHistorySize &&
      newPast.splice(removeableIndex, 0); // remove extra history

    newPast.push(prevPresent);
    let newPresent;
    newPresent = cloneDeep(prevPresent); // without immutable js
    if (isNoContent) {
      const newSnippet = {
        startTimeMs: changedData.startTimeMs,
        stopTimeMs: changedData.stopTimeMs,
        words: [
          {
            word: changedData.value,
            confidence: 1
          }
        ]
      };
      // newPresent = prevPresent.setIn([chunkIndex, 'series', entryIndex], newSnippet);  // with immutable js
      const contentPath = `[${chunkIndex}].series[${entryIndex}]`; // without immutable js
      set(newPresent, contentPath, newSnippet); // without immutable js
    } else {
      // newPresent = prevPresent.setIn([chunkIndex, 'series', entryIndex, 'words'], [{word: changedData.value, confidence: 1}]);    // with immutable js
      const contentPath = `[${chunkIndex}].series[${entryIndex}].words`; // without immutable js
      set(newPresent, contentPath, [
        { word: changedData.value, confidence: 1 }
      ]); // without immutable js
    }

    // const newData = newPresent.toJS();     // with immutable js
    const newData = cloneDeep(newPresent); // without immutable js
    return {
      ...state,
      data: newData,
      past: newPast,
      future: [],
      present: newPresent,
      isBulkEdit: false
    };
  } else {
    return { ...state, past: newPast, isBulkEdit: false };
  }
}

export default transcriptReducer;
export const undo = () => ({ type: UNDO });
export const redo = () => ({ type: REDO });
export const reset = () => ({ type: RESET });
export const change = newData => ({ type: CHANGE, data: newData });
export const clearData = () => ({ type: CLEAR_DATA });
export const receiveData = newData => ({ type: RECEIVE_DATA, data: newData, editableData: cloneDeep(newData) });
export const editTranscriptButtonClick = () => {
  return {
    type: TRANSCRIPT_EDIT_BUTTON_CLICKED
  };
};
export const setShowTranscriptBulkEditSnackState = showTranscriptBulkEditSnack => ({
  type: SET_SHOW_TRANSCRIPT_BULK_EDIT_SNACK_STATE,
  showTranscriptBulkEditSnack
});
export const closeErrorSnackbar = () => ({
  type: CLOSE_ERROR_SNACKBAR
});
export const toggleEditMode = () => ({
  type: TOGGLE_EDIT_MODE
});
export const openConfirmationDialog = confirmationType => {
  return {
    type: OPEN_CONFIRMATION_DIALOG,
    payload: {
      confirmationType
    }
  };
};

export const closeConfirmationDialog = () => ({
  type: CLOSE_CONFIRMATION_DIALOG
});

function local(state) {
  return state[transcriptNamespace];
}
export const currentData = state => get(local(state), 'data');
export const editableData = state => get(local(state), 'editableData');
export const hasUserEdits = state => {
  const history = get(local(state), 'past');
  return history && history.length > 0;
};
export const isBulkEdit = state => get(local(state), 'isBulkEdit');
export const getShowTranscriptBulkEditSnack = state =>
  get(local(state), 'showTranscriptBulkEditSnack');
export const getError = state => get(local(state), 'error');
export const getSavingTranscriptEdits = state =>
  get(local(state), 'savingTranscript');
export const getEditModeEnabled = state => get(local(state), 'editModeEnabled');
export const showConfirmationDialog = state =>
  get(local(state), 'showConfirmationDialog');
export const getConfirmationType = state =>
  get(local(state), 'confirmationType');
export const combineCategory = state =>
  get(local(state), 'combineCategory');
export const getSelectedCombineEngineId = state =>
  get(local(state), 'selectedCombineEngineId');
export const getCombineViewTypes = state => {
  const viewTypes = [{
    name: 'Transcript',
    id: 'transcript-view'
  }];
  const selectedCombineEngineId = get(local(state), 'selectedCombineEngineId');
  if (selectedCombineEngineId) {
    viewTypes.unshift({
      name: 'Speaker Separation',
      id: 'speaker-view'
    });
  }
  return viewTypes;
};
export const selectedCombineViewTypeId = state =>
  get(local(state), 'selectedCombineViewTypeId');

const getPrimaryTranscriptAsset = (tdoId, dispatch, getState) => {
  // to run bulk-edit-transcript task first try to find original 'transcript' ttml asset
  const getPrimaryTranscriptAssetQuery = `query temporalDataObject($tdoId: ID!){
      temporalDataObject(id: $tdoId) {
        primaryAsset(assetType: "transcript") {
          id
        }
      }
    }`;
  return callGraphQLApi({
    actionTypes: [
      GET_PRIMARY_TRANSCRIPT_ASSET,
      GET_PRIMARY_TRANSCRIPT_ASSET_SUCCESS,
      GET_PRIMARY_TRANSCRIPT_ASSET_FAILURE
    ],
    query: getPrimaryTranscriptAssetQuery,
    variables: { tdoId },
    dispatch,
    getState
  });
};

const fetchAssets = (tdoId, assetType, dispatch, getState) => {
  const getVtnStandardAssetsQuery = `query temporalDataObject($tdoId: ID!){
    temporalDataObject(id: $tdoId) {
      assets (limit: 1000, type: "${assetType}", orderBy: createdDateTime) {
        records {
          id
          isUserEdited
          sourceData {
            engineId
          }
          jsondata
        }
      }
    }
  }`;

  return callGraphQLApi({
    actionTypes: [
      GET_VTN_STANDARD_ASSETS,
      GET_VTN_STANDARD_ASSETS_SUCCESS,
      GET_VTN_STANDARD_ASSETS_FAILURE
    ],
    query: getVtnStandardAssetsQuery,
    variables: { tdoId },
    dispatch,
    getState
  });
};

const runBulkEditJob = (
  tdoId,
  originalTranscriptAssetId,
  bulkTextAssetId,
  engineId,
  dispatch,
  getState
) => {
  // run levenstein engine
  const runBulkEditJobQuery = `mutation createJob($tdoId: ID!){
    createJob(input: {
      targetId: $tdoId,
      tasks: [{
        engineId: "bulk-edit-transcript",
        payload: {
          originalTranscriptAssetId: "${originalTranscriptAssetId}",
          temporaryBulkEditAssetId: "${bulkTextAssetId}",
          originalEngineId: "${engineId}",
          saveToVtnStandard: true
        }
      },
      {
        engineId: "insert-into-index"
      },
      {
        engineId: "mention-generate"
      }]
    }) {
      id
      status
      tasks {
        records {
          id
        }
      }
    }
  }`;

  return callGraphQLApi({
    actionTypes: [
      RUN_BULK_EDIT_JOB,
      RUN_BULK_EDIT_JOB_SUCCESS,
      RUN_BULK_EDIT_JOB_FAILURE
    ],
    query: runBulkEditJobQuery,
    variables: { tdoId },
    dispatch,
    getState
  });
};

export const saveTranscriptEdit = (tdoId, selectedEngineId) => {
  return async function action(dispatch, getState) {
    dispatch({
      type: SAVE_TRANSCRIPT_EDITS
    });
    const bulkEditEnabled = isBulkEdit(getState());
    const assetData = currentData(getState());
    if (bulkEditEnabled) {
      dispatch({
        type: SAVE_BULK_EDIT_TEXT_ASSET
      });
      let createBulkEditAssetResponse;
      try {
        createBulkEditAssetResponse = await saveAsset(
          {
            tdoId,
            contentType: 'text/plain',
            type: 'bulk-edit-transcript',
            sourceData: {}
          },
          get(assetData, '[0].series[0].words[0].word', ''),
          dispatch,
          getState
        );
      } catch (e) {
        console.error(e);
        dispatch({
          type: SAVE_TRANSCRIPT_EDITS_FAILURE,
          payload: {
            error: 'Failed to save bulk edit text asset.'
          }
        });
        return;
      }

      const bulkEditTextAsset = get(
        createBulkEditAssetResponse,
        'data.createAsset'
      );
      if (bulkEditTextAsset && bulkEditTextAsset.id) {
        dispatch({
          type: SAVE_BULK_EDIT_TEXT_ASSET_SUCCESS,
          payload: {
            ...bulkEditTextAsset
          }
        });
      }

      let originalTranscriptAssetId;
      // order of original transcript preference:
      // vtn-standard => v-vlf => primary transcript
      let vtnStandardAssetsResponse;
      try {
        vtnStandardAssetsResponse = await fetchAssets(
          tdoId,
          'vtn-standard',
          dispatch,
          getState
        );
      } catch (e) {
        dispatch({
          type: SAVE_TRANSCRIPT_EDITS_FAILURE,
          payload: {
            error: 'Failed to get vtn-standard transcript asset.'
          }
        });
        return;
      }
      const vtnStandardAssets = get(
        vtnStandardAssetsResponse,
        'temporalDataObject.assets.records',
        []
      );
      const vtnStandardAssetToUse = find(vtnStandardAssets, ['sourceData.engineId', selectedEngineId]);
      originalTranscriptAssetId = get(vtnStandardAssetToUse, 'id');

      if (!originalTranscriptAssetId) {
        // vtn-standard doesn't exist, try for v-vlf
        let vlfAssetsResponse;
        try {
          vlfAssetsResponse = await fetchAssets(
            tdoId,
            'v-vlf',
            dispatch,
            getState
          );
        } catch(e) {
          dispatch({
            type: SAVE_TRANSCRIPT_EDITS_FAILURE,
            payload: {
              error: 'Failed to get vlf transcript asset.'
            }
          });
          return;
        }
        const vlfAssets = get(
          vlfAssetsResponse,
          'temporalDataObject.assets.records',
          []
        );
        const vlfAssetToUse = find(vlfAssets, ['sourceData.engineId', selectedEngineId]);
        originalTranscriptAssetId = get(vlfAssetToUse, 'id');
      }

      if (!originalTranscriptAssetId) {
        // vlf doesn't exist, try for primary transcript (ttml)
        let getPrimaryTranscriptAssetResponse;
        try {
          getPrimaryTranscriptAssetResponse = await getPrimaryTranscriptAsset(
            tdoId,
            dispatch,
            getState
          );
        } catch (e) {
          dispatch({
            type: SAVE_TRANSCRIPT_EDITS_FAILURE,
            payload: {
              error: 'Failed to get primary ttml transcript asset.'
            }
          });
          return;
        }
        originalTranscriptAssetId = get(
          getPrimaryTranscriptAssetResponse,
          'temporalDataObject.primaryAsset.id'
        );
      }

      if (!originalTranscriptAssetId) {
        dispatch({
          type: SAVE_TRANSCRIPT_EDITS_FAILURE,
          payload: {
            error:
              'Original transcript asset not found. Failed to save bulk transcript edit.'
          }
        });
        return;
      }
      let runBulkEditResponse;
      try {
        runBulkEditResponse = await runBulkEditJob(
          tdoId,
          originalTranscriptAssetId,
          bulkEditTextAsset.id,
          selectedEngineId,
          dispatch,
          getState
        );
      } catch (e) {
        console.error(e);
        dispatch({
          type: SAVE_TRANSCRIPT_EDITS_FAILURE,
          payload: {
            error:
              'Failed to start bulk-edit-transcript job. Failed to save bulk transcript edit.'
          }
        });
        return;
      }
      dispatch(setShowTranscriptBulkEditSnackState(true));
      dispatch({
        type: SAVE_TRANSCRIPT_EDITS_SUCCESS
      });
      return Promise.resolve(runBulkEditResponse);
    } else {
      const assetData = currentData(getState());
      const createAssetCalls = [];
      const contentType = 'application/json';
      const type = 'vtn-standard';
      forEach(assetData, jsonData => {
        if (get(jsonData, 'series.length')) {
          forEach(jsonData.series, asset => {
            delete asset.guid;
          });
        }
        // process vtn-standard asset
        const sourceData = {
          name: jsonData.sourceEngineName,
          engineId: jsonData.sourceEngineId,
          assetId: jsonData.assetId,
          taskId: jsonData.taskId
        };
        createAssetCalls.push(
          saveAsset(
            {
              tdoId,
              contentType,
              type,
              sourceData,
              isUserEdited: true
            },
            jsonData,
            dispatch,
            getState
          )
        );
      });
      return await Promise.all(createAssetCalls)
        .then(values => {
          dispatch({
            type: SAVE_TRANSCRIPT_EDITS_SUCCESS
          });
          return values;
        })
        .catch(() => {
          dispatch({
            type: SAVE_TRANSCRIPT_EDITS_FAILURE,
            payload: {
              error: 'Failed to save transcript edits.'
            }
          });
        });
    }
  };
};
