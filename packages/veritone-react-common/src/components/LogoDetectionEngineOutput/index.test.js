import React from 'react';
import { mount } from 'enzyme';
import LogoDetectionEngineOutput from './';

const sampleData = [
  {
    startTimeMs: 0,
    stopTimeMs: 5000,
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 2500,
        object: {
          label: 'test1a',
          confidence: 1
        }
      },
      {
        startTimeMs: 2501,
        stopTimeMs: 5000,
        object: {
          label: 'test1b',
          confidence: 1
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
        stopTimeMs: 6000,
        object: {
          label: 'test2',
          confidence: 1
        }
      },
      {
        startTimeMs: 6000,
        stopTimeMs: 12000,
        object: {
          label: 'test2',
          confidence: 1
        }
      }
    ]
  }
];

describe('Logo Engine Output', () => {
  let logoEngineOutput = mount(
    <LogoDetectionEngineOutput
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
    expect(logoEngineOutput.find('EngineOutputHeader')).toHaveLength(1);
  });

  it('Missing Virtual List', () => {
    expect(logoEngineOutput.find('List')).toHaveLength(
      1
    );
  });

  it('Missing PillButton', () => {
    expect(logoEngineOutput.find('PillButton')).toHaveLength(4);
  });

  it('Invalid Label', () => {
    const labels = logoEngineOutput.find('.label');
    expect(labels).toHaveLength(4);
    expect(labels.at(0).text()).toEqual('test1a');
    expect(labels.at(1).text()).toEqual('test1b');
    expect(labels.at(2).text()).toEqual('test2');
    expect(labels.at(3).text()).toEqual('test2');
  });

  it('Invalid highlight', () => {
    const hlButtons = logoEngineOutput.find('.highlighted');
    expect(hlButtons).toHaveLength(1);
  });
});
