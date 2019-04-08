import { isEqual } from 'lodash';
import {
  fork,
  all,
  call,
  put,
  takeEvery,
  select,
  takeLatest
} from 'redux-saga/effects';
import * as TranscriptRedux from '.';
import { DISCARD_UNSAVED_CHANGES, CANCEL_EDIT } from '../index';

const CHANGE_WITH_DEBOUNCE =
  TranscriptRedux.transcriptNamespace + '_CHANGE_WITH_DEBOUNCE';

function* watchContentUndo() {
  yield takeEvery(action => action.type === TranscriptRedux.UNDO, function*(
    action
  ) {
    yield call(TranscriptRedux.undo);
  });
}

function* watchContentRedo() {
  yield takeEvery(action => action.type === TranscriptRedux.REDO, function*(
    action
  ) {
    yield call(TranscriptRedux.redo);
  });
}

function* watchContentReset() {
  yield takeEvery(action => action.type === TranscriptRedux.RESET, function*(
    action
  ) {
    yield call(TranscriptRedux.reset);
    yield put({
      type: TranscriptRedux.UPDATE_EDIT_STATUS
    });
  });
}

function* watchContentChange() {
  yield takeEvery(action => action.type === CHANGE_WITH_DEBOUNCE, function*(
    action
  ) {
    yield put({
      type: TranscriptRedux.CHANGE,
      historyDiff: action.data,
      cursorPosition: action.cursorPosition
    });
  });
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

function* watchMediaDetailCancelEdit() {
  yield takeLatest([CANCEL_EDIT], function*() {
    const pendingUserEdits = yield select(TranscriptRedux.hasUserEdits);
    if (pendingUserEdits) {
      yield put(TranscriptRedux.openConfirmationDialog('saveEdits'));
    } else {
      yield put(TranscriptRedux.toggleEditMode());
    }
  });
}

export const changeWidthDebounce = (newData, cursorPosition) => ({
  cursorPosition,
  data: newData,
  type: CHANGE_WITH_DEBOUNCE
});

export default function* transcriptSaga() {
  yield all([
    fork(watchContentUndo),
    fork(watchContentRedo),
    fork(watchContentReset),
    fork(watchContentChange),
    fork(watchContentReceiveData),
    fork(watchDiscardUnsavedChanges),
    fork(watchMediaDetailCancelEdit)
  ]);
}
