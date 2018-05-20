import { get, isEqual } from 'lodash';
import { fromJS } from 'immutable';

import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const transcriptNamespace = 'veritoneTranscriptWidget';
const UNDO = transcriptNamespace + '_UNDO';
const REDO = transcriptNamespace + '_REDO';
const RESET = transcriptNamespace + '_RESET';
const CHANGE = transcriptNamespace + '_CHANGE';
const CLEAR_DATA = transcriptNamespace + '_CLEAR_DATA';
const RECEIVE_DATA = transcriptNamespace + '_RECEIVE_DATA';

const maxHistorySize = 1000;  // Only alow user to undo 1000 times
const initialState = {
  data: [],
  past: [],
  future: [],
  present: null,
  selectedEngineId: '',
  mediaLengthMs: -1,
};

const transcriptReducer = createReducer(initialState, {
  [UNDO](state, action) {
    const newPast = state.pass || [];
    const newFuture = state.future || [];
    let newCurrentData = state.data || [];
    let newPresent;

    if (newPast.length > 0) {
      newPresent = newPast.pop();
      newCurrentData = newPresent.toJS();
      state.present && newFuture.push(state.present);
    } else {
      newPresent = fromJS(state.data);
    }
    
    return {...state, data: newCurrentData, past: newPast, future: newFuture, present: newPresent};
  },

  [REDO](state, action) {
    const newPast = state.pass || [];
    const newFuture = state.future || [];
    let newCurrentData = state.data || [];
    let newPresent;

    if (newFuture.length > 0) {
      newPresent = newFuture.pop();
      newCurrentData = newPresent.toJS();
      state.present && newPast.push(state.present);
    } else {
      newPresent = fromJS(state.data);
    }

    return {...state, data: newCurrentData, past: newPast, future: newFuture, present: newPresent};
  },

  [RESET](state, action) {
    const past = state.past || [];
    let initialData;
    let initialPresent;
    if (past.length > 0) {
      initialPresent = past[0];
      initialData = initialPresent.toJS();
    } else {
      initialData = state.data;
      initialPresent = state.present
    }
    
    return {...state, data: initialData, past: [], future: [], present: initialPresent};
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
    return {...state, data: [], past: [], future: [], present: null};
  },

  [RECEIVE_DATA](state, action) {
    const past = state.past;
    const newData = action.data;
    const oldData = (past && past.length > 0) ? past[0].toJS() : state.data;
    if (isEqual(newData, oldData)) {      //Compare new received data with the prev received data
      return { ...state };
    } else {
      const present = fromJS(newData);
      return {...state, data: newData, past:[], future:[], present: present};
    }
  }
});


function handleBulkEdit (state, action) {
  const changedData = action.data.newValue;
  const newData = [{
    series:[{
      startTimeMs: changedData.startTimeMs,
      stopTimeMs: changedData.stopTimeMs,
      words: [{
        word: changedData.value,
        confidence: 1
      }]
    }]
  }];

  const newPast = state.past || [];
  const prevPresent = state.present;
  newPast.push(prevPresent);
  const newPresent = fromJS(newData);
  return {...state, data:newData, past: newPast, future: [], present: newPresent};
}

function handleSnippetEdit (state, action) {
  const newPast = state.past || [];
  const prevPresent = state.present;
  
  const changedData = action.data.newValue;
  const targetData = action.data.originalValue;
  const initialPresent = (newPast.length > 0) ? newPast[0] : prevPresent;

  let entryIndex = -1;
  let isNoContent = false;
  const chunkIndex = initialPresent.findIndex(chunk => {
    const series = chunk.get('series');
    entryIndex = series.findIndex(entry => {
      const orgStartTime = entry.get('startTimeMs');
      const orgStopTime = entry.get('stopTimeMs');
      const orgWords = entry.get('words');
      
      if (targetData.startTimeMs === orgStartTime && targetData.stopTimeMs === orgStopTime) {
        if (!orgWords) {
          isNoContent = !targetData.value;
          return isNoContent;
        } else {
          // sort word options base on confidence
          const sortedWords = orgWords.sort((first, second) => 
            first.get('confidence') < second.get('confidence')
          );

          const orgValues = sortedWords.first().get('word');
          return orgValues === targetData.value;
        }
      }

      return false;
    });
    return entryIndex >= 0;
  });

  if (chunkIndex >= 0 && entryIndex >= 0) {
    (newPast.length > maxHistorySize) && newPast.splice(1, 0);  // skip index 0 since it's the initial value

    newPast.push(prevPresent);
    let newPresent;
    if (isNoContent) {
      const newSnippet = {
        startTimeMs: changedData.startTimeMs,
        stopTimeMs: changedData.stopTimeMs,
        words: [{
          word: changedData.value,
          confidence: 1
        }] 
      };
      newPresent = prevPresent.setIn([chunkIndex, 'series', entryIndex], newSnippet);
    } else {
      // '0' is the word with highest confidence
      newPresent = prevPresent.setIn([chunkIndex, 'series', entryIndex, 'words', 0, 'word'], changedData.value);    
    }

    const newData = newPresent.toJS();
    return {...state, data: newData, past: newPast, future: [], present: newPresent};
  } else {
    return {...state};
  }
}

export default transcriptReducer;
export const undo = () => ({ type: UNDO });
export const redo = () => ({ type: REDO });
export const reset = () => ({ type: RESET });
export const change = newData => ({type: CHANGE, data: newData});
export const clearData = () => ({type: CLEAR_DATA});
export const receiveData = newData => ({type: RECEIVE_DATA, data: newData});
export const currentData = state => get(state[transcriptNamespace], 'data');
export const hasChanged = state => {
  const history = get(state[transcriptNamespace], 'past');
  return history && history.length > 0;
};
