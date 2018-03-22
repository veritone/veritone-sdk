import React from 'react';
import { storiesOf } from '@storybook/react';

import styles from './story.styles.scss';

import SentimentEngineOutput from './';

export const sentimentAssets = [
  {end: 5580, score: 0.6, start: 80},
  {end: 10599, score: 0.75, start: 5589},
  {end: 16340, score: 0.55, start: 10610},
  {end: 18130, score: 0.65, start: 16350},
  {end: 23610, score: 0.45, start: 18110},
  {end: 24010, score: 0.25, start: 23620},
  {end: 29010, score: 0.45, start: 24020},
  {end: 34150, score: 0.75, start: 29022}
];

storiesOf('SentimentEngineOutput', module)
  .add('Base', () => {
    return (
      <SentimentEngineOutput
        data={sentimentAssets}
        className={styles.outputViewRoot}
      />
    );
  });
