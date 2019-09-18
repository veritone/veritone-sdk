import React from 'react';
import { noop } from 'lodash';
import { mount } from 'enzyme';
import Tab from '@material-ui/core/Tab';

import DiscoverySideBarHeader from './Header';
import MultipleTabHeader from './MuitipleTabHeader';

describe('DiscoverySideBarHeader', function () {
  it('Should render MultipleTabHeader when props.tabs.length > 1', function () {
    const tabs = ['one', 'two'];
    const wrapper = mount(
      <DiscoverySideBarHeader
        tabs={tabs}
        selectedTab={tabs[0]}
        onSelectTab={noop}
      />
    );

    expect(wrapper.find('MultipleTabHeader')).toHaveLength(1);
  });

  it('Should pass props.selectedTab and props.onSelectTab to the MultipleTabHeader', function () {
    const tabs = ['one', 'two'];
    const onSelectTab = jest.fn();
    const selectedTab = 'two';

    const wrapper = mount(
      <DiscoverySideBarHeader
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={onSelectTab}
      />
    );

    expect(wrapper.find('MultipleTabHeader').props()).toHaveProperty(
      'selectedTab',
      selectedTab
    );

    expect(wrapper.find('MultipleTabHeader').props()).toHaveProperty(
      'onSelectTab',
      onSelectTab
    );
  });

  it('Should render SingleTabHeader when props.tabs.length === 1', function () {
    const wrapper = mount(
      <DiscoverySideBarHeader
        tabs={['one']}
        selectedTab="one"
        onSelectTab={noop}
      />
    );

    expect(wrapper.find('SingleTabHeader')).toHaveLength(1);
  });

  it('Should show the props.rightIconButtonElement when props.rightIconButton is true', function () {
    const wrapper = mount(
      <DiscoverySideBarHeader
        tabs={['one']}
        selectedTab="one"
        onSelectTab={noop}
        rightIconButtonElement={<div id="works" />}
      />
    );

    expect(wrapper.find('#works')).toHaveLength(0);

    wrapper.setProps({ rightIconButton: true });
    expect(wrapper.find('#works')).toHaveLength(1);
  });
});

describe('MultipleTabHeader', function () {
  it('renders a tab for each entry in props.tabs', function () {
    const tabs = ['one', 'two', 'three'];
    const wrapper = mount(
      <MultipleTabHeader
        tabs={tabs}
        selectedTab={'one'}
        onSelectTab={noop}
      />
    );

    expect(wrapper.find(Tab)).toHaveLength(3)
    wrapper.find(Tab).forEach((node, index) =>
      expect(node.prop('label')).toBe(tabs[index])
    );
  });
});

describe('SingleTabHeader', function () { });
