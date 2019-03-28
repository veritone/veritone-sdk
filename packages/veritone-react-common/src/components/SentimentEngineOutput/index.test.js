import React from 'react';
import { mount } from 'enzyme';
import SentimentEngineOutput from './';

const sampleData = [
  {
    startTimeMs: 0,
    stopTimeMs: 5000,
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 2500,
        sentiment: {
          positiveValue: 1,
          positiveConfidence: 0.7,
          negativeValue: -0.5,
          negativeConfidence: 0.5
        }
      },
      {
        startTimeMs: 2501,
        stopTimeMs: 5000,
        sentiment: {
          positiveValue: 0.6,
          positiveConfidence: 0.2,
          negativeValue: -0.5,
          negativeConfidence: 0.5
        }
      }
    ]
  },
  {
    startTimeMs: 5001,
    stopTimeMs: 12000,
    series: [
      {
        startTimeMs: 5001,
        stopTimeMs: 7500,
        sentiment: {
          positiveValue: 1,
          positiveConfidence: 0.7,
          negativeValue: -0.5,
          negativeConfidence: 0.5
        }
      },
      {
        startTimeMs: 7501,
        stopTimeMs: 12000,
        sentiment: {
          positiveValue: 0.6,
          positiveConfidence: 0.2,
          negativeValue: -0.9,
          negativeConfidence: 0.7
        }
      }
    ]
  }
];

describe('Sentiment Engine Output', () => {
  let sentimentEngineOutput = mount(
    <SentimentEngineOutput
      data={sampleData}
      engines={[{
        id: '1', name: 'Engine-X',
        category: { categoryType: 'dummy' }
      }, {
        id: '2', name: 'Engine-Y',
        category: { categoryType: 'dummy' }
      }]}
      selectedEngineId="1"
      mediaPlayerTimeMs={2400}
      mediaPlayerTimeIntervalMs={150}
      onEngineChange={jest.fn()}
      onEntrySelected={jest.fn()}
    />
  );

  it('Missing EngineOutputHeader', () => {
    expect(sentimentEngineOutput.find('EngineOutputHeader')).toHaveLength(1);
  });

  it('Missing Chart Container', () => {
    expect(sentimentEngineOutput.find('ResponsiveContainer')).toHaveLength(2);
  });

  it('Invalid Summary', () => {
    expect(sentimentEngineOutput.find('.summary').text()).toEqual(
      '15.00% positive'
    );
  });
});
