import React from 'react';
import { mount } from 'enzyme';
import AffiliateStationsDialog from './index';

describe('Affiliated Stations Dialog', () => {
  it('should render affiliate stations dialog', () => {
    const onAdd = jest.fn();
    const onClose = jest.fn();
    const loadNextAffiliates = jest.fn();
    const wrapper = mount(
      <AffiliateStationsDialog
        loadNextAffiliates={loadNextAffiliates}
        onAdd={onAdd}
        onClose={onClose}
      />
    );
    expect(wrapper.find('.dialogTitle').text()).toEqual('Affiliated Stations');
    expect(loadNextAffiliates.mock.calls.length).toBe(1);
    wrapper
      .find('.dialogTitleActions')
      .find('button')
      .simulate('click');
    expect(onClose.mock.calls.length).toBe(1);
    wrapper
      .find('.actionButtons')
      .find('button')
      .simulate('click');
    expect(onClose.mock.calls.length).toBe(2);
  });
});
