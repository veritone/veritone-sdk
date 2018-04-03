import React from 'react';
import { storiesOf } from '@storybook/react';

import styles from './story.styles.scss';
import LogoDetectionEngineOutput from './';

storiesOf('LogoDetectionEngineOutput', module).add('Base', () => {
  let mockData = genMockData(140, 5000000);

  return (
    <div className={styles.outputViewRoot}>
      <LogoDetectionEngineOutput
        data={mockData}
        mediaPlayerTime={500000}
        className={styles.outputViewRoot}
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
