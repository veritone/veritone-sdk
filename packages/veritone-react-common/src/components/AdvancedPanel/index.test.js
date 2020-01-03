import React from 'react';
import { shallow } from 'enzyme';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import CloseIcon from '@material-ui/icons/Close';

import LocationSelect from '../AreaSelect';
import RangeSelect from '../RangeSelect';
import { AdvancedPanel } from './';

describe('Advanced Panel', () => {
  const handleClose = jest.fn();
  const handleReset = jest.fn();
  const advancedOptions = {};
  const onAddAdvancedSearchParams = jest.fn();
  const searchByTag = "search by tag mock";

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
    ).dive();

    expect(wrapper.find('[data-test="title-text"]').first().text()).toEqual('Advanced Options');
    expect(wrapper.find(InfoOutlineIcon).exists()).toBeTruthy();
    expect(wrapper.find(CloseIcon).exists()).toBeTruthy();
    expect(wrapper.find(LocationSelect).exists()).toBeTruthy();
    expect(wrapper.find(RangeSelect).exists()).toBeTruthy();
    expect(wrapper.find('[data-test="only-return-text"]').first().text()).toEqual(`Only return search results for this ${searchByTag} if they appear in a defined region.`);
    expect(wrapper.find('[data-test="only-return-text"]').last().text()).toEqual(`Search by the percentage of confidence of this ${searchByTag}.`);

    wrapper.find('[data-test="reset-all"]').simulate('click');
    expect(handleReset.mock.calls.length).toEqual(1);

    wrapper.find('[data-test="vbtn-cancel"]').simulate('click');
    expect(handleClose.mock.calls.length).toEqual(1);

  });
});
