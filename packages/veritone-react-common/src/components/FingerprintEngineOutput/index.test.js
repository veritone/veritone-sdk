import React from 'react';
import { mount } from 'enzyme';
import FingerprintEntity from './FingerprintEntity';
import FingerprintContent from './FingerprintContent';
import FingerprintEngineOutput from './';

const sampleData = [
  {
    startTimeMs: 0,
    stopTimeMs: 60000,
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 30000,
        object: {
          entityId: 'entity-1',
          confidence: 1
        }
      },
      {
        startTimeMs: 30000,
        stopTimeMs: 50000,
        object: {
          entityId: 'entity-2',
          confidence: 0.7
        }
      },
      {
        startTimeMs: 50000,
        stopTimeMs: 60000,
        object: {
          entityId: 'entity-1',
          confidence: 1
        }
      }
    ]
  }
];

const sampleEntities = [
  {
    entityId: 'entity-1',
    name: 'entity 1',
    profileImageUrl: '',
    description: 'description',
    jsondata: {
      advertiser: 'data',
      duration: '10:00',
      iSCI: '234',
      spotType: 'voice'
    },
    libraryId: 'lib-1'
  },
  {
    entityId: 'entity-2',
    name: 'entity 2',
    profileImageUrl: '',
    description: 'description',
    jsondata: {
      advertiser: 'data',
      duration: '10:00',
      iSCI: '234',
      spotType: 'voice'
    },
    libraryId: 'lib-1'
  }
];

const sampleLibraries = [
  {
    libraryId: 'lib-1',
    name: 'Rhincodon pygmaeus',
    description: 'First Library'
  }
];

describe('Fingerprint Engine Output', () => {
  let fingerprintEngineOutput = mount(
    <FingerprintEngineOutput
      data={sampleData}
      entities={sampleEntities}
      libraries={sampleLibraries}
      engines={[{ id: '1', name: 'Engine-X' }, { id: '2', name: 'Engine-Y' }]}
      selectedEngineId="1"
    />
  );

  it('Missing EngineOutputHeader', () => {
    expect(fingerprintEngineOutput.find('EngineOutputHeader')).toHaveLength(1);
  });

  it('Missing FingerprintContent', () => {
    expect(fingerprintEngineOutput.find('FingerprintContent')).toHaveLength(1);
  });

  it('Missing FingerprintLibraries', () => {
    expect(fingerprintEngineOutput.find('FingerprintLibraries')).toHaveLength(
      1
    );
  });

  it('Invalid FingerprintLibrary', () => {
    const library = fingerprintEngineOutput.find('FingerprintLibrary');
    expect(library).toHaveLength(1);

    const libraryHeader = library.find('.header');
    expect(libraryHeader).toHaveLength(1);
    expect(libraryHeader.text()).toContain('Rhincodon pygmaeus');

    const libraryBody = library.find('.body');
    expect(libraryBody).toHaveLength(1);

    const pillButton = libraryBody.find('PillButton');
    expect(pillButton).toHaveLength(2);

    expect(
      pillButton
        .at(0)
        .find('.label')
        .text()
    ).toEqual('entity 1');
    expect(
      pillButton
        .at(1)
        .find('.label')
        .text()
    ).toEqual('entity 2');

    expect(
      pillButton
        .at(0)
        .find('.info')
        .text()
    ).toEqual('(2)');
    expect(
      pillButton
        .at(1)
        .find('.info')
        .text()
    ).toEqual('(1)');
  });
});

describe('Fingerprint Content', () => {
  let fingerprintContent = mount(
    <FingerprintContent libraries={sampleLibraries} />
  );

  it('Invalid Library View', () => {
    expect(fingerprintContent.find('FingerprintEntity')).toHaveLength(0);
    expect(fingerprintContent.find('FingerprintLibraries')).toHaveLength(1);
  });

  it('Invalid Entity View', () => {
    const entityMode = fingerprintContent.setState({
      showLibrary: false,
      selectedEntity: sampleEntities[0]
    });

    expect(entityMode.find('.entityInfo')).toHaveLength(1);
    expect(entityMode.find('FingerprintEntity')).toHaveLength(2); // 2 entity view bc of MUI theme
    expect(entityMode.find('FingerprintLibraries')).toHaveLength(0);
  });
});

describe('Fingerprint Entity', () => {
  let fingerprintEntity = mount(
    <FingerprintEntity entity={sampleEntities[0]} />
  );

  it('Invalid Stream Data', () => {
    expect(fingerprintEntity.find('EntityMetadata')).toHaveLength(0);
    expect(fingerprintEntity.find('EntityStreamData')).toHaveLength(1);

    const textButtons = fingerprintEntity.find('TextButton');
    expect(textButtons).toHaveLength(2);
    expect(textButtons.at(0).text()).toEqual('00:00 - 00:30');
    expect(textButtons.at(1).text()).toEqual('00:50 - 01:00');
  });
});
