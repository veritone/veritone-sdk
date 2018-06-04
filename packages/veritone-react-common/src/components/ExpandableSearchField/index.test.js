import React from 'react';
import { mount } from 'enzyme';

import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';

import ExpandableSearchField from './';

describe('ExpandableSearchField', function() {
  let onSearch = jest.fn();

  const expandableSearchBar = mount(
    <ExpandableSearchField onSearch={onSearch} />
  );

  const enterKey = { key: 'Enter', keyCode: 13, which: 13 };
  const searchValue = 'hello world';
  const changeValue = { target: { value: searchValue } };

  it('should exist', function() {
    expect(expandableSearchBar).toHaveLength(1);
  });

  it('renders a search button', function() {
    expect(expandableSearchBar.find(SearchIcon)).toHaveLength(1);
  });

  it('renders a textfield when clicked', function() {
    expandableSearchBar.find(SearchIcon).simulate('click');
    expect(expandableSearchBar.find(TextField)).toHaveLength(1);
  });

  it("renders a reset button after it's been clicked", function() {
    expect(expandableSearchBar.find(CloseIcon)).toHaveLength(1);
  });

  it("doesn't call onSearch when there is no input", function() {
    expandableSearchBar.find('input').simulate('keypress', enterKey);
    expect(onSearch.mock.calls.length).toBe(0);
  });

  it('calls onSearch with the seach value when there is input', function() {
    expandableSearchBar.find('input').simulate('change', changeValue);
    expandableSearchBar.find('input').simulate('keypress', enterKey);
    expect(onSearch.mock.calls.length).toBe(1);
    expect(onSearch.mock.calls[0][0]).toBe(searchValue);
  });

  it('resets the search value when the reset button is clicked', function() {
    expect(
      expandableSearchBar.find('input').getDOMNode().value.length
    ).toBeGreaterThan(0);
    expandableSearchBar.find(CloseIcon).simulate('click');
    expect(expandableSearchBar.find('input').getDOMNode().value.length).toBe(0);
  });
});
