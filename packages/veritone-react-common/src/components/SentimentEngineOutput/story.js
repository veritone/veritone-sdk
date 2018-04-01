import React from 'react';
import { storiesOf } from '@storybook/react';
import styles from './story.styles.scss';
import SentimentEngineOutput from './';

storiesOf('SentimentEngineOutput', module).add('Base', () => {
  let mockData1 = genMockData(40, 0, 5000); //Good data
  let mockData2 = genMockData(20, 40 * 5000, 5000); //Bad data
  let mockData3 = genMockData(900, 60 * 5000, 5000); //Good data
  let dynamicMockData = mockData1.concat(mockData2, mockData3);
  return (
    <SentimentEngineOutput
      className={styles.outputViewRoot}
      data={dynamicMockData}
      mediaPlayerTime={6000}
      timeWindowStartMs={0}
    />
  );
});

function genMockData(numValues, startTime, timeInterval) {
  let startTimeMs;
  let stopTimeMs;
  let seriesData = [];
  for (let index = 0; index < numValues; index++) {
    startTimeMs = startTime + index * timeInterval;
    stopTimeMs = startTimeMs + timeInterval;
    let dynamicData = {
      startTimeMs: startTimeMs,
      stopTimeMs: stopTimeMs,
      sentiment: {
        positiveValue: randomizeValue(1, 0),
        positiveConfidence: randomizeValue(1, 0),
        negativeValue: randomizeValue(0, -1),
        negativeConfidence: randomizeValue(1, 0)
      }
    };

    seriesData.push(dynamicData);
  }

  return [{
    startOffsetMs: seriesData[0].startTimeMs,
    stopOffsetMs: seriesData[seriesData.length - 1].stopTimeMs,
    series: seriesData
  }];
}

function randomizeValue(max, min) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}
