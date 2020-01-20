import React from 'react';
import { mount } from 'enzyme';
import IconButton from '@material-ui/core/IconButton';
import FilterCenterFocus from '@material-ui/icons/FilterCenterFocus';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

import AreaInterest, { getAreaOfInterest } from './';

describe('Scenario: Area Interest', () => {
  const defaultAoI = {
    id: "test id",
    boundingPoly: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 }
    ]
  }
  const onEditAoI = jest.fn();
  const onRemoveAoI = jest.fn();
  const wrapper = mount(<AreaInterest areaOfInterest={defaultAoI} onEditAoI={onEditAoI} onRemoveAoI={onRemoveAoI} />);

  it('Should render with the default value filled in', () => {
    const location = getAreaOfInterest(defaultAoI);
    expect(wrapper.find('[data-test="coordinate"]').text()).toEqual(location);
    expect(wrapper.find(IconButton).exists()).toBeTruthy();
    expect(wrapper.find(FilterCenterFocus).exists()).toBeTruthy();
  });
  it('Test click Edit', () => {
    wrapper.find(Edit).simulate('click');
    expect(onEditAoI.mock.calls.length).toEqual(1);
  });
  it('Test click Delete', () => {
    wrapper.find(Delete).simulate('click');
    expect(onRemoveAoI.mock.calls.length).toEqual(1);
  });
});
