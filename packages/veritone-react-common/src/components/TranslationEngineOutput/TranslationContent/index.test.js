import React from 'react';
import { mount } from 'enzyme';
import TranslationContent from './';

const sampleContent = [
  {
    startTimeMs: 0,
    stopTimeMs: 1000,
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 500,
        language: 'en-US',
        words: [
          { word: 'tada', confidence: 0.7 },
          { word: 'todo', confidence: 0.5 }
        ]
      },
      {
        startTimeMs: 600,
        stopTimeMs: 1000,
        language: 'en-US',
        words: [
          { word: 'tada', confidence: 0.7 },
          { word: 'todo', confidence: 0.5 }
        ]
      }
    ]
  },
  {
    startTimeMs: 1000,
    stopTimeMs: 2000,
    status: 'error'
  },
  {
    startTimeMs: 2001,
    stopTimeMs: 3000,
    status: 'success',
    series: [
      {
        startTimeMs: 2001,
        stopTimeMs: 3000,
        language: 'en-US'
      }
    ]
  }
];

describe('Translation Engine Output', () => {
  let translationContent = mount(
    <TranslationContent
      contents={sampleContent}
      onRerunProcess={jest.fn()}
      neglectableTimeMs={2}
    />
  );

  it('Missing DataSegment', () => {
    expect(translationContent.find('DataSegment')).toHaveLength(2);
  });

  it('Missing ErrorSegment', () => {
    expect(translationContent.find('ErrorSegment')).toHaveLength(1);
  });

  it('Missing NoDataSegment', () => {
    expect(translationContent.find('NoDataSegment')).toHaveLength(1);
  });
});
