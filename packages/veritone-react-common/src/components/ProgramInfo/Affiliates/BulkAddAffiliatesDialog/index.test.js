import React from 'react';
import { mount } from 'enzyme';
import BulkAddAffiliateDialog from './index';

describe('Bulk Add Affiliate', () => {
  it('should render dialog', () => {
    const loadAllAffiliates = jest.fn();
    const onAdd = jest.fn();
    const onClose = jest.fn();
    const wrapper = mount(
      <BulkAddAffiliateDialog
        loadAllAffiliates={loadAllAffiliates}
        onAdd={onAdd}
        onClose={onClose}
      />
    );
    expect(wrapper.find('.dialogTitle').text()).toEqual('Bulk Add Affiliates');
    wrapper
      .find('.dialogTitle')
      .find('button')
      .simulate('click');
    expect(onClose.mock.calls.length).toBe(1);
    expect(wrapper.find('.bulkAddHelperText').text()).toEqual(
      'Use the provided template to bulk add affiliates.'
    );
    expect(wrapper.find('.actionButtons').find('button')).toHaveLength(1);
    expect(
      wrapper
        .find('.actionButtons')
        .find('button')
        .at(0)
        .find('.actionButtonLabel')
        .text()
    ).toEqual('Browse To Upload');
  });
});
