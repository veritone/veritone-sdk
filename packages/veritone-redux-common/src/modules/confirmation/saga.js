import { take, put, takeEvery, fork, race, all } from 'redux-saga/effects';

import * as module from './'; // eslint-disable-line

export function* handleConfirmAction({
  payload: { wrappedAction, ...kwargs },
  meta: { id }
}) {
  yield put(
    module._showConfirmationDialog({
      ...kwargs,
      id
    })
  );

  // confirmationDialog view either dispatches
  // APPROVE_CONFIRM_ACTION or CANCEL_CONFIRM_ACTION
  // from user click

  const { confirm } = yield race({
    confirm: take(
      action =>
        action.type === module.APPROVE_CONFIRM_ACTION && action.meta.id === id
    ),

    cancel: take(
      action =>
        action.type === module.CANCEL_CONFIRM_ACTION && action.meta.id === id
    )
  });

  if (confirm) {
    yield put(wrappedAction);
  }
}

function* watchConfirmAction() {
  yield takeEvery(module.CONFIRM, handleConfirmAction);
}

export default function* root() {
  yield all([fork(watchConfirmAction)]);
}
