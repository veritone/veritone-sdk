import React from 'react';

import { createMount } from '@material-ui/core/test-utils';
import Radio from '@material-ui/core/Radio';

import SelectionButton from './';

let mount;
beforeAll(() => {
  mount = createMount();
});

describe('SelectionButton', function() {
  it('it renders children correctly', function() {
    const label = 'hello world';

    const wrapper = mount(<SelectionButton>{label}</SelectionButton>);

    expect(wrapper.text()).toEqual(label);
  });

  it('it calls toggleSelection when clicked', function() {
    const label = 'hello world';
    const toggleSelection = jest.fn();

    const wrapper = mount(
      <SelectionButton toggleSelection={toggleSelection}>
        {label}
      </SelectionButton>
    );

    wrapper.simulate('click');
    expect(toggleSelection).toBeCalled();
  });

  it('it marks the radio button checked when selected', function() {
    const label = 'hello world';

    const wrapper = mount(
      <SelectionButton selected>{label}</SelectionButton>
    ).find(Radio);

    expect(wrapper.props().checked).toBeTruthy();
  });

  it('it marks the radio button as not checked when not selected', function() {
    const label = 'hello world';

    const wrapper = mount(<SelectionButton>{label}</SelectionButton>).find(
      Radio
    );

    expect(wrapper.props().checked).not.toBeTruthy();
  });
});
