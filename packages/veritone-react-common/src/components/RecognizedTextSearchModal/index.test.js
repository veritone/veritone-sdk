import React from 'react';
import { mount } from 'enzyme';

import { RecognizedTextSearchForm } from './index';

describe('RecognizedTextSearchModal', () => {
  it('Should render with the default value filled in', () => {
    const wrapper = mount(
      <RecognizedTextSearchForm defaultValue={'Hakuna Matata'} />
    );
    expect(wrapper.find('input').instance().value).toEqual('Hakuna Matata');
    expect(wrapper.find('button.textSearchSubmit').instance().disabled).toEqual(
      false
    );
  });

  it('Search button should be disabled when opened with no initial state', () => {
    const wrapper = mount(<RecognizedTextSearchForm />);
    expect(wrapper.find('button.textSearchSubmit').instance().disabled).toEqual(
      true
    );
  });

  it('Search button should be disabled when opened with no initial state, then enabled once text has been entered', () => {
    const wrapper = mount(<RecognizedTextSearchForm inputValue={''} />);
    expect(wrapper.find('button.textSearchSubmit').instance().disabled).toEqual(
      true
    );
    const wrapper2 = mount(
      <RecognizedTextSearchForm inputValue={'Hakuna Matata'} />
    );
    expect(
      wrapper2.find('button.textSearchSubmit').instance().disabled
    ).toEqual(false);
  });

  it('Expect cancel button to call cancel function', () => {
    const cancel = jest.fn();
    const wrapper = mount(<RecognizedTextSearchForm cancel={cancel} />);
    wrapper.find('button.textSearchCancel').simulate('click');
    expect(cancel).toHaveBeenCalled();
  });

  it('Except onKeyPress to be called when a search phrase has been entered ', () => {
    const keypress = jest.fn();
    const wrapper = mount(<RecognizedTextSearchForm onKeyPress={keypress} />);
    wrapper.find('input').simulate('keypress');
    expect(keypress).toHaveBeenCalled();
  });

  it('Except onSearch to be called when a search phrase has been entered and the search button is pressed ', () => {
    const submit = jest.fn();
    const wrapper = mount(
      <RecognizedTextSearchForm onSubmit={submit} inputValue="Hakuna Matata" />
    );
    wrapper.find('button.textSearchSubmit').simulate('click');
    expect(submit).toHaveBeenCalled();
  });
});
