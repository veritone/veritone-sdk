import { get, isEqual } from 'lodash';
import { delay } from 'redux-saga';
import { fork, all, call, put, takeEvery, select } from 'redux-saga/effects';
import * as TranscriptRedux from '.';
import { DISCARD_UNSAVED_CHANGES } from '../index';

const CHANGE_WITH_DEBOUNCE =
  TranscriptRedux.transcriptNamespace + '_CHANGE_WITH_DEBOUNCE';

function* getState() {
  const globalState = yield select();
  return get(globalState, TranscriptRedux.transcriptNamespace);
}

function* watchContentUndo() {
  yield takeEvery(action => action.type === TranscriptRedux.UNDO, function*(
    action
  ) {
    yield call(TranscriptRedux.undo);

    const state = getState();
    const past = get(state, 'past');
    if (state && past.length === 0) {
      yield put({
        type: TranscriptRedux.UPDATE_EDIT_STATUS,
        hasUserEdits: false
      });
    }
  });
}

function* watchContentRedo() {
  yield takeEvery(action => action.type === TranscriptRedux.REDO, function*(
    action
  ) {
    yield call(TranscriptRedux.redo);
    yield put({ type: TranscriptRedux.UPDATE_EDIT_STATUS, hasUserEdits: true });
  });
}

function* watchContentReset() {
  yield takeEvery(action => action.type === TranscriptRedux.RESET, function*(
    action
  ) {
    yield call(TranscriptRedux.reset);
    yield put({
      type: TranscriptRedux.UPDATE_EDIT_STATUS,
      hasUserEdits: false
    });
  });
}

let unsavedData;
const deferTime = 500;
function* pushChanges() {
  if (unsavedData) {
    yield put({
      type: TranscriptRedux.CHANGE,
      data: unsavedData
    });
    unsavedData = undefined;
  }
}

function* watchContentChange() {
  yield takeEvery(action => action.type === CHANGE_WITH_DEBOUNCE, function*(
    action
  ) {
    yield put({
      type: TranscriptRedux.UPDATE_EDIT_STATUS,
      hasUserEdits: true
    });

    unsavedData = action.data;
    if (action.data.onBlur) {
      yield call(pushChanges);
    } else {
      yield call(function*() {
        yield call(delay, deferTime);
        yield call(pushChanges);
      }, action);
    }
  });
}

function* watchContentClearData() {
  yield takeEvery(
    action => action.type === TranscriptRedux.CLEAR_DATA,
    function*(action) {
      yield call(TranscriptRedux.clearData);
      yield put({
        type: TranscriptRedux.UPDATE_EDIT_STATUS,
        hasUserEdits: false
      });
    }
  );
}

function* watchContentReceiveData() {
  yield takeEvery(
    action => action.type === TranscriptRedux.RECEIVE_DATA,
    function*(action) {
      const currentData = yield select(TranscriptRedux.currentData);
      if (!isEqual(currentData, action.data)) {
        yield call(TranscriptRedux.receiveData);
        yield put({
          type: TranscriptRedux.UPDATE_EDIT_STATUS,
          hasUserEdits: true
        });
      }
    }
  );
}

function* watchDiscardUnsavedChanges() {
  yield takeEvery(DISCARD_UNSAVED_CHANGES, function*(action) {
    yield call(TranscriptRedux.reset);
  });
}

export const changeWidthDebounce = newData => ({
  data: newData,
  type: CHANGE_WITH_DEBOUNCE
});

export default function* transcriptSaga() {
  yield all([
    fork(watchContentUndo),
    fork(watchContentRedo),
    fork(watchContentReset),
    fork(watchContentChange),
    fork(watchContentClearData),
    fork(watchContentReceiveData),
    fork(watchDiscardUnsavedChanges)
  ]);
}
