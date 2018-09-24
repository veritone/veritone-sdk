import React from 'react';
import { mount } from 'enzyme';
import { startCase, toLower } from 'lodash';

import DynamicAdapterConfig from './';

describe('DynamicAdapter', () => {
  const BASE_ADAPTER_CONFIG = {
    name: 'Test Adapter',
    description: 'Test Description',
    fields: [],
    iconPath: 'Test Icon',
    supportedSourceTypes: null,
    namespace: 'configuration'
  };
  const SOURCES = [
    {
      id: 'test-source-id-0'
    },
    {
      id: 'test-source-id-1'
    }
  ];
  const CLUSTERS = [
    {
      id: 'test-cluster-id-0'
    },
    {
      id: 'test-cluster-id-1'
    }
  ];
  const SUPPORTED_SOURCE_TYPES = ['10'];
  const FIELDS = [
    {
      name: 'location',
      options: null,
      type: 'Text',
      max: null,
      min: null,
      step: null,
      info: 'location',
      defaultValue: 'Los Angeles'
    }
  ];

  it('Should have title, adapter component, template, config, validate function, and hydration function defined', () => {
    expect(DynamicAdapterConfig.title).toBeDefined();
    expect(DynamicAdapterConfig.adapter).toBeDefined();
    expect(DynamicAdapterConfig.config).toBeDefined();
    expect(DynamicAdapterConfig.validate).toBeDefined();
    expect(DynamicAdapterConfig.getHydratedData).toBeDefined();
  });

  it('Validate function should not require source if adapterConfig does not have supportedSourceTypes defined', done => {
    const testFuncs = {
      validate: DynamicAdapterConfig.validate(BASE_ADAPTER_CONFIG),
      validateCB: jest.fn()
    };
    jest.spyOn(testFuncs, 'validateCB');
    testFuncs
      .validate({
        clusterId: 'fakeId',
        _cluster: {
          selectedCluster: {}
        }
      })
      .then(result => {
        testFuncs.validateCB(result);
        expect(testFuncs.validateCB).toHaveBeenCalled();
        done();
        return result;
      });
  });

  it('Validate function should only require source if adapterConfig has supportedSourceTypes defined w/ length > 1', done => {
    const ADAPTER_CONFIG = Object.assign({}, BASE_ADAPTER_CONFIG, {
      supportedSourceTypes: SUPPORTED_SOURCE_TYPES
    });
    const testFuncs = {
      validate: DynamicAdapterConfig.validate(ADAPTER_CONFIG),
      validateCB: jest.fn()
    };
    jest.spyOn(testFuncs, 'validateCB');
    testFuncs
      .validate({
        clusterId: 'fakeId',
        _cluster: {
          selectedCluster: {}
        }
      })
      .catch(err => {
        testFuncs.validateCB(err);
        expect(testFuncs.validateCB).toHaveBeenCalledWith('Source is required');
        done();
      });
  });

  it('Validate function should only require fields which have default values', done => {
    const ADAPTER_CONFIG = Object.assign({}, BASE_ADAPTER_CONFIG, {
      fields: FIELDS
    });
    const testFuncs = {
      validate: DynamicAdapterConfig.validate(ADAPTER_CONFIG),
      validateCB: jest.fn()
    };
    jest.spyOn(testFuncs, 'validateCB');
    testFuncs
      .validate({
        sourceId: SOURCES[0].id,
        _source: {
          selectedSource: SOURCES[0]
        },
        clusterId: CLUSTERS[0].id,
        _cluster: {
          selectedCluster: CLUSTERS[0]
        }
      })
      .catch(err => {
        testFuncs.validateCB(err);
        expect(testFuncs.validateCB).toHaveBeenCalledWith(
          `${startCase(toLower(FIELDS[0].name))} is invalid`
        );

        testSuccess();
      });

    function testSuccess() {
      let configuration = {
        clusterId: CLUSTERS[0].id,
        _cluster: {
          selectedCluster: CLUSTERS[0]
        }
      };
      configuration[FIELDS[0].name] = 'test';
      testFuncs.validate(configuration).then(result => {
        testFuncs.validateCB(result);
        expect(testFuncs.validateCB).toHaveBeenCalledWith(configuration);
        done();
        return result;
      });
    }
  });

  it('DynamicAdapter should set default values for any adapter input fields', () => {
    const ADAPTER_CONFIG = Object.assign({}, BASE_ADAPTER_CONFIG, {
      fields: FIELDS
    });
    const CONFIGURATION = {
      sourceId: SOURCES[0].id,
      clusterId: CLUSTERS[0].id,
      _cluster: {}
    };
    const DynamicAdapter = DynamicAdapterConfig.adapter;
    const UPDATE_CONFIGURATION = jest.fn();
    const testFuncs = {
      loadNextSources: () => {
        return Promise.resolve(SOURCES);
      },
      loadNextClusters: () => {
        return Promise.resolve(CLUSTERS);
      },
      OPEN_CREATE_SOURCE: () => () => jest.fn(),
      CLOSE_CREATE_SOURCE: jest.fn(),
      POPULATE_SELECTED_SOURCE: () => {
        return Promise.resolve(SOURCES[0]);
      }
    };
    mount(
      <DynamicAdapter
        adapterConfig={ADAPTER_CONFIG}
        sources={SOURCES}
        configuration={CONFIGURATION}
        updateConfiguration={UPDATE_CONFIGURATION}
        openCreateSource={testFuncs.OPEN_CREATE_SOURCE}
        closeCreateSource={testFuncs.CLOSE_CREATE_SOURCE}
        loadNextSources={testFuncs.loadNextSources}
        loadNextClusters={testFuncs.loadNextClusters}
        populateSelectedSource={testFuncs.POPULATE_SELECTED_SOURCE}
        pageSize={3}
      />
    );
    let expectedConfiguration = {
      sourceId: SOURCES[0].id,
      clusterId: CLUSTERS[0].id,
      _source: {
        hasNextPage: false,
        isNextPageLoading: false,
        items: []
      },
      _cluster: {
        hasNextPage: false,
        isNextPageLoading: false,
        items: []
      },
      maxTDODuration: 60
    };
    expectedConfiguration[FIELDS[0].name] = FIELDS[0].defaultValue;
    expect(UPDATE_CONFIGURATION).toHaveBeenCalledWith(expectedConfiguration);
  });

  it('DynamicAdapter should rehydrate its state if the existing configuration matches the adapters fields', () => {
    const ADAPTER_CONFIG = Object.assign({}, BASE_ADAPTER_CONFIG, {
      supportedSourceTypes: SUPPORTED_SOURCE_TYPES,
      fields: FIELDS
    });
    const TEST_FIELD_VALUE = 'TEST FIELD VALUE';
    const CONFIGURATION = {
      sourceId: SOURCES[0].id,
      clusterId: CLUSTERS[0].id,
      _cluster: {}
    };
    CONFIGURATION[FIELDS[0].name] = TEST_FIELD_VALUE;
    const DynamicAdapter = DynamicAdapterConfig.adapter;
    const UPDATE_CONFIGURATION = jest.fn();
    const testFuncs = {
      loadNextSources: () => {
        return Promise.resolve(SOURCES);
      },
      loadNextClusters: () => {
        return Promise.resolve(CLUSTERS);
      },
      OPEN_CREATE_SOURCE: () => () => jest.fn(),
      CLOSE_CREATE_SOURCE: jest.fn(),
      POPULATE_SELECTED_SOURCE: () => {
        return Promise.resolve(SOURCES[0]);
      }
    };
    mount(
      <DynamicAdapter
        adapterConfig={ADAPTER_CONFIG}
        sources={SOURCES}
        configuration={CONFIGURATION}
        updateConfiguration={UPDATE_CONFIGURATION}
        supportedSourceTypes={SUPPORTED_SOURCE_TYPES}
        openCreateSource={testFuncs.OPEN_CREATE_SOURCE}
        closeCreateSource={testFuncs.CLOSE_CREATE_SOURCE}
        loadNextSources={testFuncs.loadNextSources}
        loadNextClusters={testFuncs.loadNextClusters}
        populateSelectedSource={testFuncs.POPULATE_SELECTED_SOURCE}
        pageSize={3}
      />
    );
    let expectedConfiguration = {
      sourceId: SOURCES[0].id,
      clusterId: CLUSTERS[0].id,
      _source: {
        hasNextPage: false,
        isNextPageLoading: false,
        items: []
      },
      _cluster: {
        hasNextPage: false,
        isNextPageLoading: false,
        items: []
      },
      maxTDODuration: 60
    };
    expectedConfiguration[FIELDS[0].name] = TEST_FIELD_VALUE;
    expect(UPDATE_CONFIGURATION).toHaveBeenCalledWith(expectedConfiguration);
  });
});
