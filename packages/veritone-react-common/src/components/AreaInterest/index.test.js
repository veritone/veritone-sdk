import React from 'react';
import { mount } from 'enzyme';

import AreaInterest, { getAreaOfInterest } from './index';

describe('Scenario: Area Interest', () => {
  const defaultAoI = {
    id: 'test id',
    boundingPoly: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ],
  };
  const onEditAoI = jest.fn();
  const onRemoveAoI = jest.fn();
  it('Should render with the default value filled in', () => {
    const wrapper = mount(
      <AreaInterest
        areaOfInterest={defaultAoI}
        onEditAoI={onEditAoI}
        onRemoveAoI={onRemoveAoI}
      />
    );
    const location = getAreaOfInterest(defaultAoI);
    expect(wrapper.find('.coordinate').text()).toEqual(location);
    expect(wrapper.find('IconButton').exists()).toBeTruthy();
    expect(wrapper.find('FilterCenterFocus').exists()).toBeTruthy();
  });
  it('Test click Edit', () => {
    const wrapper = mount(
      <AreaInterest
        areaOfInterest={defaultAoI}
        onEditAoI={onEditAoI}
        onRemoveAoI={onRemoveAoI}
      />
    );
    wrapper.find('Edit').simulate('click');
    expect(onEditAoI.mock.calls.length).toEqual(1);
  });
  it('Test click Delete', () => {
    const wrapper = mount(
      <AreaInterest
        areaOfInterest={defaultAoI}
        onEditAoI={onEditAoI}
        onRemoveAoI={onRemoveAoI}
      />
    );
    wrapper.find('Delete').simulate('click');
    expect(onRemoveAoI.mock.calls.length).toEqual(1);
  });
});
