import React from 'react';
import { mount } from 'enzyme';
import TranscriptEngineOutput from './';

const sampleData = {
  snippetSegments: [
    {
      assetId: 'asset0',
      startTimeMs: 0,
      stopTimeMs: 3000,
      series: [
        {
          guid: '0',
          startTimeMs: 0,
          stopTimeMs: 1000,
          words: [
            { word: 'food', confidence: 0.4 },
            { word: 'first', confidence: 0.7 },
            { word: 'fast', confidence: 0.5 }
          ]
        },
        {
          guid: '1',
          startTimeMs: 1000,
          stopTimeMs: 2000,
          words: [
            { word: 'stamp', confidence: 0.9 },
            { word: 'temp', confidence: 0.7 },
            { word: 'test', confidence: 0.5 }
          ]
        },
        {
          guid: '2',
          startTimeMs: 2000,
          stopTimeMs: 3000,
          words: [
            { word: 'tooth', confidence: 0.9 },
            { word: 'shoot', confidence: 0.7 },
            { word: 'boot', confidence: 1 }
          ]
        }
      ]
    }
  ],
  speakerSegments: []
}


describe('Transcript Engine Output - View Mode', () => {
  const onRestoreOriginalClick = jest.fn();
  const transcriptEngineOutput = mount(
    <TranscriptEngineOutput
      parsedData={sampleData}
      selectedEngineId="1"
      onRestoreOriginalClick={onRestoreOriginalClick}
      engines={[{
        id: '1', name: 'Engine-X',
        category: { categoryType: 'dummy' }
      }, {
        id: '2', name: 'Engine-Y',
        category: { categoryType: 'dummy' }
      }]}
    />
  );

  it('Missing EngineOutputHeader', () => {
    expect(transcriptEngineOutput.find('EngineOutputHeader')).toHaveLength(1);
  });

  it('Missing SpeakerTranscriptContent', () => {
    expect(transcriptEngineOutput.find('SpeakerTranscriptContent')).toHaveLength(1);
  });

  it('Missing Virtualized Transcript', () => {
    const transcriptMode = transcriptEngineOutput;

    expect(transcriptMode.find('SnippetSegment')).toHaveLength(1);
  });
});

describe('Transcript Engine Ouput - Edit Mode', () => {
  const onRestoreOriginalClick = jest.fn();
  window.getSelection = () => jest.fn();

  const transcriptEngineOutput = mount(
    <TranscriptEngineOutput
      editMode
      onRestoreOriginalClick={onRestoreOriginalClick}
      parsedData={sampleData}
      selectedEngineId="1"
      engines={[{ id: '1', name: 'Engine-X' }, { id: '2', name: 'Engine-Y' }]}
    />
  );

  it('Missing EngineOutputHeader', () => {
    expect(transcriptEngineOutput.find('EngineOutputHeader')).toHaveLength(1);
  });

  it('Missing SpeakerTranscriptContent', () => {
    expect(transcriptEngineOutput.find('SpeakerTranscriptContent')).toHaveLength(1);
  });

  it('Invalid Edit', () => {
    const editMode = transcriptEngineOutput;

    const editWrapper = editMode.find('EditableWrapper');
    expect(editWrapper).toHaveLength(1);
    expect(editWrapper.text()).toEqual('first stamp boot');
  });
});
