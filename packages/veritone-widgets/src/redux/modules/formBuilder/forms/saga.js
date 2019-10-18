import { call, put, fork, takeLatest, select, all } from 'redux-saga/effects';
import { helper } from '../../shared';
import { formSelector } from './selector';

import {
  REQUEST_CREATE_FORM,
  REQUEST_DELETE_FORM,
  REQUEST_UPDATE_FORM,
  REQUEST_FORM,
  requestCreateFormSuccess,
  requestCreateFormError,
  requestUpdateFormSuccess,
  requestUpdateFormError,
  requestFormSuccess,
  requestFormError,
  requestDeleteFormSuccess,
  requestDeleteFormError
} from './';

function* requestFormSaga() {
  yield takeLatest(REQUEST_FORM, function* fetchForm() {
    const { forms, templates, loading } = yield select(formSelector);

  })
}

function* createFormSaga() {
  yield takeLatest(REQUEST_CREATE_FORM, function* createForm() {

  })
}

function* deleteFormSaga() {
  yield takeLatest(REQUEST_DELETE_FORM, function* deleteForm() {

  })
}

function* updateFormSaga() {
  yield takeLatest(REQUEST_UPDATE_FORM, function* updateForm() {

  })
}

export function* formSaga() {
  yield all([
    fork(requestFormSaga),
    fork(createFormSaga),
    fork(deleteFormSaga),
    fork(updateFormSaga)
  ])
}
