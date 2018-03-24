import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import styles from './story.styles.scss';

import FaceEngineOutput from './';

storiesOf('FaceEngineOutput', module)
  .add('Base', () => {
    return (
      <FaceEngineOutput 
        faces={faceObjects} 
        libraries={libraries}
        enableEditMode={boolean("Enable Edit Mode")}
        entitySearchResults={entitySearchResults}
        className={styles.outputViewRoot}
        mediaPlayerPosition={number('percentComplete', 20, {
          range: true,
          min: 0,
          max: 6000,
          step: 1000
        })}
        onAddNewEntity={action("Pop the add new entity modal")}
      />
    )
  });

  let entitySearchResults = [
    {
      entityName: "Aaron Altherr",
      libraryName: "Athlete",
      profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Altherr.jpg"
    },
    {
      entityName: "Aaron Blairasdfasdfasdfasdfadsfadsfasdfadsfadsfadsfasdfasdf",
      libraryName: "Athlete",
      profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
    },
    {
      entityName: "Aaron Blair",
      libraryName: "Athlete",
      profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
    },
    {
      entityName: "Aaron Blair",
      libraryName: "Athlete",
      profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
    },
    {
      entityName: "Aaron Blair",
      libraryName: "Athlete",
      profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
    },
    {
      entityName: "Aaron Blair",
      libraryName: "Athlete",
      profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
    },
    {
      entityName: "Aaron Blair",
      libraryName: "Athlete",
      profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
    },
    {
      entityName: "Aaron Blair",
      libraryName: "Athlete",
      profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
    },
    {
      entityName: "Aaron Blair",
      libraryName: "Athlete",
      profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
    },
    {
      entityName: "Aaron Blair",
      libraryName: "Athlete",
      profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
    },
    {
      entityName: "Aaron Blair",
      libraryName: "Athlete",
      profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
    },
  ];
  
  let faceObjects = [
    {
      startTimeMs: 0,
      endTimeMs: 4000,
      entityId: '',
      libraryId: '',
      object: {
        type: 'face',
        uri: 'https://images.radio-online.com/images/logos/Veritonexl.png'
      }
    },
    {
      startTimeMs: 2000,
      endTimeMs: 4000,
      entityId: '',
      libraryId: '',
      object: {
        type: 'face',
        uri: 'https://images.radio-online.com/images/logos/Veritonexl.png'
      }
    },
    {
      startTimeMs: 3000,
      endTimeMs: 6000,
      entityId: 'c36e8b95-6d46-4a5a-a272-8507319a5a54',
      libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
      object: {
        type: 'face',
        uri: 'https://images.radio-online.com/images/logos/Veritonexl.png'
      }
    },
    {
      startTimeMs: 3000,
      endTimeMs: 6000,
      entityId: '',
      libraryId: '',
      object: {
        type: 'face',
        uri: 'https://images.radio-online.com/images/logos/Veritonexl.png'
      }
    },
    {
      startTimeMs: 4000,
      endTimeMs: 5000,
      entityId: '',
      libraryId: '',
      object: {
        type: 'face',
        uri: 'https://images.radio-online.com/images/logos/Veritonexl.png'
      }
    },
    {
      startTimeMs: 3000,
      endTimeMs: 6000,
      entityId: '',
      libraryId: '',
      object: {
        type: 'face',
        uri: 'https://images.radio-online.com/images/logos/Veritonexl.png'
      }
    },
    {
      startTimeMs: 3000,
      endTimeMs: 6000,
      entityId: '13595602-3a7f-48d3-bfde-2d029af479f6',
      libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
      object: {
        type: 'face',
        uri: 'https://images.radio-online.com/images/logos/Veritonexl.png'
      }
    }
  ];
  
  let libraries = [
    {
      id: "f1297e1c-9c20-48fa-a8fd-46f1e6d62c43",
      name: "Beatles",
      entities: [
        {
          entityId: "c36e8b95-6d46-4a5a-a272-8507319a5a54",
          entityName: "Paul McCartney",
          libraryId: "f1297e1c-9c20-48fa-a8fd-46f1e6d62c43",
          profileImageUrl: "https://pbs.twimg.com/profile_images/806883889146957824/VbnEycIm_normal.jpg"
        },
        {
          entityId: "1945a3ba-f0a3-411e-8419-78e31c73150a",
          entityName: "Ringo Starr",
          libraryId: "f1297e1c-9c20-48fa-a8fd-46f1e6d62c43",
          profileImageUrl: null
        }
      ]
    },
    {
      id: "b64ef50a-0a5b-47ff-a403-a9a30f9241a4",
      name: "Addams Family",
      entities: [
        {
          entityId: "13595602-3a7f-48d3-bfde-2d029af479f6",
          entityName: "Gomez Addams",
          libraryId: "b64ef50a-0a5b-47ff-a403-a9a30f9241a4",
          profileImage: null
        },
        {
          entityId: "c1666e9f-9dc0-40f9-aece-0ec1bfeae29a",
          entityName: "James Williams",
          libraryId: "b64ef50a-0a5b-47ff-a403-a9a30f9241a4",
          profileImage: null
        }
      ]
    }
  ];