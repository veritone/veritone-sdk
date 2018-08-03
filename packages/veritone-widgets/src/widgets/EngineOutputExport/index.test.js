import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';

import EngineConfigItem from './EngineConfigItem';
import * as engineOutputExportModule from '../../redux/modules/engineOutputExport';

import styles from './styles.scss';

const mockStore = configureMockStore();

const testEngine = {
  id: 'testEngineId',
  name: 'Test Engine',
  signedLogoPath:
    'https://static.veritone.com/assets/favicon/favicon-32x32.png?v=lkgpRBRLYl',
  category: {
    id: 'testCategoryId',
    name: 'Test Category',
    iconClass: 'test-class',
    exportFormats: [
      {
        label: 'Test Format',
        format: 'test',
        types: []
      }
    ]
  }
};

describe('EngineConfigItem', () => {
  const testFormats = [
    {
      extension: 'vlf',
      options: {}
    }
  ];

  describe('with props.engineId provided', () => {
    let wrapper, store;

    beforeEach(() => {
      store = mockStore({
        engineOutputExport: {
          enginesRan: {
            testEngineId: testEngine
          },
          categoryLookup: {
            testCategoryId: testEngine.category
          }
        }
      });

      wrapper = mount(
        <Provider store={store}>
          <EngineConfigItem
            engineId={testEngine.id}
            categoryId={testEngine.category.id}
            formats={testFormats}
          />
        </Provider>
      );
    });

    it('shows the engine logo', () => {
      expect(wrapper.find('.' + styles.engineLogo).exists()).toEqual(true);
    });

    it('shows the engine name', () => {
      expect(wrapper.find(ListItemText).exists()).toEqual(true);
      expect(wrapper.find(ListItemText).html()).toMatch(/Test Engine/);
    });

    it('should call selectFileType when file type is selected', () => {
      wrapper.find(Select).prop('onChange')({ target: { value: 'vlf' } });

      const actions = store.getActions();
      const expectedActions = [
        {
          type: engineOutputExportModule.UPDATE_SELECTED_FILE_TYPES,
          selectedFileType: 'vlf',
          categoryId: testEngine.category.id,
          applyAll: false,
          engineId: testEngine.id
        }
      ];
      expect(actions).toEqual(expectedActions);
    });
  });

  describe('when props.engineId is not provided', () => {
    let wrapper, store;

    beforeEach(() => {
      store = mockStore({
        engineOutputExport: {
          enginesRan: {
            testEngineId: testEngine
          },
          categoryLookup: {
            testCategoryId: testEngine.category
          }
        }
      });

      wrapper = mount(
        <Provider store={store}>
          <EngineConfigItem
            categoryId={testEngine.category.id}
            formats={testFormats}
          />
        </Provider>
      );
    });

    it('shows "All Engines" instead of an engine name', () => {
      expect(wrapper.find(ListItemText).exists()).toEqual(true);
      expect(wrapper.find(ListItemText).html()).toMatch(/All Engines/);
    });

    it('should call selectFileType with applyAll equal to true when file type is selected', () => {
      wrapper.find(Select).prop('onChange')({ target: { value: 'vlf' } });

      const actions = store.getActions();
      const expectedActions = [
        {
          type: engineOutputExportModule.UPDATE_SELECTED_FILE_TYPES,
          selectedFileType: 'vlf',
          categoryId: testEngine.category.id,
          applyAll: true
        }
      ];
      expect(actions).toEqual(expectedActions);
    });
  });
});
