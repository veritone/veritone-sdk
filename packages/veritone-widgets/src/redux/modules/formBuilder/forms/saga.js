import { call, put, fork, takeLatest, select, all } from 'redux-saga/effects';
import { helper } from '../../shared';

const forms = [
  {
    id: '1',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '2',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '3',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '4',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '5',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '6',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '7',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '8',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '9',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '10',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '11',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '12',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '13',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '14',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '15',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '16',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '17',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '18',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '19',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '20',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '21',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '22',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '23',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '24',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '25',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '26',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '27',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '28',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '29',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '30',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '31',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '32',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '33',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '34',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '35',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '36',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '37',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '38',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '39',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z'
  }
];

import {
  REQUEST_CREATE_FORM,
  REQUEST_DELETE_FORM,
  REQUEST_UPDATE_FORM,
  REQUESTS_FORM,
  REQUEST_FORM,
  requestCreateFormSuccess,
  requestCreateFormError,
  requestUpdateFormSuccess,
  requestUpdateFormError,
  requestFormsSuccess,
  requestFormsError,
  requestFormsStart,
  requestFormStart,
  requestFormSuccess,
  requestFormError,
  requestDeleteFormSuccess,
  requestDeleteFormError
} from './';

function* requestFormSaga() {
  yield takeLatest(REQUESTS_FORM, function* fetchForm() {

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
