import React from 'react';
import { storiesOf } from '@storybook/react';

import styles from './story.styles.scss';

import TranscriptEngineOutput from './TranscriptEngineOutput';
import SentimentEngineOutput from './SentimentEngineOutput';
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
        classes={{root: styles.transcriptRoot}}
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
  });