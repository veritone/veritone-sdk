import React from 'react';
import { storiesOf } from '@storybook/react';
import { number } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';

import styles from './story.styles.scss';
import SentimentEngineOutput from './';

const mockData1 = genMockData(40, 0, 5000); //Good data
const mockData2 = genMockData(20, 40 * 5000, 5000); //Bad data
const mockData3 = genMockData(900, 60 * 5000, 5000); //Good data
const dynamicMockData = mockData1.concat(mockData2, mockData3);

const selectedEngineId = '1';
const engines = [
  { id: '1', name: 'Engine-X' },
  { id: '2', name: 'Engine-Y' },
  { id: '3', name: 'Engine-Z' }
];

storiesOf('SentimentEngineOutput', module).add('Base', () => {
  return (
    <SentimentEngineOutput
      className={styles.outputViewRoot}
      data={dynamicMockData}
      mediaPlayerTimeMs={1000 * number('Media Player Time', 0)}
      timeWindowStartMs={0}
      selectedEngineId={selectedEngineId}
      engines={engines}
      onEngineChange={action('entry clicked')}
      onExpandClick={action('expand button clicked')}
    />
  );
});

function genMockData(numValues, startTime, timeInterval) {
  let startTimeMs;
  let stopTimeMs;
  const seriesData = [];
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

  return [
    {
      startTimeMs: seriesData[0].startTimeMs,
      stopTimeMs: seriesData[seriesData.length - 1].stopTimeMs,
      series: seriesData
    }
  ];
}

function randomizeValue(max, min) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}
