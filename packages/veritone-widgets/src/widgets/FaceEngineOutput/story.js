import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'react-redux';
import { util } from 'veritone-redux-common';
import configureStore from '../../redux/configureStore';

import FaceEngineOutput from '.';

const Sagas = util.reactReduxSaga.Sagas;
const store = configureStore();

const faceObjects = [
  {
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 2000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          boundingPoly: [
            {
              x: 0.5,
              y: 0.2
            }
          ]
        }
      },
      {
        startTimeMs: 1000,
        stopTimeMs: 4000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: '13595602-3a7f-48d3-bfde-2d029af479f6',
          libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
          boundingPoly: [
            {
              x: 0.1,
              y: 0.2
            }
          ],
          confidence: 0.81
        }
      },
      {
        startTimeMs: 1000,
        stopTimeMs: 4000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: '1945a3ba-f0a3-411e-8419-78e31c73150a',
          libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
          boundingPoly: [
            {
              x: 0.4,
              y: 0.2
            }
          ],
          confidence: 0.81
        }
      },
      {
        startTimeMs: 2000,
        stopTimeMs: 3000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: '8e35f28c-34aa-4ee3-8690-f62bf1a704fa',
          libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
          boundingPoly: [
            {
              x: 0.2,
              y: 0.5
            }
          ],
          confidence: 0.86
        }
      },
      {
        startTimeMs: 3000,
        stopTimeMs: 4000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: 'c36e8b95-6d46-4a5a-a272-8507319a5a54',
          libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
          boundingPoly: [
            {
              x: 0.3,
              y: 0.4
            }
          ],
          confidence: 0.9
        }
      }
    ]
  },
  {
    series: [
      {
        startTimeMs: 4000,
        stopTimeMs: 6000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          boundingPoly: [
            {
              x: 0.4,
              y: 0.3
            }
          ]
        }
      },
      {
        startTimeMs: 5000,
        stopTimeMs: 6000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: '13595602-3a7f-48d3-bfde-2d029af479f6',
          libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
          boundingPoly: [
            {
              x: 0.5,
              y: 0.2
            }
          ],
          confidence: 0.94
        }
      }
    ]
  }
];

const entities = [
  {
    id: 'c36e8b95-6d46-4a5a-a272-8507319a5a54',
    name: 'Paul McCartney',
    libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
    library: {
      id: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
      name: 'Beatles'
    },
    profileImageUrl:
      'https://pbs.twimg.com/profile_images/806883889146957824/VbnEycIm_normal.jpg',
    jsondata: {
      name: 'Paul McCartney',
      middleName: 'Bob',
      age: 75,
      gender: 'Male',
      description:
        'A member of the beatles. I am typing this to test a long string that will be used in a description for this person or not.'
    }
  },
  {
    id: '1945a3ba-f0a3-411e-8419-78e31c73150a',
    name: 'Ringo Starr',
    libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
    library: {
      id: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
      name: 'Beatles'
    },
    profileImageUrl: null,
    jsondata: {}
  },
  {
    id: '8e35f28c-34aa-4ee3-8690-f62bf1a704fa',
    name: 'George Harrison',
    libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
    library: {
      id: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
      name: 'Beatles'
    },
    profileImageUrl:
      'https://prod-veritone-library.s3.amazonaws.com/f1297e1c-9c20-48fa-a8fd-46f1e6d62c43/8e35f28c-34aa-4ee3-8690-f62bf1a704fa/profile-1514492325832.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJUCF3BCNMSE5YZEQ%2F20180326%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180326T234640Z&X-Amz-Expires=900&X-Amz-Signature=7222a63cb831c34be639407ce6206df011853a7f01d7b020b101661152efcbb4&X-Amz-SignedHeaders=host',
    jsondata: {
      description: ''
    }
  },
  {
    id: '13595602-3a7f-48d3-bfde-2d029af479f6',
    name: 'Gomez Addams',
    libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
    libraryName: 'Addams Family',
    library: {
      id: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
      name: 'Addams Family'
    },
    profileImage: null,
    jsondata: {}
  },
  {
    id: 'c1666e9f-9dc0-40f9-aece-0ec1bfeae29a',
    name: 'James Williams',
    libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
    library: {
      id: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
      name: 'Addams Family'
    },
    profileImage: null,
    jsondata: {}
  }
];

const tdo = {
  "id": "10314032",
  "details": {
    "filename": "NFLNetworkPrimetimeProgramming_20160205_0510_edit",
    "veritoneFile": {
      "filename": "NFLNetworkPrimetimeProgramming_20160205_0510"
    },
    "veritoneMediaSource": {
      "mediaSourceId": "38402",
      "mediaSourceTypeId": "2"
    },
    "veritoneCustom": {},
    "veritoneProgram": {
      "programId": "20622",
      "programName": "NFL Network Primetime Programming",
      "programImage": "https://s3.amazonaws.com/prod-veritone-ugc/programs/20622/I362KHzOSBO8ySTB5mBQ_ZJzJEcVm_400x400.jpg",
      "programLiveImage": "https://s3.amazonaws.com/prod-veritone-ugc/cb5e52b4-a986-4e2b-b525-482319df3350%2FbrdProgram%2FBeQ5IMMdTnuMCl25MRon_nfln.jpg"
    }
  },
  "startDateTime": "2016-02-05T05:10:00.000Z",
  "stopDateTime": "2016-02-05T05:15:00.000Z",
  "security": {
    "global": true
  }
};

const engines = [
  {
    "id": "imagedetection-facerecognition-veritone",
    "name": "Semblance"
  }
];

storiesOf('FaceEngineOutput', module)
.addDecorator(story =>(
  <Provider store={store}>
    <Sagas middleware={store.sagaMiddleware}>
      {story()}
    </Sagas>
  </Provider>
))
.add('Base', () => {
  return (
    <FaceEngineOutput
      data={faceObjects}
      tdo={tdo}
      engines={engines}
      entities={entities}
      selectedEngineId="84b513bd-d64d-3a35-9d42-579c8611fdbf"
    />
  )
});
