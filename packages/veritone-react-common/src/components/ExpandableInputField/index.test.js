import React from 'react';
import { mount } from 'enzyme';

import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';

import ExpandableInputField from './';

describe('ExpandableInputField', function() {
  const enterKey = { key: 'Enter', keyCode: 13, which: 13 };
  const searchValue = 'hello world';
  const changeValue = { target: { value: searchValue } };

  let onSearch;
  let onFocus;
  let onBlur;
  let onChange;
  let expandableInputField;

  beforeEach(function() {
    onSearch = jest.fn();
    onFocus = jest.fn();
    onBlur = jest.fn();
    onChange = jest.fn();

    expandableInputField = mount(
      <ExpandableInputField
        onFocus={onFocus}
        onBlur={onBlur}
        onSearch={onSearch}
        icon={<SearchIcon />}
        onChange={onChange}
      />
    );
  });

  it('should exist', function() {
    expect(expandableInputField).toHaveLength(1);
  });

  it('renders an IconButton for expansion', function() {
    expect(expandableInputField.find(SearchIcon)).toHaveLength(1);
  });

  it('renders a textfield when the IconButton is clicked', function() {
    expandableInputField.find(SearchIcon).simulate('click');
    expect(expandableInputField.find(TextField)).toHaveLength(1);
  });

  it('calls onFocus when the input is focused', function() {
    expandableInputField.find(SearchIcon).simulate('click');
    expandableInputField.find('input').simulate('focus');
    expect(onFocus.mock.calls.length).toBe(1);
  });

  it("renders a reset button after it's been clicked", function() {
    expandableInputField.find(SearchIcon).simulate('click');
    expect(expandableInputField.find(CloseIcon)).toHaveLength(1);
  });

  it('calls onChange with the new input value', function() {
    expandableInputField.find(SearchIcon).simulate('click');
    expandableInputField.find('input').simulate('change', changeValue);
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0].target.value).toBe(searchValue);
  });

  it('calls onSearch when the enter key is pressed', function() {
    expandableInputField.find(SearchIcon).simulate('click');
    expandableInputField.find('input').simulate('change', changeValue);
    expandableInputField.find('input').simulate('keypress', enterKey);
    expect(onSearch.mock.calls.length).toBe(1);
  });

  it('calls onBlur after focus is lost', function() {
    expandableInputField.find(SearchIcon).simulate('click');
    expandableInputField.find('input').simulate('change', changeValue);
    expandableInputField.find('input').simulate('blur');
    expect(onBlur.mock.calls.length).toBe(1);
  });

  it('resets the search value when the reset button is clicked', function() {
    const reset = jest.fn();
    const field = mount(
      <ExpandableInputField
        onSearch={onSearch}
        icon={<SearchIcon />}
        value={'oldValue'}
        onReset={reset}
      />
    );
    field.find(SearchIcon).simulate('click');
    field.find(CloseIcon).simulate('click');
    expect(reset.mock.calls.length).toBe(1);
  });
});
