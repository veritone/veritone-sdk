import React from 'react';
import { shallow } from 'enzyme';

import { AdvancedPanel } from './index';

describe('Advanced Panel', () => {
  const handleClose = jest.fn();
  const handleReset = jest.fn();
  const advancedOptions = {};
  const onAddAdvancedSearchParams = jest.fn();
  const searchByTag = 'search by tag mock';

  it('Advanced Search: Should render with the default value filled in', () => {
    const open = true;
    const wrapper = shallow(
      <AdvancedPanel
        open={open}
        handleClose={handleClose}
        handleReset={handleReset}
        advancedOptions={advancedOptions}
        onAddAdvancedSearchParams={onAddAdvancedSearchParams}
        searchByTag={searchByTag}
      />
    );
    expect(wrapper.find('.title-text').text()).toEqual('Advanced Options');
    expect(wrapper.find('InfoOutlineIcon').exists());
    expect(wrapper.find('CloseIcon').exists());
    expect(wrapper.find('LocationSelect').exists());
    expect(wrapper.find('RangeSelect').exists());
    expect(
      wrapper
        .find('.only-return-text')
        .first()
        .text()
    ).toEqual(
      `Only return search results for this ${searchByTag} if they appear in a defined region.`
    );
    expect(
      wrapper
        .find('.only-return-text')
        .last()
        .text()
    ).toEqual(`Search by the percentage of confidence of this ${searchByTag}.`);

    wrapper.find('.reset-all').simulate('click');
    expect(handleReset.mock.calls.length).toEqual(1);

    wrapper.find('.vbtn-cancel').simulate('click');
    expect(handleClose.mock.calls.length).toEqual(1);
  });
});
