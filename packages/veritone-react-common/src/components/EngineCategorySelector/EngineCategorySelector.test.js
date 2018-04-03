import React from 'react';
import { mount } from 'enzyme';
import Tabs, { Tab } from 'material-ui/Tabs';
import EngineCategorySelector from './index';

describe('EngineCategorySelector', () => {
  const TRANSCRIPT_ENGINE_CATEGORY = {
    id: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
    name: 'Transcription',
    iconClass: 'icon-engine-transcription',
    engines: [],
    editable: true,
    status: 'completed',
    categoryType: 'transcript'
  };
  const FACE_ENGINE_CATEGORY = {
    id: '6faad6b7-0837-45f9-b161-2f6bf31b7a07',
    name: 'Facial Detection',
    iconClass: 'icon-engine-face',
    engines: [],
    editable: false,
    status: 'failed',
    categoryType: 'face'
  };
  const ENGINE_CATEGORIES = [TRANSCRIPT_ENGINE_CATEGORY, FACE_ENGINE_CATEGORY];

  it('initializes with two engine category tabs', () => {
    const onSelectEngineCategory = jest.fn();
    const wrapper = mount(
      <EngineCategorySelector
        engineCategories={ENGINE_CATEGORIES}
        selectedEngineCategoryId={TRANSCRIPT_ENGINE_CATEGORY.id}
        onSelectEngineCategory={onSelectEngineCategory}
      />
    );
    const tabsBar = wrapper.find(Tabs);
    expect(tabsBar.exists);
    expect(tabsBar.find(Tab)).toHaveLength(2);
  });

  it('initializes with preselected tab', () => {
    const onSelectEngineCategory = jest.fn();
    const wrapper = mount(
      <EngineCategorySelector
        engineCategories={ENGINE_CATEGORIES}
        selectedEngineCategoryId={FACE_ENGINE_CATEGORY.id}
        onSelectEngineCategory={onSelectEngineCategory}
      />
    );
    const tabs = wrapper.find(Tabs);
    expect(tabs.props()['value']).toBe(FACE_ENGINE_CATEGORY.id);
  });

  it('onSelectEngineCategory should be called when selected engine category', () => {
    const onSelectEngineCategory = jest.fn();
    const wrapper = mount(
      <EngineCategorySelector
        engineCategories={ENGINE_CATEGORIES}
        selectedEngineCategoryId={FACE_ENGINE_CATEGORY.id}
        onSelectEngineCategory={onSelectEngineCategory}
      />
    );
    let engineCategoryTab = wrapper.find(Tab).at(0);
    engineCategoryTab.simulate('click');
    expect(onSelectEngineCategory).toHaveBeenCalled();
    engineCategoryTab = wrapper.find(Tab).at(1);
    engineCategoryTab.simulate('click');
    expect(onSelectEngineCategory).toHaveBeenCalled();
  });
});
