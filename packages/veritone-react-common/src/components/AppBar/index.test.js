import React from 'react';
import { mount } from 'enzyme';

import AppBar from './';

describe('AppBar', () => {
  it('Should be a header tag', () => {
    const wrapper = mount(<AppBar />);
    expect(wrapper.find('header')).toHaveLength(1);
  });
});
