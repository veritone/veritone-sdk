import { all, fork, takeLatest, put } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
const {
  user: {
    RESET_USER_PASSWORD_SUCCESS,
    RESET_USER_PASSWORD_FAILURE,
    UPDATE_CURRENT_USER_PROFILE_SUCCESS,
    UPDATE_CURRENT_USER_PROFILE_FAILURE
  }
} = modules;

import { showNotification } from '../notifications';

function* handleChangeUser({ error }) {
  if (error) {
    yield put(showNotification('Unable to update user; please try again.'));
    return;
  }

  yield put(showNotification('User was updated successfully.'));
}

function* handleResetPassword({ error }) {
  if (error) {
    yield put(showNotification('Password reset failed. Please try again.'));
  } else {
    yield put(showNotification('Password reset email was sent.'));
  }
}

export function* watchResetPassword() {
  yield takeLatest(
    [RESET_USER_PASSWORD_SUCCESS, RESET_USER_PASSWORD_FAILURE],
    handleResetPassword
  );
}

export function* watchChangeUser() {
  yield takeLatest(
    [UPDATE_CURRENT_USER_PROFILE_SUCCESS, UPDATE_CURRENT_USER_PROFILE_FAILURE],
    handleChangeUser
  );
}

export default function* root() {
  yield all([fork(watchResetPassword), fork(watchChangeUser)]);
}
