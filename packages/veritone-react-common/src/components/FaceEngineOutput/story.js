import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import styles from './story.styles.scss';

import FaceEngineOutput from './';

let entitySearchResults = [
  // {
  //   entityName: "Aaron Altherr",
  //   libraryName: "Athlete",
  //   profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Altherr.jpg"
  // },
  // {
  //   entityName: "Aaron Blairasdfasdfasdfasdfadsfadsfasdfadsfadsfadsfasdfasdf",
  //   libraryName: "Athlete",
  //   profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
  // },
  // {
  //   entityName: "Aaron Blair",
  //   libraryName: "Athlete",
  //   profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
  // },
  // {
  //   entityName: "Aaron Blair",
  //   libraryName: "Athlete",
  //   profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
  // },
  // {
  //   entityName: "Aaron Blair",
  //   libraryName: "Athlete",
  //   profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
  // },
  // {
  //   entityName: "Aaron Blair",
  //   libraryName: "Athlete",
  //   profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
  // },
  // {
  //   entityName: "Aaron Blair",
  //   libraryName: "Athlete",
  //   profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
  // },
  // {
  //   entityName: "Aaron Blair",
  //   libraryName: "Athlete",
  //   profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
  // },
  // {
  //   entityName: "Aaron Blair",
  //   libraryName: "Athlete",
  //   profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
  // },
  // {
  //   entityName: "Aaron Blair",
  //   libraryName: "Athlete",
  //   profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
  // },
  // {
  //   entityName: "Aaron Blair",
  //   libraryName: "Athlete",
  //   profileImageUrl: "https://s3.amazonaws.com/static.veritone.com/kairos/Athlete/Aaron-Blair.jpg"
  // },
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
    entityId: '',
    libraryId: '13e6f4a3-0d5c-4e11-9a30-913e981cb9ad',
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
  }
];


storiesOf('FaceEngineOutput', module)
  .add('Base', () => {
    return (
      <div className={styles.outputViewRoot}>
        <FaceEngineOutput 
          faces={faceObjects} 
          enableEditMode={boolean("Enable Edit Mode")}
          entitySearchResults={entitySearchResults}
          mediaPlayerPosition={number('percentComplete', 20, {
            range: true,
            min: 0,
            max: 6000,
            step: 1000
          })}
          onAddNewEntity={action("Pop the add new entity modal")}
        />
      </div>
    )
  });