import React from 'react';
import { storiesOf } from '@storybook/react';
import { number } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';

import styles from './story.styles.scss';
import LogoDetectionEngineOutput from './';

let mockData = genMockData(140, 5000000);
let selectedEngineId = '1';
let engines = [
  { id: '1', name: 'Engine-X' },
  { id: '2', name: 'Engine-Y' },
  { id: '3', name: 'Engine-Z' }
];

storiesOf('LogoDetectionEngineOutput', module).add('Base', () => {
  return (
    <div className={styles.outputViewRoot}>
      <LogoDetectionEngineOutput
        data={mockData}
        mediaPlayerTimeMs={1000 * number('media player time', 0)}
        mediaPlayerTimeIntervalMs={500}
        className={styles.outputViewRoot}
        engines={engines}
        selectedEngineId={selectedEngineId}
        onEntrySelected={action('on select')}
        onEngineChange={action('on engine changed')}
        onExpandClicked={action('on expand clicked')}
      />
    </div>
  );
});

function genMockData(
  numEntry = 88,
  latestStartTime = 2000000,
  minTimeIntervals = 1000,
  maxTimeIntervals = 10000
) {
  let data = [];
  let labelOptions = [
    'ESPN',
    'Veritone',
    'Google',
    'Facebook',
    'Fox',
    'Some random long name 1',
    'Some random very long long long name 2',
    'CNN',
    'Walmart',
    'Toyota Motor',
    'Apple',
    'Exxon Mobil',
    'Some random very long long long long name 3',
    'Some random long name 4',
    'Broadcom',
    'Qualcomm',
    'Xerox',
    'Blizzard',
    'Sony',
    'Samsung',
    'BMW',
    'GMC',
    'Warner Bros.',
    'Walt Disney Studios',
    'Sony Picture',
    'Universal Pictures'
  ];

  let maxOptionIndex = labelOptions.length - 1;
  for (let entryIndex = 0; entryIndex < numEntry; entryIndex++) {
    let labelIndex = Math.round(Math.random() * maxOptionIndex);
    let startTime = Math.round(Math.random() * latestStartTime);
    let displayTime =
      Math.round(Math.random() * (maxTimeIntervals - minTimeIntervals)) +
      minTimeIntervals;
    let entry = {
      startTimeMs: startTime,
      stopTimeMs: startTime + displayTime,
      logo: {
        label: labelOptions[labelIndex],
        confidence: Math.random()
      }
    };
    data.push(entry);
  }

  return data;
}
