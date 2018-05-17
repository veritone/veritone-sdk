import { helpers } from 'veritone-redux-common';
const { createReducer } = helpers;

export const namespace = 'veritoneTranscriptWidget';

const UNDO = 'veritone/TranscriptWidget/Edit/Undo';
const REDO = 'veritone/TranscriptWidget/Edit/Redo';
const CHANGE = 'veritone/TranscriptWidget/Edit/Change';
const RECEIVE_DATA = 'veritone/TranscriptWidget/Read/ReceiveData';

const initialState = {
  
};

const reducer = createReducer(initialState, {
  [UNDO](state, action) {
    return {};
  },
  [REDO](state, action) {
    return {};
  },
  [CHANGE](state, action) {
    return {};
  },
  [RECEIVE_DATA](state, action) {

  }
});

export default reducer;
