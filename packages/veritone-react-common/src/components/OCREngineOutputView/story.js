import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, number } from '@storybook/addon-knobs/react';

import EngineOutputNullState from '../EngineOutputNullState';

import styles from './story.styles.scss';

import OCREngineOutputView from './';

const texts = [
  'WITH \n DEVELOPING NOW \n TED CRUZ GAINING IN POLLS AND FUND-RAISING CNN \n Sara Murray CNW Political Reporter \n LIVE \n NAS58.43 \n AONY ON CHAMPS-ELYSEES, MAYOR SAYS \n U.S. TIGHTENING SECURITY I SITUATION ROOM \n ',
  'Just some random text',
  'word',
  'Medium length text that was recognized in the video',
  'A much longer text that was recognized in the video to test things to see if it will wrap multiple lines.'
];
const engines = [
  {
    id: '9a6ac62d-a881-8884-6ee0-f15ab84fcbe2',
    name: 'Cortex'
  }
];
const mockData = genMockData(0, 60000, 1000, texts);

storiesOf('OCREngineOutputView', module).add('Base', () => {
  return (
    <OCREngineOutputView
      data={mockData}
      className={styles.outputViewRoot}
      engines={engines}
      selectedEngineId="9a6ac62d-a881-8884-6ee0-f15ab84fcbe2"
      currentMediaPlayerTime={number('mediaPlayerPosition', 0, {
        range: true,
        min: 0,
        max: 600000,
        step: 100
      })}
      onEngineChange={action('onEngineChange')}
      onExpandClick={action('onExpandClick')}
      onOcrClicked={action('onOcrClicked')}
      outputNullState={
        boolean('showNullState') && (
          <EngineOutputNullState
            engineStatus="failed"
            engineName="fakeEngine"
            onRunProcess={action('Run Process')}
          />
        )
      }
    />
  );
});

// Mock Data Generator
function genMockData(startTime, stopTime, timeInterval, texts) {
  const series = [];
  const numEntries = Math.ceil((stopTime - startTime) / timeInterval);
  for (let entryIndex = 0; entryIndex < numEntries; entryIndex++) {
    const entryStartTime = startTime + entryIndex * timeInterval;
    const randomTextIndex = getRandomIndex(texts);
    series.push({
      startTimeMs: entryStartTime,
      stopTimeMs: entryStartTime + Math.floor(Math.random() * 5000),
      object: {
        text: texts[randomTextIndex]
      }
    });
  }

  return [
    {
      startTimeMs: startTime,
      stopTimeMs: stopTime,
      status: 'success',
      series: series
    }
  ];
}

function getRandomIndex(source) {
  if (source && source.length > 0) {
    return Math.round(Math.random() * (source.length - 1));
  } else {
    return -1;
  }
}
