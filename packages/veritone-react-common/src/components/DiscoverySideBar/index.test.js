import React from 'react';
import { noop } from 'lodash';
import { mount } from 'enzyme';
import IconButton from '@material-ui/core/IconButton';

import { DiscoverySideBarContainerPure as Sidebar } from './';

const defaultProps = {
  tabs: ['one'],
  selectedTab: 'one',
  onSelectTab: noop,
  filtersActivePath: [],
  onFiltersNavigate: noop,
  onClearAllFilters: noop,
  onClearFilter: noop,
  filtersSections: {
    children: []
  },
  formComponents: {},
  selectedFilters: []
};

describe('DiscoverySideBarContainerPure', function() {
  it('Should render a Header', function() {
    const wrapper = mount(<Sidebar {...defaultProps} />);

    expect(wrapper.find('DiscoverySidebarHeader')).toHaveLength(1);
  });

  it('should render a rightIconButton into the header if props.clearAllFilters is true', function() {
    const wrapper = mount(<Sidebar {...defaultProps} />);
    expect(
      wrapper.find('DiscoverySidebarHeader').find(IconButton)
    ).toHaveLength(0);

    wrapper.setProps({ clearAllFilters: true });
    expect(
      wrapper.find('DiscoverySidebarHeader').find(IconButton)
    ).toHaveLength(1);
  });

  it('should call props.onClearAllFilters when the rightIconButton is clicked', function() {
    const handler = jest.fn();
    const wrapper = mount(
      <Sidebar {...defaultProps} clearAllFilters onClearAllFilters={handler} />
    );

    wrapper
      .find('DiscoverySidebarHeader')
      .find(IconButton)
      .simulate('click');

    expect(handler).toHaveBeenCalled();
  });

  it('should show the filters tree if props.selectedTab is Filters', function() {
    const wrapper = mount(<Sidebar {...defaultProps} selectedTab="Filters" />);
    expect(wrapper.find('SectionTree')).toHaveLength(1);
  });

  it('should show the browse container if props.selectedTab is Browse', function() {
    const wrapper = mount(<Sidebar {...defaultProps} selectedTab="Browse" />);
    expect(wrapper.find('[data-testtarget="browse"]')).toHaveLength(1);
  });

  it('should not show the AllFiltersList if props.filters.length === 0', function() {
    const wrapper = mount(
      <Sidebar {...defaultProps} selectedTab="Filters" selectedFilters={[]} />
    );

    expect(wrapper.find('AllFiltersList')).toHaveLength(0);
  });

  it('should show the AllFiltersList if props.filters.length > 0', function() {
    const wrapper = mount(
      <Sidebar
        {...defaultProps}
        selectedTab="Filters"
        selectedFilters={[
          {
            label: 'label',
            number: 1,
            id: '1'
          }
        ]}
      />
    );

    expect(wrapper.find('AllFiltersList')).toHaveLength(1);
  });
});
