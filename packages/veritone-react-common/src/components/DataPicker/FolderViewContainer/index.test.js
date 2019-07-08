import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';

import NullState from '../../NullState';
import FolderListView from './FolderListView';
import FolderLoading from './FolderLoading';

import { items } from './story';

import FolderViewContainer from './';


describe('FolderViewContainer', () => {
  it('Nullstate should show', () => {
    const wrapper = mount(
      <FolderViewContainer
        viewType={'list'}
        triggerPagination={noop}
        isLoaded
      />
    );
    expect(wrapper.contains(NullState)).toBe(true);
  });
  it('Should show loading spinner', () => {
    const wrapper = mount(
      <FolderViewContainer
        viewType={'list'}
        triggerPagination={noop}
        isLoaded={false}
        isLoading
      />
    );
    expect(wrapper.exists(FolderLoading)).toBe(true);
  });
  it('Renders item list', () => {
    const wrapper = mount(
      <FolderViewContainer
        viewType={'list'}
        triggerPagination={noop}
        isLoaded
        isLoading={false}
        items={items}
      />
    );
    expect(wrapper.contains(FolderListView)).toBe(true);
  });
});