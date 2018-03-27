import React from 'react';
import { storiesOf } from '@storybook/react';

import SentimentEngineOutput from './';

import styles from './story.styles.scss';

storiesOf('SentimentEngineOutput', module)
  .add('Base', () => {
    let mockData1 = genMockData(40, 0, 5000);                     //Good data
    let mockData2 = genMockData(20, 40*5000, 5000, 'pending');    //Bad data
    let mockData3 = genMockData(900, 60*5000, 5000)               //Good data
    let dynamicMockData = mockData1.concat(mockData2, mockData3);
    return (
      <SentimentEngineOutput
        className={styles.outputViewRoot}
        data={dynamicMockData}
        mediaPlayerTime={6000}
      />
    );
  });

function genMockData (numValues, startTime, timeInterval, status = 'complete') {
  let startTimeMs;
  let stopTimeMs;
  let data = [];
  for (let index = 0; index < numValues; index++) {
    startTimeMs = startTime + index * timeInterval;
    stopTimeMs = startTimeMs + timeInterval;
    let dynamicData = {
      startTimeMs: startTimeMs,
      stopTimeMs: stopTimeMs,
      status: status,
      sentiment: {
        positiveValue: randomizeValue(1, 0),
        positiveConfidence: randomizeValue(1, 0),
        negativeValue: randomizeValue(0, -1),
        negativeConfidence: randomizeValue(1, 0)
      }
    };

    data.push(dynamicData);
  }

  return data;
}

function randomizeValue (max, min) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}
