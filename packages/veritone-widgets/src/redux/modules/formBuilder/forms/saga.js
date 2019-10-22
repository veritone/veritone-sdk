import { delay } from 'redux-saga';
import { call, put, fork, takeLatest, select, all } from 'redux-saga/effects';
import { helper } from '../../shared';

const formDefinitions = [
  {
    name: 'textInput-1234',
    type: 'textInput',
    instruction: 'Input the text value',
    required: true
  },
  {
    name: 'email',
    type: 'textInput',
    instruction: 'Input the email',
    required: true
  },
  {
    name: 'paragraph-2345',
    type: 'paragraph',
    value: '<div>hello world</div>',
    instruction: 'Input biography',
    error: ''
  },
  {
    name: 'checkBox-3456',
    type: 'checkBox',
    items: [
      {
        value: 'option 1',
        id: '1'
      },
      {
        value: 'option 2',
        id: '2'
      },
      {
        value: 'option 3',
        id: '3'
      }
    ],
    required: true,
    instruction: 'Select your favourites',
  },
  {
    name: 'dateTime',
    type: 'dateTime',
    label: 'Birthday',
    instruction: 'Select your birthday'
  },
  {
    label: 'Number',
    name: 'number-123',
    type: 'number',
    instruction: 'Input your age',
    min: 18,
    max: 23
  },
  {
    name: 'radio',
    type: 'radio',
    items: [
      {
        value: 'option 1',
        id: '1'
      },
      {
        value: 'option 2',
        id: '2'
      },
      {
        value: 'option 3',
        id: '3'
      }
    ],
    instruction: 'Select your education',
  },
  {
    name: 'select',
    type: 'select',
    items: [
      {
        value: 'option 1',
        id: '1'
      },
      {
        value: 'option 2',
        id: '2'
      },
      {
        value: 'option 3',
        id: '3'
      }
    ],
    instruction: 'Select you gender'
  }
];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function makeFormDefinition() {
  const formLength = getRandomInt(formDefinitions.length);
  const data = [];
  for(let i=0; i< formLength; i++){
    data.push(formDefinitions[i]);
  }
  return data;
}

function makeFormLocation() {
  const locationLength = getRandomInt(4);
  const data = [];
  for(let i=0; i < locationLength; i++){
    data.push(String(i));
  }
  return data;
}

function makeBoolean() {
  const data = getRandomInt(2);
  return data === 0 ? false : true;
}

const forms = [
  {
    id: '1',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '2',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '3',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '4',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '5',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '6',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '7',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '8',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '9',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '10',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '11',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '12',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '13',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '14',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '15',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '16',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '17',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '18',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '19',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '20',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '21',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '22',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '23',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '24',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '25',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '26',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '27',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '28',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '29',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '30',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '31',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '32',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '33',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '34',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '35',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '36',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '37',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '38',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  },
  {
    id: '39',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    lastModified: '2019-01-25T01:18:09.254Z',
    definition: makeFormDefinition(),
    locations: makeFormLocation(),
    isPublished: makeBoolean(),
    isTemplate: makeBoolean()
  }
];

import {
  REQUEST_CREATE_FORM,
  REQUEST_DELETE_FORM,
  REQUEST_UPDATE_FORM,
  REQUEST_FORMS,
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
  requestDeleteFormError,
} from './';

function* requestFormSaga() {
  yield takeLatest(REQUEST_FORMS, function* fetchForm() {
    yield put(requestFormsStart());
    yield call(delay, 500);
    yield put(requestFormsSuccess(forms));
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
