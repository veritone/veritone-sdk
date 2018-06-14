import React from 'react';
import { mount } from 'enzyme';

import Lozenge from './';

describe('Lozenge', function() {
  it('should display props.children', function() {
    const wrapper = mount(<Lozenge>Test</Lozenge>);

    expect(wrapper.text()).toEqual('Test');
  });

  it('should use the correct background color based on props.backgroundColor', function() {
    const wrapper = mount(<Lozenge backgroundColor="red">Test</Lozenge>);

    expect(wrapper.find('div').get(0).props.style).toHaveProperty(
      'backgroundColor',
      'red'
    );
  });

  it('should use the correct text color based on props.textColor', function() {
    const wrapper = mount(<Lozenge textColor="red">Test</Lozenge>);

    expect(wrapper.find('div').get(0).props.style).toHaveProperty(
      'color',
      'red'
    );
  });

  it('should use the correct icon based on props.iconClassName', function() {
    const wrapper = mount(<Lozenge iconClassName="icon-face">Test</Lozenge>);

    expect(wrapper.find('i').get(0).props.className).toEqual('icon-face');
  });
});
