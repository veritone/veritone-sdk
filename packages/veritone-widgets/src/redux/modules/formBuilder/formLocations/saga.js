import { takeLatest, put, call } from 'redux-saga/effects';
import { helper } from '../../shared';

import {
  REQUEST_FORM_LOCATIONS,
  requestFormLocationsStart,
  requestFormLocationsSuccess,
  requestFormLocationsError
} from './';

export function* formLocationsSaga() {
  yield takeLatest(REQUEST_FORM_LOCATIONS, function* fetchFormLocations() {
    yield put(requestFormLocationsStart());
    const query = `query formLocations(){
      formLocations() {
        records {
          id
          name
          description
        }
      }
    }`
    const { error, response } = yield call(
      helper.handleRequest, { query, variables: {} }
    );

    if (error) {
      return yield put(requestFormLocationsError(error));
    }

    yield put(requestFormLocationsSuccess(response.data.records));
  })
}
