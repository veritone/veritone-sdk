import React from 'react';
import { storiesOf } from '@storybook/react';

import styles from './story.styles.scss';

import SentimentEngineOutput from './';

storiesOf('SentimentEngineOutput', module)
  .add('Base', () => {
    return (<SentimentEngineOutput classes={{ root: styles.sentimentRoot }}/>);
  });