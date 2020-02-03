import React from 'react';
import { mount } from 'enzyme';

import { SentimentSearchForm } from './index';

describe('SentimentSearchModal', () => {
  it('Should render in initial state with value being set', () => {
    const wrapper = mount(<SentimentSearchForm inputValue={'Positive'} />);
    expect(wrapper.find('input').instance().value).toEqual('Positive');
  });

  it('Should change state once new value has been selected', () => {
    const wrapper = mount(<SentimentSearchForm inputValue={'Negative'} />);
    expect(wrapper.find('input').instance().value).toEqual('Negative');
    const wrapper2 = mount(<SentimentSearchForm inputValue={'Positive'} />);
    expect(wrapper2.find('input').instance().value).toEqual('Positive');
  });

  it('Expect cancel button to call cancel function', () => {
    const cancel = jest.fn();
    const wrapper = mount(
      <SentimentSearchForm inputValue={'Positive'} cancel={cancel} />
    );
    wrapper.find('button.sentimentSearchCancel').simulate('click');
    expect(cancel).toHaveBeenCalled();
  });

  it('Except onSearch to be called when a value has been selected and the search button is pressed ', () => {
    const submit = jest.fn();
    const wrapper = mount(
      <SentimentSearchForm onSubmit={submit} inputValue="Positive" />
    );
    wrapper.find('button.sentimentSearchSubmit').simulate('click');
    expect(submit).toHaveBeenCalled();
  });
});
