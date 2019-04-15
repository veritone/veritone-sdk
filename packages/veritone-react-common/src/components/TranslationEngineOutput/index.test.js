import React from 'react';
import { mount } from 'enzyme';
import TranslationEngineOutpt from './';

const sampleData = [
  {
    startTimeMs: 0,
    stopTimeMs: 9000,
    status: 'success',
    series: [
      {
        language: 'en-US',
        startTimeMs: 0,
        stopTimeMs: 2000,
        words: [
          {
            confidence: 0.6,
            word: 'tada'
          },
          {
            confidence: 0.7,
            word: 'todo'
          },
          {
            confidence: 0.5,
            word: 'teodeo'
          }
        ]
      },
      {
        language: 'en-US',
        startTimeMs: 2000,
        stopTimeMs: 5000,
        words: [
          {
            confidence: 0.6,
            word: 'baba'
          },
          {
            confidence: 0.7,
            word: 'wawa'
          },
          {
            confidence: 0.9,
            word: 'wakanda'
          }
        ]
      },
      {
        language: 'en-US',
        startTimeMs: 5000,
        stopTimeMs: 6000
      },
      {
        language: 'en-US',
        startTimeMs: 6000,
        stopTimeMs: 9000,
        words: [
          {
            confidence: 0.5,
            word: 'test'
          },
          {
            confidence: 0.4,
            word: 'best'
          },
          {
            confidence: 0.2,
            word: 'zet'
          }
        ]
      }
    ]
  }
];

describe('Translation Engine Output', () => {
  let translationEngineOutput = mount(
    <TranslationEngineOutpt
      engines={[
        {
          id: '1',
          name: 'Engine-X',
          category: { categoryType: 'dummy' }
        },
        {
          id: '2',
          name: 'Engine-Y',
          category: { categoryType: 'dummy' }
        }
      ]}
      defaultLanguage={sampleData[0].series[0].language}
      selectedEngineId="1"
      data={sampleData}
      mediaPlayerTimeMs={0}
      onEngineChange={jest.fn()}
    />
  );

  it('Missing EngineOutputHeader', () => {
    expect(translationEngineOutput.find('EngineOutputHeader')).toHaveLength(1);
  });

  it('Missing Virtual List', () => {
    expect(translationEngineOutput.find('List')).toHaveLength(1);
  });

  it('invalid translation data segment', () => {
    const dataSegments = translationEngineOutput.find('List');
    expect(dataSegments).toHaveLength(1);
    const spanFragments = dataSegments.find('span');

    expect(spanFragments.at(0).text()).toEqual('todo');
    expect(spanFragments.at(1).text()).toEqual('wakanda');
    expect(spanFragments.at(2).text()).toEqual('test');
    expect(spanFragments.at(0).find('span.highlight')).toHaveLength(1);
    expect(spanFragments.at(1).find('span.highlight')).toHaveLength(0);
    expect(spanFragments.at(2).find('span.highlight')).toHaveLength(0);
  });
});
