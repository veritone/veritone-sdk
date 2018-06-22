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
  const SOURCES = [{
    id: 'test-source-id-0'
  }, {
    id: 'test-source-id-1'
  }]
  const SUPPORTED_SOURCE_TYPES = ['10'];
  const FIELDS = [
    {
      "name": "location",
      "options": null,
      "type": "Text",
      "max": null,
      "min": null,
      "step": null,
      "info": "location",
      "defaultValue": "Los Angeles"
    }
  ];

  it('Should have title, adapter component, template, config, validate function, and hydration function defined', () => {
    expect(DynamicAdapterConfig.title).toBeDefined();
    expect(DynamicAdapterConfig.adapter).toBeDefined();
    expect(DynamicAdapterConfig.config).toBeDefined();
    expect(DynamicAdapterConfig.validate).toBeDefined();
    expect(DynamicAdapterConfig.getHydratedData).toBeDefined();
  });

  it('Validate function should not require sourceId if adapterConfig does not have supportedSourceTypes defined', done => {
    const testFuncs = {
      validate: DynamicAdapterConfig.validate(BASE_ADAPTER_CONFIG),
      validateCB: jest.fn()
    };
    jest.spyOn(testFuncs, 'validateCB');
    testFuncs.validate({}).then((result) => {
      testFuncs.validateCB(result);
      expect(testFuncs.validateCB).toHaveBeenCalled();
      done();
    });
  });

  it('Validate function should only require sourceId if adapterConfig has supportedSourceTypes defined w/ length > 1', done => {
    const ADAPTER_CONFIG = Object.assign({}, BASE_ADAPTER_CONFIG, { supportedSourceTypes: SUPPORTED_SOURCE_TYPES });
    const testFuncs = {
      validate: DynamicAdapterConfig.validate(ADAPTER_CONFIG),
      validateCB: jest.fn()
    };
    jest.spyOn(testFuncs, 'validateCB');
    testFuncs.validate({}).catch(err => {
      testFuncs.validateCB(err);
      expect(testFuncs.validateCB).toHaveBeenCalledWith('Source is required');
      done();
    });
  });

  it('Validate function should only require fields which have default values', done => {
    const ADAPTER_CONFIG = Object.assign({}, BASE_ADAPTER_CONFIG, { fields: FIELDS });
    const testFuncs = {
      validate: DynamicAdapterConfig.validate(ADAPTER_CONFIG),
      validateCB: jest.fn()
    };
    jest.spyOn(testFuncs, 'validateCB');
    testFuncs.validate({}).catch(err => {
      testFuncs.validateCB(err);
      expect(testFuncs.validateCB).toHaveBeenCalledWith(`${startCase(toLower(FIELDS[0].name))} is invalid`);

      let configuration = {};
      configuration[FIELDS[0].name] = 'test'
      testFuncs.validate(configuration).then(result => {
        testFuncs.validateCB(result)
        expect(testFuncs.validateCB).toHaveBeenCalledWith(configuration);
        done();
      });
    });
    

  });

  it('DynamicAdapter should automatically select the first sourceId if supportedSourceTypes is defined works', () => {
    const ADAPTER_CONFIG = Object.assign({}, BASE_ADAPTER_CONFIG, { supportedSourceTypes: SUPPORTED_SOURCE_TYPES });
    const CONFIGURATION = {};
    const DynamicAdapter = DynamicAdapterConfig.adapter;
    const UPDATE_CONFIGURATION = jest.fn();
    const OPEN_CREATE_SOURCE = jest.fn();
    const CLOSE_CREATE_SOURCE = jest.fn();
    mount(
      <DynamicAdapter
        adapterConfig={ADAPTER_CONFIG}
        sources={SOURCES}
        configuration={CONFIGURATION}
        updateConfiguration={UPDATE_CONFIGURATION}
        supportedSourceTypes={SUPPORTED_SOURCE_TYPES}
        openCreateSource={OPEN_CREATE_SOURCE}
        closeCreateSource={CLOSE_CREATE_SOURCE} />
      );
    expect(UPDATE_CONFIGURATION).toHaveBeenCalledWith({ sourceId: SOURCES[0].id });
  });

  it('DynamicAdapter should set default values for any adapter input fields', () => {
    const ADAPTER_CONFIG = Object.assign({}, BASE_ADAPTER_CONFIG, { fields: FIELDS });
    const CONFIGURATION = {};
    const DynamicAdapter = DynamicAdapterConfig.adapter;
    const UPDATE_CONFIGURATION = jest.fn();
    const OPEN_CREATE_SOURCE = jest.fn();
    const CLOSE_CREATE_SOURCE = jest.fn();
    mount(
      <DynamicAdapter
        adapterConfig={ADAPTER_CONFIG}
        sources={SOURCES}
        configuration={CONFIGURATION}
        updateConfiguration={UPDATE_CONFIGURATION}
        openCreateSource={OPEN_CREATE_SOURCE}
        closeCreateSource={CLOSE_CREATE_SOURCE} />
      );
    let expectedConfiguration = {};
    expectedConfiguration[FIELDS[0].name] = FIELDS[0].defaultValue;
    expect(UPDATE_CONFIGURATION).toHaveBeenCalledWith(expectedConfiguration);
  });

  it('DynamicAdapter should rehydrate its state if the existing configuration matches the adapters fields', () => {
    const ADAPTER_CONFIG = Object.assign({}, BASE_ADAPTER_CONFIG, { supportedSourceTypes: SUPPORTED_SOURCE_TYPES, fields: FIELDS });
    const TEST_FIELD_VALUE  = 'TEST FIELD VALUE';
    let configuration = {};
    configuration[FIELDS[0].name] = TEST_FIELD_VALUE;
    const DynamicAdapter = DynamicAdapterConfig.adapter;
    const UPDATE_CONFIGURATION = jest.fn();
    const OPEN_CREATE_SOURCE = jest.fn();
    const CLOSE_CREATE_SOURCE = jest.fn();
    mount(
      <DynamicAdapter
        adapterConfig={ADAPTER_CONFIG}
        sources={SOURCES}
        configuration={configuration}
        updateConfiguration={UPDATE_CONFIGURATION}
        supportedSourceTypes={SUPPORTED_SOURCE_TYPES}
        openCreateSource={OPEN_CREATE_SOURCE}
        closeCreateSource={CLOSE_CREATE_SOURCE} />
      );
    let expectedConfiguration = {
      sourceId: SOURCES[0].id
    };
    expectedConfiguration[FIELDS[0].name] = TEST_FIELD_VALUE;
    expect(UPDATE_CONFIGURATION).toHaveBeenCalledWith(expectedConfiguration);
  });

});