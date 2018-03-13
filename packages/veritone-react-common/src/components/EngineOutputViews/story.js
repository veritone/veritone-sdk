import React from 'react';
import { storiesOf } from '@storybook/react';

import styles from './story.styles.scss';

import TranscriptEngineOutput from './TranscriptEngineOutput';
import SentimentEngineOutput from './SentimentEngineOutput';
import FacialDetectionOuput from './FacialDetectionOutput';
import { 
  transcriptAssets, 
  tdoStartTime, 
  tdoEndTime,
  sentimentAssets
} from './story.data.js';

storiesOf('EngineOutputViews', module)
  .add('TranscriptEngineOutput', () => {
    return (<TranscriptEngineOutput 
        assets={transcriptAssets} 
        classes={{root: styles.outputViewRoot}}
        tdoStartTime={tdoStartTime}
        tdoEndTime={tdoEndTime}
    />);
  })
  .add('SentimentEngineOutput', () => {
    return (
      <SentimentEngineOutput
        data={sentimentAssets}
        classes={{ root: styles.sentimentRoot }}
      />
    );
  })
  .add('FacialDetectionOutput', () => {
    return (
      <FacialDetectionOuput />
    )
  });