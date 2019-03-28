import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, number } from '@storybook/addon-knobs/react';

import EngineOutputNullState from '../EngineOutputNullState';

import styles from './story.styles.scss';
import ObjectDetectionOuput from './';

const objectDetectionAssets = [
  {
    startTimeMs: 0,
    stopTimeMs: 2000,
    sourceEngineId: '2dc5166f-c0ad-4d84-8a85-515c42b5d357',
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 1000,
        object: {
          label: 'data',
          confidence: 0.942457377910614
        }
      },
      {
        stopTimeMs: 1000,
        startTimeMs: 0,
        object: {
          label: 'very long name 32 char abbreviated',
          confidence: 0.8848179578781128
        }
      },
      {
        stopTimeMs: 2000,
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
    stopTimeMs: 13000,
    sourceEngineId: '2dc5166f-c0ad-4d84-8a85-515c42b5d357',
    series: [
      {
        stopTimeMs: 12000,
        startTimeMs: 9000,
        object: {
          label: 'desktop',
          confidence: 0.8710343837738037
        }
      },
      {
        stopTimeMs: 11000,
        startTimeMs: 9000,
        object: {
          label: 'data',
          confidence: 0.8665211200714111
        }
      },
      {
        stopTimeMs: 10000,
        startTimeMs: 9000,
        object: {
          label: 'data',
          confidence: 0.899578332901001
        }
      },
      {
        stopTimeMs: 13000,
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
      id: '2dc5166f-c0ad-4d84-8a85-515c42b5d357',
      name: 'Google Cloud Video Intelligence - Label Detection',
      category: { categoryType: 'dummy' } 
    },
    {
      id: '12345',
      name: 'Test Engine Name',
      category: { categoryType: 'dummy' } 
    }
  ];

  return (
    <ObjectDetectionOuput
      data={objectDetectionAssets}
      className={styles.outputViewRoot}
      selectedEngineId="2dc5166f-c0ad-4d84-8a85-515c42b5d357"
      engines={engines}
      onEngineChange={action('Engine Changed')}
      onObjectOccurrenceClick={action('Object occurence clicked')}
      currentMediaPlayerTime={number('mediaPlayerPosition', 0, {
        range: true,
        min: 0,
        max: 13000,
        step: 100
      })}
      onExpandClick={action('Expand Clicked')}
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
