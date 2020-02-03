import React from 'react';
import { shallow, mount } from 'enzyme';

import SearchAutocomplete, { SearchAutocompleteDownshift } from './index';

describe('SearchAutocomplete', () => {
  const componentState = {
    error: false,
    queryString: '',
    queryResults: [],
  };
  const onChange = jest.fn();
  const cancel = jest.fn();
  it('SearchAutocomplete: Should render with the default value filled in', () => {
    const wrapper = shallow(
      <SearchAutocomplete
        onChange={onChange}
        cancel={cancel}
        componentState={componentState}
      />
    );
    expect(wrapper.find('SearchAutocompleteDownshift').exists());
  });

  it('SearchAutocomplete: Should render with the default value filled in', () => {
    const debouncedOnChange = jest.fn();
    const onClickAutocomplete = jest.fn();
    const isOpen = true;
    const queryResults = [
      { key: '! but what lies beneath?', doc_count: 18, docs: [] },
      { key: '*leartone', doc_count: 38, docs: [] },
      { key: '*leartone _', doc_count: 46, docs: [] },
      { key: '- Nuovets vs L.', doc_count: 88, docs: [] },
      { key: '-leartone', doc_count: 14, docs: [] },
      { key: '-leartonel', doc_count: 10, docs: [] },
      { key: '/LARGE-', doc_count: 18, docs: [] },
      { key: '0 La', doc_count: 30, docs: [] },
      { key: '0 Lae', doc_count: 12, docs: [] },
      { key: '1 1L yan', doc_count: 4, docs: [] },
    ];

    const wrapper = mount(
      <SearchAutocompleteDownshift
        defaultIsOpen={true}
        cancel={cancel}
        queryString={'light'}
        debouncedOnChange={debouncedOnChange}
        results={queryResults}
        onClickAutocomplete={onClickAutocomplete}
        isOpen={isOpen}
      />
    );
    expect(wrapper.find('Downshift').exists());
    expect(wrapper.find('ListItem').exists());
    wrapper
      .find('TextField')
      .first()
      .simulate('click', { preventDefault() {} });
    expect(onClickAutocomplete.mock.calls.length).toEqual(1);
  });
});
