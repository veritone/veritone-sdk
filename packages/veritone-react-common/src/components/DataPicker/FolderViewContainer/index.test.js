import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';

import NullState from '../../NullState';
import FolderViewContainer from './';
import FolderLoading from './';

describe('FolderViewContainer', () => {
  it('Nullstate should show', () => {
    const fakeOnUpload = () => {};
    const wrapper = mount(
      <FolderViewContainer
        viewType={'list'}
        triggerPagination={noop}
        onUpload={fakeOnUpload}
        isLoaded
      />
    );
    expect(wrapper.contains(NullState)).toBe(true);
  });
  it('Should show loading spinner', () => {
    const fakeOnUpload = () => {};
    const wrapper = mount(
      <FolderViewContainer
        viewType={'list'}
        triggerPagination={noop}
        onUpload={fakeOnUpload}
        isLoaded={false}
        isLoading
      />
    );
    expect(wrapper.contains(FolderLoading)).toBe(true);
  });
});