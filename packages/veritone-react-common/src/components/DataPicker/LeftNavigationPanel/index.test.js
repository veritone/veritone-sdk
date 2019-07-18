import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';

import ListItem from '@material-ui/core/ListItem';

import LeftNavigationPanel from './';

describe('LeftNavigationPanel', () => {
  it('Should display 3 buttons', () => {
    const wrapper = mount(
      <LeftNavigationPanel
        availablePickerTypes={['folder', 'stream', 'upload']}
        currentPickerType={'folder'}
        toggleContentView={noop}
      />
    );
    expect(wrapper.find(ListItem).length).toBe(3);
  });
});