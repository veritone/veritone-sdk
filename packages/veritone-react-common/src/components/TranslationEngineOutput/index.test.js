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
  },
  {
    startTimeMs: 9000,
    stopTimeMs: 15000,
    status: 'error'
  }
];

describe('Translation Engine Output', () => {
  let translationEngineOutput = mount(
    <TranslationEngineOutpt
      engines={[{ id: '1', name: 'Engine-X' }, { id: '2', name: 'Engine-Y' }]}
      selectedEngineId="1"
      contents={sampleData}
      mediaPlayerTimeMs={0}
      onRerunProcess={jest.fn()}
      onEngineChange={jest.fn()}
    />
  );

  it('Missing EngineOutputHeader', () => {
    expect(translationEngineOutput.find('EngineOutputHeader')).toHaveLength(1);
  });

  it('Missing TranslationContent', () => {
    expect(translationEngineOutput.find('TranslationContent')).toHaveLength(1);
  });

  it('invalid translation data segment', () => {
    const dataSegments = translationEngineOutput.find('DataSegment');
    expect(dataSegments).toHaveLength(3);

    expect(dataSegments.at(0).text()).toEqual('todo');
    expect(dataSegments.at(1).text()).toEqual('wakanda');
    expect(dataSegments.at(2).text()).toEqual('test');
    expect(dataSegments.at(0).prop('active')).toEqual(true);
    expect(dataSegments.at(1).prop('active')).toEqual(false);
    expect(dataSegments.at(2).prop('active')).toEqual(false);
    expect(dataSegments.at(0).find('span.highlight')).toHaveLength(1);
    expect(dataSegments.at(1).find('span.highlight')).toHaveLength(0);
    expect(dataSegments.at(2).find('span.highlight')).toHaveLength(0);
  });

  it('invalid no translation data segment', () => {
    const nodataSegments = translationEngineOutput.find('NoDataSegment');
    expect(nodataSegments).toHaveLength(1);
    const nodataTimes = nodataSegments.find('div.time');
    expect(nodataTimes).toHaveLength(1);
    expect(nodataTimes.at(0).text()).toEqual('00:05 - 00:06');
  });

  it('invalid error <-> rerun process segment', () => {
    const errorSegments = translationEngineOutput.find('ErrorSegment');
    expect(errorSegments).toHaveLength(1);
    const errorTimes = errorSegments.find('div.time');
    expect(errorTimes).toHaveLength(1);
    expect(errorTimes.at(0).text()).toEqual('00:09 - 00:15');
  });
});
