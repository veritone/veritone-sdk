import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import styles from './story.styles.scss';
import ObjectDetectionOuput from './';

const objectDetectionAssets = [
  {
    startTimeMs: 0,
    endTimeMs: 9000,
    sourceEngineId: '2dc5166f-c0ad-4d84-8a85-515c42b5d357',
    sourceEngineName: 'Google Cloud Video Intelligence - Label Detection',
    taskId:
      'e1fa7d7c-6f1c-480e-b181-68940509f070-fef496da-f36e-49ec-a304-426d96017ddf',
    series: [
      {
        startTimeMs: 0,
        endTimeMs: 1000,
        object: {
          label: 'data',
          confidence: 0.942457377910614
        }
      },
      {
        endTimeMs: 1000,
        startTimeMs: 0,
        object: {
          label: 'very long name 32 char abbreviated',
          confidence: 0.8848179578781128
        }
      },
      {
        endTimeMs: 2000,
        startTimeMs: 0,
        object: {
          label: 'data',
          confidence: 0.942457377910614
        }
      }
    ]
  },
  {
    startTimeMs: 9000,
    endTimeMs: 13000,
    sourceEngineId: '2dc5166f-c0ad-4d84-8a85-515c42b5d357',
    sourceEngineName: 'Google Cloud Video Intelligence - Label Detection',
    taskId:
      'e1fa7d7c-6f1c-480e-b181-68940509f070-fef496da-f36e-49ec-a304-426d96017ddf',
    series: [
      {
        endTimeMs: 12000,
        startTimeMs: 9000,
        object: {
          label: 'desktop',
          confidence: 0.8710343837738037
        }
      },
      {
        endTimeMs: 11000,
        startTimeMs: 9000,
        object: {
          label: 'data',
          confidence: 0.8665211200714111
        }
      },
      {
        endTimeMs: 10000,
        startTimeMs: 9000,
        object: {
          label: 'data',
          confidence: 0.899578332901001
        }
      },
      {
        endTimeMs: 13000,
        startTimeMs: 9000,
        object: {
          label: 'desktop',
          confidence: 0.9239837527275085
        }
      }
    ]
  }
];

storiesOf('ObjectDetectionEngineOutput', module).add('Base', () => {
  let engines = [
    {
      sourceEngineId: '2dc5166f-c0ad-4d84-8a85-515c42b5d357',
      sourceEngineName: 'Google Cloud Video Intelligence - Label Detection'
    },
    {
      sourceEngineId: '12345',
      sourceEngineName: 'Test Engine Name'
    }
  ];

  return (
    <ObjectDetectionOuput
      assets={objectDetectionAssets}
      className={styles.outputViewRoot}
      selectedEngineId="2dc5166f-c0ad-4d84-8a85-515c42b5d357"
      engines={engines}
      onEngineChange={action('Engine Changed')}
      onObjectOccurrenceClicked={action('Object occurence clicked')}
    />
  );
});
