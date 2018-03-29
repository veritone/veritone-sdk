import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, number, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import styles from './story.styles.scss';

import FaceEngineOutput from './';

storiesOf('FaceEngineOutput', module).add('Base', () => {
  return (
    <FaceEngineOutput
      faces={faceObjects}
      libraries={libraries}
      enableEditMode={boolean('enableEditMode', false)}
      entitySearchResults={entitySearchResults}
      className={styles.outputViewRoot}
      mediaPlayerPosition={number('mediaPlayerPosition', 0, {
        range: true,
        min: 0,
        max: 6000,
        step: 1000
      })}
      onAddNewEntity={action('Pop the add new entity modal')}
      viewMode={select(
        'viewMode',
        {
          summary: 'Summary',
          byFrame: 'by Frame',
          byScene: 'by Scene'
        },
        'summary'
      )}
      onFaceOccurrenceClicked={action('Set the media player position')}
    />
  );
});

let entitySearchResults = [
  {
    entityName: 'Aaron Altherr',
    libraryName: 'Athlete',
    profileImageUrl:
      'https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Altherr.jpg'
  },
  {
    entityName: 'Aaron Blairasdfasdfasdfasdfadsfadsfasdfadsfadsfadsfasdfasdf',
    libraryName: 'Athlete',
    profileImageUrl:
      'https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg'
  },
  {
    entityName: 'Aaron Blair',
    libraryName: 'Athlete',
    profileImageUrl:
      'https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg'
  },
  {
    entityName: 'Aaron Blair',
    libraryName: 'Athlete',
    profileImageUrl:
      'https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg'
  },
  {
    entityName: 'Aaron Blair',
    libraryName: 'Athlete',
    profileImageUrl:
      'https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg'
  },
  {
    entityName: 'Aaron Blair',
    libraryName: 'Athlete',
    profileImageUrl:
      'https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg'
  },
  {
    entityName: 'Aaron Blair',
    libraryName: 'Athlete',
    profileImageUrl:
      'https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg'
  },
  {
    entityName: 'Aaron Blair',
    libraryName: 'Athlete',
    profileImageUrl:
      'https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg'
  },
  {
    entityName: 'Aaron Blair',
    libraryName: 'Athlete',
    profileImageUrl:
      'https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg'
  },
  {
    entityName: 'Aaron Blair',
    libraryName: 'Athlete',
    profileImageUrl:
      'https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg'
  },
  {
    entityName: 'Aaron Blair',
    libraryName: 'Athlete',
    profileImageUrl:
      'https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg'
  }
];

let faceObjects = [
  {
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 2000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png'
        }
      },
      {
        startTimeMs: 1000,
        stopTimeMs: 3000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png'
        }
      },
      {
        startTimeMs: 1000,
        stopTimeMs: 4000,
        entityId: '13595602-3a7f-48d3-bfde-2d029af479f6',
        libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
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
        entityId: '1945a3ba-f0a3-411e-8419-78e31c73150a',
        libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
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
        startTimeMs: 2000,
        stopTimeMs: 3000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png'
        }
      },
      {
        startTimeMs: 2000,
        stopTimeMs: 3000,
        entityId: '8e35f28c-34aa-4ee3-8690-f62bf1a704fa',
        libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          boundingPoly: [
            {
              x: 0.1,
              y: 0.2
            }
          ],
          confidence: 0.86
        }
      },
      {
        startTimeMs: 3000,
        stopTimeMs: 4000,
        entityId: 'c36e8b95-6d46-4a5a-a272-8507319a5a54',
        libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          boundingPoly: [
            {
              x: 0.1,
              y: 0.2
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
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png'
        }
      },
      {
        startTimeMs: 5000,
        stopTimeMs: 6000,
        entityId: '13595602-3a7f-48d3-bfde-2d029af479f6',
        libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          boundingPoly: [
            {
              x: 0.1,
              y: 0.2
            }
          ],
          confidence: 0.94
        }
      }
    ]
  }
];

let libraries = [
  {
    id: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
    name: 'Beatles',
    entities: [
      {
        entityId: 'c36e8b95-6d46-4a5a-a272-8507319a5a54',
        entityName: 'Paul McCartney',
        libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
        profileImageUrl:
          'https://pbs.twimg.com/profile_images/806883889146957824/VbnEycIm_normal.jpg',
        jsondata: {
          description: 'A member of the beatles'
        }
      },
      {
        entityId: '1945a3ba-f0a3-411e-8419-78e31c73150a',
        entityName: 'Ringo Starr',
        libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
        profileImageUrl: null,
        jsondata: {}
      },
      {
        entityId: '8e35f28c-34aa-4ee3-8690-f62bf1a704fa',
        entityName: 'George Harrison',
        libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
        profileImageUrl:
          'https://prod-veritone-library.s3.amazonaws.com/f1297e1c-9c20-48fa-a8fd-46f1e6d62c43/8e35f28c-34aa-4ee3-8690-f62bf1a704fa/profile-1514492325832.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJUCF3BCNMSE5YZEQ%2F20180326%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180326T234640Z&X-Amz-Expires=900&X-Amz-Signature=7222a63cb831c34be639407ce6206df011853a7f01d7b020b101661152efcbb4&X-Amz-SignedHeaders=host',
        jsondata: {
          description: ''
        }
      }
    ]
  },
  {
    id: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
    name: 'Addams Family',
    entities: [
      {
        entityId: '13595602-3a7f-48d3-bfde-2d029af479f6',
        entityName: 'Gomez Addams',
        libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
        profileImage: null,
        jsondata: {}
      },
      {
        entityId: 'c1666e9f-9dc0-40f9-aece-0ec1bfeae29a',
        entityName: 'James Williams',
        libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
        profileImage: null,
        jsondata: {}
      }
    ]
  }
];
