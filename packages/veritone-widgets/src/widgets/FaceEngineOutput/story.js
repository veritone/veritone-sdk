import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number as knobNumber } from '@storybook/addon-knobs';
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

const tdo = {
  id: '10314032',
  details: {
    filename: 'NFLNetworkPrimetimeProgramming_20160205_0510_edit',
    veritoneFile: {
      filename: 'NFLNetworkPrimetimeProgramming_20160205_0510'
    },
    veritoneMediaSource: {
      mediaSourceId: '38402',
      mediaSourceTypeId: '2'
    },
    veritoneCustom: {},
    veritoneProgram: {
      programId: '20622',
      programName: 'NFL Network Primetime Programming',
      programImage:
        'https://s3.amazonaws.com/prod-veritone-ugc/programs/20622/I362KHzOSBO8ySTB5mBQ_ZJzJEcVm_400x400.jpg',
      programLiveImage:
        'https://s3.amazonaws.com/prod-veritone-ugc/cb5e52b4-a986-4e2b-b525-482319df3350%2FbrdProgram%2FBeQ5IMMdTnuMCl25MRon_nfln.jpg'
    }
  },
  startDateTime: '2016-02-05T05:10:00.000Z',
  stopDateTime: '2016-02-05T05:15:00.000Z',
  security: {
    global: true
  }
};

const engines = [
  {
    // "id": "imagedetection-facerecognition-veritone",
    id: '84b513bd-d64d-3a35-9d42-579c8611fdbf',
    name: 'Semblance'
  }
];

storiesOf('FaceEngineOutput', module)
  .addDecorator(withKnobs)
  .addDecorator(story => (
    <Provider store={store}>
      <Sagas middleware={store.sagaMiddleware}>{story()}</Sagas>
    </Provider>
  ))
  .add('Base', () => {
    const faceSeries = faceObjects.reduce((accumulator, faceSeries) => {
      if (faceSeries.series.length) {
        const unrecognizedFaces = faceSeries.series.filter(
          faceObj => !faceObj.object.entityId
        );
        return [...accumulator, ...unrecognizedFaces];
      }
      return accumulator;
    }, []);

    return (
      <FaceEngineOutput
        tdo={tdo}
        engines={engines}
        selectedEngineId={engines[0].id}
        unrecognizedFaces={faceSeries}
        editMode
        baseUrlImagePrefix="https://s3-us-west-1.amazonaws.com/prod-veritone-face"
        currentMediaPlayerTime={knobNumber('mediaPlayerPosition', 0, {
          range: true,
          min: 0,
          max: 6000,
          step: 1000
        })}
      />
    );
  });
