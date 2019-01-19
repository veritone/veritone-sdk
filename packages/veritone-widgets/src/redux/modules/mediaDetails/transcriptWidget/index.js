import {
  get,
  isEqual,
  cloneDeep,
  forEach,
  find,
  isArray,
  pick,
  omit,
  orderBy
} from 'lodash';
import update from 'immutability-helper';
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
export const CLEAR_CURSOR_POSITION = transcriptNamespace + '_CLEAR_CURSOR_POSITION';
export const CLEAR_DATA = transcriptNamespace + '_CLEAR_DATA';
export const RECEIVE_DATA = transcriptNamespace + '_RECEIVE_DATA';
export const RECEIVE_SPEAKER_DATA = transcriptNamespace + '_RECEIVE_SPEAKER_DATA';
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

const initialState = {
  parsedData: {
    lazyLoading: true,
    snippetSegments: [],
    speakerSegments: []
  },
  data: [],
  history: [],
  revertedHistory: [],
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
    const editableData = get(state, 'editableParsedData.snippetSegments');
    const editableSpeakerData = get(state, 'editableParsedData.speakerSegments');
    let newEditableData = editableData;
    let newEditableSpeakerData = editableSpeakerData;

    const historyDiff = state.history.length
      ? state.history.slice(-1)[0]
      : undefined;

    if (!historyDiff) {
      return state;
    }

    const newState = revertHistoryDiff(state, historyDiff);
    newState.history = state.history.slice(0, state.history.length - 1);

    return newState;
  },

  [REDO](state, action) {
    const historyDiff = state.revertedHistory.length
      ? state.revertedHistory.slice(-1)[0]
      : undefined;
    const cursorPosition = action.cursorPosition;

    if (!historyDiff) {
      return state;
    }

    const newState = applyHistoryDiff(state, historyDiff, cursorPosition);
    newState.revertedHistory = state.revertedHistory.slice(0, state.revertedHistory.length - 1);
    return newState;
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
  [CLEAR_CURSOR_POSITION](state, action) {
    return {
      ...omit(state, ['cursorPosition'])
    };
  },
  [CHANGE](state, action) {
    const historyDiff = action.historyDiff;
    const cursorPosition = action.cursorPosition;

    const newState = applyHistoryDiff(state, historyDiff, cursorPosition);
    newState.revertedHistory = [];
    return newState;
  },

  [CLEAR_DATA](state, action) {
    return { ...state, data: [], past: [], future: [], present: null };
  },

  [RECEIVE_DATA](state, action) {
    const past = state.past;
    const { data } = action;

    // const oldData = (past && past.length > 0) ? past[0].toJS() : state.data;     // with immutable js
    const oldData = get(past, '[0]', state.data); // without immutable js

    if (isEqual(data, oldData)) {
      return { ...state };
    } else {
      const ignoredWords = ['!silence', '[noise]', '<noise>'];
      const filteredData = isArray(data) && data.map((chunk, chunkIndex) => {
        const series = isArray(chunk.series) && chunk.series.filter((entry, index) => {
          const words = get(entry, 'words', []);
          const orderedWords = orderBy(words, ['confidence'], ['desc']);
          const word = get(orderedWords, '[0].word');
          return word && ignoredWords.indexOf(word) === -1;
        });
        return {
          ...chunk,
          series
        };
      });

      const parsedData = parseData(filteredData, state.speakerData);
      return {
        ...state,
        data: filteredData,
        parsedData,
        editableParsedData: cloneDeep(parsedData)
      };
    }
  },
  [RECEIVE_SPEAKER_DATA](state, action) {
    const { speakerData } = action;
    const parsedData = parseData(state.data, speakerData);

    return {
      ...state,
      speakerData,
      parsedData,
      editableParsedData: cloneDeep(parsedData)
    };
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

function revertHistoryDiff(state, historyDiff) {
  const editableData = get(state, 'editableParsedData.snippetSegments');
  const editableSpeakerData = get(state, 'editableParsedData.speakerSegments');
  let newEditableData = editableData;
  let newEditableSpeakerData = editableSpeakerData;

  if (historyDiff) {
    isArray(historyDiff.transcriptChanges)
      && historyDiff.transcriptChanges.slice().reverse().forEach(diff => {
        const chunkToEdit = editableData[diff.chunkIndex];
        const action = diff.action;
        const guid = get(diff, 'oldValue.guid') || get(diff, 'newValue.guid');
        const oldValue = {
          ...chunkToEdit.series[diff.index],
          ...pick(diff.oldValue, ['guid', 'startTimeMs', 'stopTimeMs', 'words'])
        };
        switch (action) {
          case 'UPDATE': {
            newEditableData = update(newEditableData, {
              [diff.chunkIndex]: {
                series: {
                  [diff.index]: {
                    $set: oldValue
                  }
                },
                wordGuidMap: {
                  [guid]: {
                    serie: {
                      $set: oldValue
                    }
                  }
                }
              }
            });
            //Update speaker map if available
            isArray(newEditableSpeakerData)
              && newEditableSpeakerData.forEach((chunk, speakerChunkIndex) => {
                isArray(chunk.series)
                  && chunk.series.forEach((serie, speakerIndex) => {
                    const guidMatch = get(serie, ['wordGuidMap', guid]);
                    if (guidMatch) {
                      newEditableSpeakerData = update(newEditableSpeakerData, {
                        [speakerChunkIndex]: {
                          series: {
                            [speakerIndex]: {
                              fragments: {
                                [guidMatch.dialogueIndex]: {
                                  $set: {
                                    ...oldValue,
                                    ...pick(diff, ['index', 'chunkIndex'])
                                  }
                                }
                              },
                              wordGuidMap: {
                                [guid]: {
                                  serie: {
                                    $set: {
                                      ...oldValue,
                                      ...pick(diff, ['index', 'chunkIndex'])
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      });
                    }
                  });
              });
            break;
          }
          case 'DELETE': {
            const oldValue = {
              ...pick(diff.oldValue, ['guid', 'startTimeMs', 'stopTimeMs', 'words'])
            };
            newEditableData = update(newEditableData, {
              [diff.chunkIndex]: {
                series: { $splice: [[diff.index, 0, oldValue]] },
                wordGuidMap: {
                  [guid]: {
                    $set : {
                      ...oldValue,
                      ...pick(diff, ['chunkIndex', 'index'])
                    }
                  }
                }
              }
            });
            // Update map indices after splice
            const series = newEditableData[diff.chunkIndex].series;
            series.slice(diff.index - series.length).forEach((serie, index) => {
              newEditableData = update(newEditableData, {
                [diff.chunkIndex]: {
                  wordGuidMap: {
                    [serie.guid]: {
                      index: {
                        $set: diff.index + index
                      }
                    }
                  }
                }
              });
            });
            // Update speaker data if available
            newEditableSpeakerData = updateTrailingSpeakerData(newEditableSpeakerData, diff, false);
            break;
          }
          case 'INSERT': {
            newEditableData = update(newEditableData, {
              [diff.chunkIndex]: {
                series: { $splice: [[diff.index, 1]] },
                wordGuidMap: { $unset: [guid] }
              }
            });
            // Update map indices after splice
            const series = newEditableData[diff.chunkIndex].series;
            series.slice(diff.index - series.length).forEach((serie, index) => {
              newEditableData = update(newEditableData, {
                [diff.chunkIndex]: {
                  wordGuidMap: {
                    [serie.guid]: {
                      index: {
                        $set: diff.index + index
                      }
                    }
                  }
                }
              });
            });
            // Update speaker data if available
            newEditableSpeakerData = updateTrailingSpeakerData(newEditableSpeakerData, diff, true);
            break;
          }
        }
      });

    const totalTranscriptFragments = newEditableData.reduce((acc, chunk, chunkIndex) => 
      acc.concat(chunk.series.map((serie, index) => ({ ...serie, index, chunkIndex }))),
      []
    );
    // TODO
    isArray(historyDiff.speakerChanges)
      && historyDiff.speakerChanges.slice().reverse().forEach(diff => {
        const action = diff.action;
        switch (action) {
          case 'UPDATE': {
            const newFragments = totalTranscriptFragments.filter(frag => 
              frag.startTimeMs >= diff.oldValue.startTimeMs
                && frag.stopTimeMs <= diff.oldValue.stopTimeMs
            );
            const newMap = {};
            newFragments.forEach((frag, dialogueIndex) => {
              if (frag.guid) {
                newMap[frag.guid] = {
                  ...pick(frag, ['index', 'chunkIndex']),
                  dialogueIndex,
                  speakerIndex: diff.index,
                  speakerChunkIndex: diff.chunkIndex,
                  speaker: diff.oldValue,
                  serie: frag
                }
              }
            });
            newEditableSpeakerData = update(newEditableSpeakerData, {
              [diff.chunkIndex]: {
                series: {
                  [diff.index]: {
                    $set: {
                      ...newEditableSpeakerData[diff.chunkIndex].series[diff.index],
                      ...diff.oldValue,
                      fragments: newFragments,
                      wordGuidMap: newMap
                    }
                  } 
                }
              }
            });
            break;
          }
          case 'INSERT': {
            newEditableSpeakerData = update(newEditableSpeakerData, {
              [diff.chunkIndex]: {
                series: { $splice: [[diff.index, 1]] }
              }
            });
            break;
          }
          case 'DELETE': {
            const newFragments = totalTranscriptFragments.filter(frag =>
              frag.startTimeMs >= diff.oldValue.startTimeMs
                && frag.stopTimeMs <= diff.oldValue.stopTimeMs
            );
            const newMap = {};
            newFragments.forEach((frag, dialogueIndex) => {
              if (frag.guid) {
                newMap[frag.guid] = {
                  ...pick(frag, ['index', 'chunkIndex']),
                  dialogueIndex,
                  speakerIndex: diff.index,
                  speakerChunkIndex: diff.chunkIndex,
                  speaker: diff.oldValue,
                  serie: frag
                }
              }
            });
            newEditableSpeakerData = update(newEditableSpeakerData, {
              [diff.chunkIndex]: {
                series: { $splice: [[diff.index, 0, {
                  ...diff.oldValue,
                  fragments: newFragments,
                  wordGuidMap: newMap
                }]] }
              }
            });
            break;
          }
        }
      });
  }

  return {
    ...state,
    editableParsedData: {
      ...state.editableParsedData,
      snippetSegments: newEditableData,
      speakerSegments: newEditableSpeakerData
    },
    revertedHistory: state.revertedHistory.concat([historyDiff]),
    cursorPosition: historyDiff.cursorPosition
  };
}

function applyHistoryDiff(state, historyDiff, cursorPosition) {
  const editableData = get(state, 'editableParsedData.snippetSegments');
  const editableSpeakerData = get(state, 'editableParsedData.speakerSegments');
  let newEditableData = editableData;
  let newEditableSpeakerData = editableSpeakerData;
  if (historyDiff) {
    isArray(editableData)
      && isArray(historyDiff.transcriptChanges)
      && historyDiff.transcriptChanges.forEach(diff => {
        const chunkToEdit = editableData[diff.chunkIndex];
        const action = diff.action;
        const guid = get(diff, 'oldValue.guid') || get(diff, 'newValue.guid');
        switch (action) {
          // Checked
          case 'UPDATE': {
            const setValue = {
              ...chunkToEdit.series[diff.index],
              ...pick(diff.newValue, ['guid', 'startTimeMs', 'stopTimeMs', 'words'])
            };
            newEditableData = update(newEditableData, {
              [diff.chunkIndex]: {
                series: {
                  [diff.index]: {
                    $set: setValue
                  }
                },
                wordGuidMap: {
                  [guid]: {
                    serie: {
                      $set: setValue
                    }
                  }
                }
              }
            });
            //Update speaker map if available
            isArray(newEditableSpeakerData)
              && newEditableSpeakerData.forEach((chunk, speakerChunkIndex) => {
                isArray(chunk.series)
                  && chunk.series.forEach((serie, speakerIndex) => {
                    const guidMatch = get(serie, ['wordGuidMap', guid]);
                    if (guidMatch) {
                      newEditableSpeakerData = update(newEditableSpeakerData, {
                        [speakerChunkIndex]: {
                          series: {
                            [speakerIndex]: {
                              fragments: {
                                [guidMatch.dialogueIndex]: {
                                  $set: {
                                    ...setValue,
                                    ...pick(diff, ['index', 'chunkIndex'])
                                  }
                                }
                              },
                              wordGuidMap: {
                                [guid]: {
                                  serie: {
                                    $set: {
                                      ...setValue,
                                      ...pick(diff, ['index', 'chunkIndex'])
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      });
                    }
                  });
              });
            break;
          }
          case 'DELETE': {
            newEditableData = update(newEditableData, {
              [diff.chunkIndex]: {
                series: { $splice: [[diff.index, 1]] },
                wordGuidMap: { $unset: [guid] }
              }
            });
            // Update map indices after splice
            const series = newEditableData[diff.chunkIndex].series;
            series.slice(diff.index - series.length).forEach((serie, index) => {
              newEditableData = update(newEditableData, {
                [diff.chunkIndex]: {
                  wordGuidMap: {
                    [serie.guid]: {
                      index: {
                        $set: diff.index + index
                      }
                    }
                  }
                }
              });
            });
            //Update speaker map if available
            newEditableSpeakerData = updateTrailingSpeakerData(newEditableSpeakerData, diff, true);
            break;
          }
          case 'INSERT': {
            const newValue = {
              ...pick(diff.newValue, ['guid', 'startTimeMs', 'stopTimeMs', 'words'])
            };
            newEditableData = update(newEditableData, {
              [diff.chunkIndex]: {
                series: { $splice: [[diff.index, 0, newValue]] },
                wordGuidMap: {
                  [guid]: {
                    $set : {
                      ...newValue,
                      ...pick(diff, ['chunkIndex', 'index'])
                    }
                  }
                }
              }
            });
            // Update map indices after splice
            const series = newEditableData[diff.chunkIndex].series;
            series.slice(diff.index - series.length).forEach((serie, index) => {
              newEditableData = update(newEditableData, {
                [diff.chunkIndex]: {
                  wordGuidMap: {
                    [serie.guid]: {
                      index: {
                        $set: diff.index + index
                      }
                    }
                  }
                }
              });
            });
            newEditableSpeakerData = updateTrailingSpeakerData(newEditableSpeakerData, diff, false);
            break;
          }
        }
      });

    const totalTranscriptFragments = newEditableData.reduce((acc, chunk, chunkIndex) => 
      acc.concat(chunk.series.map((serie, index) => ({ ...serie, index, chunkIndex }))),
      []
    );

    isArray(newEditableSpeakerData)
      && isArray(historyDiff.speakerChanges)
      && historyDiff.speakerChanges.forEach(diff => {
        const action = diff.action;
        switch (action) {
          case 'UPDATE': {
            const newFragments = totalTranscriptFragments.filter(frag => 
              frag.startTimeMs >= diff.newValue.startTimeMs
                && frag.stopTimeMs <= diff.newValue.stopTimeMs
            );
            const newMap = {};
            newFragments.forEach((frag, dialogueIndex) => {
              if (frag.guid) {
                newMap[frag.guid] = {
                  ...pick(frag, ['index', 'chunkIndex']),
                  dialogueIndex,
                  speakerIndex: diff.index,
                  speakerChunkIndex: diff.chunkIndex,
                  speaker: diff.newValue,
                  serie: frag
                }
              }
            });
            newEditableSpeakerData = update(newEditableSpeakerData, {
              [diff.chunkIndex]: {
                series: {
                  [diff.index]: {
                    $set: {
                      ...newEditableSpeakerData[diff.chunkIndex].series[diff.index],
                      ...diff.newValue,
                      // Update the fragments it contains (this can be optimized)
                      fragments: newFragments,
                      wordGuidMap: newMap
                    }
                  } 
                }
              }
            });
            break;
          }
          case 'INSERT': {
            const newFragments = totalTranscriptFragments.filter(frag =>
              frag.startTimeMs >= diff.newValue.startTimeMs
                && frag.stopTimeMs <= diff.newValue.stopTimeMs
            );
            const newMap = {};
            newFragments.forEach((frag, dialogueIndex) => {
              if (frag.guid) {
                newMap[frag.guid] = {
                  ...pick(frag, ['index', 'chunkIndex']),
                  dialogueIndex,
                  speakerIndex: diff.index,
                  speakerChunkIndex: diff.chunkIndex,
                  speaker: diff.newValue,
                  serie: frag
                }
              }
            });
            newEditableSpeakerData = update(newEditableSpeakerData, {
              [diff.chunkIndex]: {
                series: { $splice: [[diff.index, 0, {
                  ...diff.newValue,
                  // Update the fragments it contains
                  fragments: newFragments,
                  wordGuidMap: newMap
                }]] }
              }
            });
            break;
          }
          case 'DELETE': {
            newEditableSpeakerData = update(newEditableSpeakerData, {
              [diff.chunkIndex]: {
                series: { $splice: [[diff.index, 1]] }
              }
            });
            break;
          }
        }
      });

    historyDiff.cursorPosition = cursorPosition;
  }

  return {
    ...state,
    editableParsedData: {
      ...state.editableParsedData,
      snippetSegments: newEditableData,
      speakerSegments: newEditableSpeakerData
    },
    history: state.history.concat([historyDiff]),
    cursorPosition
  }
}

// This returns the immutability helper version of
// newEditableSpeakerData after a fragment insert/deletion 
function updateTrailingSpeakerData(newEditableSpeakerData, diff, isRemove) {
  const guid = get(diff, 'oldValue.guid') || get(diff, 'newValue.guid');
  const fragmentValue = isRemove
    ? (diff.oldValue || diff.newValue )
    : (diff.newValue || diff.oldValue );
  let wasUpdated = false;
  isArray(newEditableSpeakerData)
    && newEditableSpeakerData.forEach((chunk, speakerChunkIndex) => {
      isArray(chunk.series)
        && chunk.series.forEach((serie, speakerIndex) => {
          if (
            !wasUpdated
              && diff.speakerChunkIndex === speakerChunkIndex
              && diff.speakerIndex === speakerIndex
          ) {
            const fragmentCommand = isRemove
              ? [diff.dialogueIndex, 1]
              : [diff.dialogueIndex, 0, {
                ...pick(diff, ['index', 'chunkIndex']),
                ...fragmentValue,
              }]
            const mapCommand = isRemove
              ? { $unset: [fragmentValue.guid]}
              : {
                [fragmentValue.guid]: { $set: {
                  serie: fragmentValue,
                  speaker: serie,
                  ...pick(diff, ['speakerIndex', 'speakerChunkIndex', 'index', 'chunkIndex', 'dialogueIndex'])
                }}
              }
            newEditableSpeakerData = update(newEditableSpeakerData, {
              [speakerChunkIndex]: {
                series: {
                  [speakerIndex]: {
                    fragments: {
                      $splice: [fragmentCommand]
                    },
                    wordGuidMap: mapCommand
                  }
                }
              }
            });
            const newFragments = get(
              newEditableSpeakerData,
              [
                speakerChunkIndex,
                'series',
                speakerIndex,
                'fragments'
              ],
              []
            );
            newFragments.slice(diff.dialogueIndex, newFragments.length).forEach((frag, index) => {
              newEditableSpeakerData = update(newEditableSpeakerData, {
                [speakerChunkIndex]: {
                  series: {
                    [speakerIndex]: {
                      fragments: {
                        [diff.index + index]: {
                          index: { $set: diff.index + index}
                        }
                      },
                      wordGuidMap: {
                        [frag.guid]: {
                          dialogueIndex: { $set: diff.dialogueIndex + index },
                          index: { $set: diff.index + index }
                        }
                      }
                    }
                  }
                }
              })
            });
            wasUpdated = true;
          } else if (wasUpdated) {
            // Update indices in the speakers further down
            const fragments = get(
              newEditableSpeakerData,
              [
                speakerChunkIndex,
                'series',
                speakerIndex,
                'fragments'
              ],
              []
            );
            const indexDifference = isRemove
              ? (-1)
              : 1;
            fragments.forEach((frag, dialogueIndex) => {
              newEditableSpeakerData = update(newEditableSpeakerData, {
                [speakerChunkIndex]: {
                  series : {
                    [speakerIndex]: {
                      fragments: {
                        [dialogueIndex]: {
                          index: { $set: frag.index + indexDifference }
                        }
                      },
                      wordGuidMap: {
                        [frag.guid]: {
                          index: { $set: frag.index + indexDifference }
                        }
                      }
                    }
                  }
                }
              });
            });
          }
        });
    });

  return newEditableSpeakerData
}

export default transcriptReducer;
export const undo = () => ({ type: UNDO });
export const redo = () => ({ type: REDO });
export const reset = () => ({ type: RESET });
export const clearCursorPosition = () => ({ type: CLEAR_CURSOR_POSITION });
export const change = newData => ({ type: CHANGE, data: newData });
export const clearData = () => ({ type: CLEAR_DATA });
export const receiveData = newData => ({ type: RECEIVE_DATA, data: newData });
export const receiveSpeakerData = newSpeakerData => (
  {
    type: RECEIVE_SPEAKER_DATA,
    speakerData: newSpeakerData
  }
);
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
export const parsedData = state => get(local(state), 'parsedData');
export const editableParsedData = state => get(local(state), 'editableParsedData');
export const editableSpeakerData = state => get(local(state), 'editableSpeakerData');
export const cursorPosition = state => get(local(state), 'cursorPosition');
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

function parseData(data, speakerData) {
  const snippetSegments = [];
  const speakerSegments = [];
  let totalTranscriptFragments = [];

  let lazyLoading = true;
  isArray(data) && data.forEach((chunk, chunkIndex) => {
    const series = chunk.series;
    if (series && series.length > 0) {
      const snippetStartTime = series[0].startTimeMs;
      const snippetStopTime = series.slice(-1)[0].stopTimeMs;
      const wordGuidMap = series.reduce((acc, snippet, index) => {
        if (snippet.guid) {
          acc[snippet.guid] = {
            chunkIndex,
            index,
            serie: snippet
          };
        }
        return acc;
      }, {});

      snippetSegments.push({
        ...chunk,
        startTimeMs: snippetStartTime,
        stopTimeMs: snippetStopTime,
        series,
        wordGuidMap
      });

      totalTranscriptFragments = totalTranscriptFragments.concat(series.map((serie, index) => {
        return {
          ...serie,
          chunkIndex,
          index
        }
      }));
    }
  });

  // Speaker Data
  isArray(speakerData) && speakerData.forEach((chunk, speakerChunkIndex) => {
    const series = chunk.series;
    const segmentStartTime = series[0].startTimeMs;
    const segmentStopTime = series.slice(-1)[0].stopTimeMs;
    const speakerSegment = {
      ...chunk,
      startTimeMs: segmentStartTime,
      stopTimeMs: segmentStopTime,
      series: []
    };

    isArray(series) && series.forEach((speaker, speakerIndex) => {
      const nextSpeaker = chunk.series[speakerIndex + 1];
      const speakerStartTime = speaker.startTimeMs;
      const speakerStopTime = speaker.stopTimeMs;
      const { fragments, wordGuidMap } = allocateSpeakerTranscripts(
        totalTranscriptFragments,
        speaker,
        nextSpeaker,
        speakerIndex,
        speakerChunkIndex
      );

      speakerSegment.series.push({
        ...speaker,
        fragments,
        wordGuidMap
      });
    });

    speakerSegments.push(speakerSegment);
  });

  return {
    lazyLoading,
    snippetSegments,
    speakerSegments
  };

  // totalTranscriptFragments will be mutated. This function picks off the first element
  // and allocates it to a speakers' fragments
  function allocateSpeakerTranscripts(
    totalTranscriptFragments,
    currentSpeaker,
    nextSpeaker,
    speakerIndex,
    speakerChunkIndex
  ) {
    const speakerStartTime = currentSpeaker.startTimeMs;
    const speakerStopTime = currentSpeaker.stopTimeMs;
    const fragments = [];
    const wordGuidMap = {};
    while (isArray(totalTranscriptFragments) && totalTranscriptFragments.length) {
      const currentSnippet = totalTranscriptFragments[0];
      // Allocate to current speaker if:
      if (
        // the snippet starts within speaker interval
        ( speakerStartTime <= currentSnippet.startTimeMs
          && currentSnippet.startTimeMs < speakerStopTime
        ) || 
        // Snippet startTimeMs did not fall into the previous AND current speakers aperture
        // Gotta do something with this snippet, so add it to the current speaker
        currentSnippet.startTimeMs < speakerStartTime ||
        // there are no more speakers then shove it into the current speaker
        !nextSpeaker
      ) {
        const fragment = totalTranscriptFragments.shift();
        fragments.push(fragment);
        wordGuidMap[fragment.guid] = {
          chunkIndex: fragment.chunkIndex,
          dialogueIndex: fragment.index - fragments[0].index,
          index: fragment.index,
          serie: fragment,
          speakerIndex,
          speaker: pick(currentSpeaker, ['guid', 'startTimeMs', 'stopTimeMs', 'speakerId']),
          speakerChunkIndex
        }
      } else {
        // There is a next speaker and the current snippet does belong to the next speaker
        break;
      }
    }
    return {
      fragments,
      wordGuidMap
    };
  }
}