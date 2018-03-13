import React from 'react';
import { storiesOf } from '@storybook/react';

import styles from './story.styles.scss';

import TranscriptEngineOutput from './TranscriptEngineOutput';
import SentimentEngineOutput from './SentimentEngineOutput';
<<<<<<< HEAD
import FacialDetectionOuput from './FacialDetectionOutput';
=======
import FacialDetectionOuput from './FacialDetectionEngineOutput';
>>>>>>> media-details-page
import ObjectDetectionOuput from './ObjectDetectionEngineOutput';
import { 
  transcriptAssets, 
  tdoStartTime, 
  tdoEndTime,
<<<<<<< HEAD
  sentimentAssets
=======
  sentimentAssets,
>>>>>>> media-details-page
  objectDetectionAssets
} from './story.data.js';

storiesOf('EngineOutputViews', module)
  .add('TranscriptEngineOutput', () => {
    return (<TranscriptEngineOutput 
        assets={transcriptAssets} 
        classes={{root: styles.transcriptRoot}}
        tdoStartTime={tdoStartTime}
        tdoEndTime={tdoEndTime}
    />);
  })
  .add('SentimentEngineOutput', () => {
    return (
      <SentimentEngineOutput
        data={sentimentAssets}
        classes={{ root: styles.outputViewRoot }}
      />
    );
  })
  .add('FacialDetectionOutput', () => {
    return (
      <FacialDetectionOuput />
    )
  })
  .add('ObjectDetectionOutput', () => {
    return (
      <ObjectDetectionOuput 
        assets={ objectDetectionAssets }
        classes={ {
          root: styles.outputViewRoot 
        } }
      />
    )
  });