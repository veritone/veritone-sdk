import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';

import EngineCategoryConfigList from './EngineCategoryConfigList';
import EngineCategoryConfig from './EngineCategoryConfig';
import EngineConfigItem from './EngineConfigItem';
import SubtitleConfigForm from './SubtitleConfigForm';
import * as engineOutputExportModule from '../../redux/modules/engineOutputExport';

const mockStore = configureMockStore();

const testTDOs = [{ tdoId: 'fakeTDOId ' }];

const testSpeakerEngine = {
  id: 'speakerEngineId',
  name: 'Test Speaker Engine',
  category: {
    id: 'a856c447-1030-4fb0-917f-08179f949c4e',
    name: 'Test Speaker Category',
    iconClass: 'icon-speaker-separation',
    exportFormats: [
      {
        label: 'Test Format',
        format: 'test',
        types: []
      }
    ]
  }
};

const testEngine = {
  id: 'testEngineId',
  name: 'Test Engine',
  signedIconPath:
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

const testOutputConfigs = [
  {
    engineId: testEngine.id,
    categoryId: testEngine.category.id,
    formats: []
  }
];

const testSpeakerOutputConfigs = [
  {
    engineId: testSpeakerEngine.id,
    categoryId: testSpeakerEngine.category.id,
    formats: []
  }
];

const defaultStore = {
  engineOutputExport: {
    enginesRan: {
      [testEngine.id]: testEngine
    },
    categoryLookup: {
      [testEngine.category.id]: testEngine.category
    },
    outputConfigurations: testOutputConfigs,
    expandedCategories: {
      [testEngine.category.id]: false
    }
  }
};

const defaultSpeakerStore = {
  engineOutputExport: {
    enginesRan: {
      [testSpeakerEngine.id]: testSpeakerEngine
    },
    categoryLookup: {
      [testSpeakerEngine.category.id]: testSpeakerEngine.category
    },
    outputConfigurations: testSpeakerOutputConfigs,
    expandedCategories: {
      [testSpeakerEngine.category.id]: false
    },
    speakerToggleCache: {
      withSpeakerData: true
    },
    hasSpeakerData: true
  }
};

describe('EngineCategoryConfigList', () => {
  let wrapper, store;

  //TODO: fix this test. It is throwing an error when trying to mount the component.
  xdescribe('when speaker data is available', () => {
    beforeEach(() => {
      store = mockStore(defaultSpeakerStore);

      wrapper = mount(
        <Provider store={store}>
          <EngineCategoryConfigList
            tdos={testTDOs}
            outputConfigsByCategoryId={engineOutputExportModule.outputConfigsByCategoryId(
              store.getState()
            )}
            expandedCategories={engineOutputExportModule.expandedCategories(
              store.getState()
            )}
            hasSpeakerData
          />
        </Provider>
      );
    });

    afterEach(() => {
      store = mockStore(defaultStore);
    });

    it('should not be displayed in the list', () => {
      expect(wrapper.find(EngineCategoryConfig).exists()).toEqual(false);
    });
  });
});

describe('EngineCategoryConfig', () => {
  let wrapper, onExpandConfigs, store;

  describe('when props.expanded is false', () => {
    beforeEach(() => {
      store = mockStore(defaultStore);

      onExpandConfigs = jest.fn();
      wrapper = mount(
        <Provider store={store}>
          <EngineCategoryConfig
            categoryId={testEngine.category.id}
            engineCategoryConfigs={
              engineOutputExportModule.outputConfigsByCategoryId(
                store.getState()
              )[testEngine.category.id]
            }
            expanded={
              engineOutputExportModule.expandedCategories(store.getState())[
                testEngine.category.id
              ]
            }
            bulkExportEnabled={false}
            onExpandConfigs={onExpandConfigs}
          />
        </Provider>
      );
    });

    afterEach(() => {
      store = mockStore(defaultStore);
    });

    it('should display the engine category icon class', () => {
      expect(
        wrapper.find(Icon).hasClass(testEngine.category.iconClass)
      ).toEqual(true);
    });

    it('should display the engine category name', () => {
      expect(
        wrapper
          .find(ListItemText)
          .find('div#engineCategoryName')
          .html()
      ).toMatch(new RegExp(testEngine.category.name));
    });

    it('should display an ExpandMoreIcon', () => {
      expect(wrapper.find(ExpandMoreIcon).exists()).toEqual(true);
    });

    it('should not display the list of EngineConfigItems', () => {
      expect(
        wrapper
          .find(Collapse)
          .find(List)
          .exists()
      ).toEqual(false);
    });

    it('should call onExpandConfig callback when expand button is clicked', () => {
      wrapper.find(ExpandMoreIcon).simulate('click');
      expect(onExpandConfigs).toHaveBeenCalled();
    });
  });

  describe('when props.expanded is true', () => {
    beforeEach(() => {
      store = mockStore({
        ...defaultStore,
        engineOutputExport: {
          ...defaultStore.engineOutputExport,
          expandedCategories: {
            ...defaultStore.engineOutputExport.expandedCategories,
            [testEngine.category.id]: true
          }
        }
      });

      onExpandConfigs = jest.fn();
      wrapper = mount(
        <Provider store={store}>
          <EngineCategoryConfig
            categoryId={testEngine.category.id}
            engineCategoryConfigs={
              engineOutputExportModule.outputConfigsByCategoryId(
                store.getState()
              )[testEngine.category.id]
            }
            expanded={
              engineOutputExportModule.expandedCategories(store.getState())[
                testEngine.category.id
              ]
            }
            bulkExportEnabled={false}
            onExpandConfigs={onExpandConfigs}
          />
        </Provider>
      );
    });

    afterEach(() => {
      store = mockStore(defaultStore);
    });

    it('should display the engine category icon class', () => {
      expect(
        wrapper.find(Icon).hasClass(testEngine.category.iconClass)
      ).toEqual(true);
    });

    it('should display the engine category name', () => {
      expect(
        wrapper
          .find(ListItemText)
          .find('div#engineCategoryName')
          .html()
      ).toMatch(new RegExp(testEngine.category.name));
    });

    it('should display an ExpandLessIcon', () => {
      expect(wrapper.find(ExpandLessIcon).exists()).toEqual(true);
    });

    it('should display a list of EngineConfigItems', () => {
      expect(
        wrapper
          .find(Collapse)
          .find(List)
          .exists()
      ).toEqual(true);
      expect(wrapper.find(EngineConfigItem).length).toEqual(
        testOutputConfigs.length
      );
    });

    it('should call onExpandConfig callback when expand button is clicked', () => {
      wrapper.find(ExpandLessIcon).simulate('click');
      expect(onExpandConfigs).toHaveBeenCalled();
    });
  });
});

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
      store = mockStore(defaultStore);

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

    afterEach(() => {
      store = mockStore(defaultStore);
      store.clearActions();
    });

    it('shows the engine logo', () => {
      expect(wrapper.find('[data-test="engineLogo"]').exists()).toEqual(true);
    });

    it('shows the engine name', () => {
      expect(wrapper.find(ListItemText).exists()).toEqual(true);
      expect(wrapper.find(ListItemText).html()).toMatch(/Test Engine/);
    });

    it('should call selectFileType when file type is selected', () => {
      wrapper.find(Select).prop('onChange')({ target: { value: ['vlf'] } });

      const actions = store.getActions();
      const expectedActions = [
        {
          type: engineOutputExportModule.UPDATE_SELECTED_FILE_TYPES,
          payload: {
            selectedFileTypes: ['vlf'],
            categoryId: testEngine.category.id,
            engineId: testEngine.id
          }
        }
      ];
      expect(actions).toEqual(expectedActions);
    });
  });

  describe('when props.engineId is not provided', () => {
    let wrapper, store;

    beforeEach(() => {
      store = mockStore(defaultStore);

      wrapper = mount(
        <Provider store={store}>
          <EngineConfigItem
            categoryId={testEngine.category.id}
            formats={testFormats}
          />
        </Provider>
      );
    });

    afterEach(() => {
      store = mockStore(defaultStore);
      store.clearActions();
    });

    it('shows "All Engines" instead of an engine name', () => {
      expect(wrapper.find(ListItemText).exists()).toEqual(true);
      expect(wrapper.find(ListItemText).html()).toMatch(/All Engines/);
    });

    it('should call selectFileType when file type is selected', () => {
      wrapper.find(Select).prop('onChange')({ target: { value: ['vlf'] } });

      const actions = store.getActions();
      const expectedActions = [
        {
          type: engineOutputExportModule.UPDATE_SELECTED_FILE_TYPES,
          payload: {
            selectedFileTypes: ['vlf'],
            categoryId: testEngine.category.id,
            engineId: undefined
          }
        }
      ];
      expect(actions).toEqual(expectedActions);
    });
  });
});

describe('SubtitleConfigForm', () => {
  let wrapper, onCancel, onSubmit, store;

  const testInitialValues = {
    linesPerScreen: 2,
    maxLinesPerCaptionLine: 32,
    newLineOnPunctuation: false
  };

  beforeEach(() => {
    store = mockStore(defaultStore);

    onCancel = jest.fn();
    onSubmit = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <SubtitleConfigForm
          onCancel={onCancel}
          initialValues={testInitialValues}
          onSubmit={onSubmit}
        />
      </Provider>
    );
  });

  afterEach(() => {
    store = mockStore(defaultStore);
    store.clearActions();
  });

  it('should call onCancel when the "Cancel" button is pressed', () => {
    wrapper
      .find(Button)
      .not('[type="submit"]')
      .simulate('click');
    expect(onCancel).toHaveBeenCalled();
  });

  it('should call onSubmit with updated values when form is submitted', () => {
    wrapper.find('form').simulate('submit');
    expect(onSubmit).toHaveBeenCalled();
  });
});
