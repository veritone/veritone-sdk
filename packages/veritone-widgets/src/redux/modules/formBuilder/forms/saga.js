import { delay } from 'redux-saga';
import { call, put, fork, takeLatest, select, all } from 'redux-saga/effects';
import { helper } from '../../shared';

import {
  REQUEST_CREATE_FORM,
  REQUEST_DELETE_FORM,
  REQUEST_UPDATE_FORM,
  REQUEST_FORMS,
  requestCreateFormSuccess,
  requestCreateFormError,
  requestUpdateFormSuccess,
  requestUpdateFormError,
  requestFormsSuccess,
  requestFormsError,
  requestFormsStart,
  requestDeleteFormSuccess,
  requestDeleteFormError,
  requestDeleteFormStart,
  requestCreateFormStart,
  requestUpdateForm,
} from './';

function* requestFormSaga() {
  yield takeLatest(REQUEST_FORMS, function* fetchForm() {
    yield put(requestFormsStart());
    const query = `query forms() {
      forms() {
        records {
          id
          name
          description
        }
      }
    }`;

    const { error, response } = yield call(
      helper.handleRequest, { query, variables: {} }
    );

    if (error) {
      return yield put(requestFormsError(error));
    }
    yield put(requestFormsSuccess(response.data.records));
  })
}

function* createFormSaga() {
  yield takeLatest(REQUEST_CREATE_FORM, function* createForm(action) {
    yield put(requestCreateFormStart());
    const query = `mutation createForm($form: FormInput) {
      createForm(input: form) {
        id
        name
      }
    }`;

    const { error, response } = yield call(
      helper.handleRequest, { query, variables: {
        form: action.payload.form
      }}
    );

    if (error) {
      return yield put(requestCreateFormError(error));
    }
    yield put(requestCreateFormSuccess(response.data));
  })
}

function* deleteFormSaga() {
  yield takeLatest(REQUEST_DELETE_FORM, function* deleteForm(action) {
    yield put(requestDeleteFormStart());
    const query = `mutation deleteForm($id: ID!) {
      deleteForm(id: id) {
        id
      }
    }`;

    const { error, response } = yield call(
      helper.handleRequest, { query, variables: {
        id: action.payload.form.id
      }}
    );

    if (error) {
      return yield put(requestDeleteFormError(error));
    }

    yield put(requestDeleteFormSuccess(response.data));
  });
}

function* updateFormSaga() {
  yield takeLatest(REQUEST_UPDATE_FORM, function* updateForm(action) {
    yield put(requestUpdateForm());
    const query = `mutation updateForm($form: FormInput) {
      updateForm(input: form) {
        id
        name
      }
    }`;

    const { error, response } = yield call(
      helper.handleRequest, { query, variables: {
        form: action.payload.form
      }}
    );

    if (error) {
      return yield put(requestUpdateFormError(error));
    }
    yield put(requestUpdateFormSuccess(response.data));
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
