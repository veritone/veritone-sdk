import React from 'react';
import { mount } from 'enzyme';

import AppFooter from './';

describe('AppFooter', () => {
  it('Should be a footer tag', () => {
    const wrapper = mount(<AppFooter/>);
    expect(wrapper.find('footer')).toHaveLength(1);
  });
});
