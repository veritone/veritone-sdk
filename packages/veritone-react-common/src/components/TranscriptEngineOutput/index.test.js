import React from 'react';
import { mount } from 'enzyme';
import { View as ViewMode, Edit as EditMode } from './TranscriptContent';
import TranscriptEngineOutput from './';

const sampleData = [
  {
    startTimeMs: 0,
    stopTimeMs: 3000,
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 1000,
        words: [
          { word: 'food', confidence: 0.4 },
          { word: 'first', confidence: 0.7 },
          { word: 'fast', confidence: 0.5 }
        ]
      },
      {
        startTimeMs: 1000,
        stopTimeMs: 2000,
        words: [
          { word: 'stamp', confidence: 0.9 },
          { word: 'temp', confidence: 0.7 },
          { word: 'test', confidence: 0.5 }
        ]
      },
      {
        startTimeMs: 2000,
        stopTimeMs: 3000,
        words: [
          { word: 'tooth', confidence: 0.9 },
          { word: 'shoot', confidence: 0.7 },
          { word: 'boot', confidence: 1 }
        ]
      }
    ]
  },
  {
    startTimeMs: 3000,
    stopTimeMs: 5000,
    series: [
      {
        startTimeMs: 2000,
        stopTimeMs: 5000
      }
    ]
  }
];

describe('Transcript Engine Output - View Mode', () => {
  const transcriptEngineOutput = mount(
    <TranscriptEngineOutput
      data={sampleData}
      selectedEngineId="1"
      engines={[{ id: '1', name: 'Engine-X' }, { id: '2', name: 'Engine-Y' }]}
    />
  );

  it('Missing EngineOutputHeader', () => {
    expect(transcriptEngineOutput.find('EngineOutputHeader')).toHaveLength(1);
  });

  it('Missing TranscriptContent', () => {
    expect(transcriptEngineOutput.find('TranscriptContent')).toHaveLength(1);
  });

  it('Invalid Overview Mode', () => {
    const overviewMode = transcriptEngineOutput.setState({
      viewType: ViewMode.OVERVIEW
    });

    expect(overviewMode.find('SnippetSegment')).toHaveLength(0);
    expect(overviewMode.find('OverviewSegment')).toHaveLength(1);

    const overviewFragments = overviewMode.find('OverviewFragment');
    expect(overviewFragments).toHaveLength(3);
    expect(overviewFragments.at(0).text()).toEqual('first');
    expect(overviewFragments.at(1).text()).toEqual('stamp');
    expect(overviewFragments.at(2).text()).toEqual('boot');
    expect(overviewFragments.at(0).prop('active')).toEqual(true);
    expect(overviewFragments.at(1).prop('active')).toEqual(true);
    expect(overviewFragments.at(2).prop('active')).toEqual(false);
    expect(overviewFragments.at(0).find('span.highlight')).toHaveLength(1);
    expect(overviewFragments.at(1).find('span.highlight')).toHaveLength(1);
    expect(overviewFragments.at(2).find('span.highlight')).toHaveLength(0);

    const noDataSegment = overviewMode.find('NoDataSegment');
    expect(noDataSegment).toHaveLength(1);
    expect(
      noDataSegment
        .find('div.time')
        .at(0)
        .text()
    ).toEqual('00:00:02 - 00:00:05');
  });

  it('Invalid Time View Mode', () => {
    const timeMode = transcriptEngineOutput.setState({
      viewTypeSelectionEnabled: true,
      viewType: ViewMode.TIME
    });

    expect(timeMode.find('OverviewSegment')).toHaveLength(0);

    const snippetSegment = timeMode.find('SnippetSegment');
    expect(snippetSegment).toHaveLength(1);
    expect(
      snippetSegment
        .find('div.time')
        .at(0)
        .text()
    ).toEqual('00:00:00');

    const snippetFragments = snippetSegment.find('SnippetFragment');
    expect(snippetFragments).toHaveLength(3);
    expect(snippetFragments.at(0).text()).toEqual('first');
    expect(snippetFragments.at(1).text()).toEqual('stamp');
    expect(snippetFragments.at(2).text()).toEqual('boot');
    expect(snippetFragments.at(0).prop('active')).toEqual(true);
    expect(snippetFragments.at(1).prop('active')).toEqual(true);
    expect(snippetFragments.at(2).prop('active')).toEqual(false);
    expect(snippetFragments.at(0).find('span.highlight')).toHaveLength(1);
    expect(snippetFragments.at(1).find('span.highlight')).toHaveLength(1);
    expect(snippetFragments.at(2).find('span.highlight')).toHaveLength(0);
    expect(snippetFragments.at(0).prop('editMode')).toEqual(false);
    expect(snippetFragments.at(1).prop('editMode')).toEqual(false);
    expect(snippetFragments.at(2).prop('editMode')).toEqual(false);

    const noDataSegment = timeMode.find('NoDataSegment');
    expect(noDataSegment).toHaveLength(1);
    expect(noDataSegment.prop('editMode')).toEqual(false);
    expect(
      noDataSegment
        .find('div.time')
        .at(0)
        .text()
    ).toEqual('00:00:02');
  });
});

describe('Transcript Engine Ouput - Edit Mode', () => {
  const transcriptEngineOutput = mount(
    <TranscriptEngineOutput
      editMode
      data={sampleData}
      selectedEngineId="1"
      engines={[{ id: '1', name: 'Engine-X' }, { id: '2', name: 'Engine-Y' }]}
    />
  );

  it('Missing EngineOutputHeader', () => {
    expect(transcriptEngineOutput.find('EngineOutputHeader')).toHaveLength(1);
  });

  it('Missing TranscriptContent', () => {
    expect(transcriptEngineOutput.find('TranscriptContent')).toHaveLength(1);
  });

  it('Invalid Bulk Edit', () => {
    const bulkEditMode = transcriptEngineOutput.setState({
      editType: EditMode.BULK
    });

    const bulkEdit = bulkEditMode.find('TranscriptBulkEdit');
    expect(bulkEdit).toHaveLength(1);
    expect(bulkEdit.text()).toEqual('first stamp boot \n\n\n');
  });

  it('Invalid Snippet Edit', () => {
    const snippetEditMode = transcriptEngineOutput.setState({
      editType: EditMode.SNIPPET
    });

    const bulkEdit = snippetEditMode.find('TranscriptBulkEdit');
    expect(bulkEdit).toHaveLength(0);

    const snippetSegment = snippetEditMode.find('SnippetSegment');
    expect(snippetSegment).toHaveLength(1);

    const snippetFragments = snippetSegment.find('SnippetFragment');
    expect(snippetFragments).toHaveLength(3);
    expect(snippetFragments.at(0).text()).toEqual('first');
    expect(snippetFragments.at(1).text()).toEqual('stamp');
    expect(snippetFragments.at(2).text()).toEqual('boot');
    expect(snippetFragments.at(0).prop('editMode')).toEqual(true);
    expect(snippetFragments.at(1).prop('editMode')).toEqual(true);
    expect(snippetFragments.at(2).prop('editMode')).toEqual(true);

    const noDataSegment = snippetEditMode.find('NoDataSegment');
    expect(noDataSegment).toHaveLength(1);
    expect(noDataSegment.prop('editMode')).toEqual(true);
  });
});
