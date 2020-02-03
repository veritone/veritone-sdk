import React from 'react';
import { mount } from 'enzyme';

import { DocumentSearchForm } from './index';

describe('DocumentSearchModal', () => {
  it('Should render with the default value filled in', () => {
    const wrapper = mount(<DocumentSearchForm defaultValue={'Lakers'} />);
    expect(wrapper.find('input').instance().value).toEqual('Lakers');
    expect(wrapper.find('button.transcriptSubmit').instance().disabled).toEqual(
      false
    );
  });

  it('Search button should be disabled when opened with no initial state', () => {
    const wrapper = mount(<DocumentSearchForm />);
    expect(wrapper.find('button.transcriptSubmit').instance().disabled).toEqual(
      true
    );
  });

  it('Search button should be disabled when opened with no initial state, then enabled once text has been entered', () => {
    const wrapper = mount(<DocumentSearchForm inputValue={''} />);
    expect(wrapper.find('button.transcriptSubmit').instance().disabled).toEqual(
      true
    );
    const wrapper2 = mount(<DocumentSearchForm inputValue={'lakers'} />);
    expect(
      wrapper2.find('button.transcriptSubmit').instance().disabled
    ).toEqual(false);
  });

  it('Expect cancel button to call cancel function', () => {
    const cancel = jest.fn();
    const wrapper = mount(<DocumentSearchForm cancel={cancel} />);
    wrapper.find('button.transcriptCancel').simulate('click');
    expect(cancel).toHaveBeenCalled();
  });

  it('Except onKeyPress to be called when a search phrase has been entered ', () => {
    const keypress = jest.fn();
    const wrapper = mount(<DocumentSearchForm onKeyPress={keypress} />);
    wrapper.find('input').simulate('keypress');
    expect(keypress).toHaveBeenCalled();
  });

  it('Except onSearch to be called when a search phrase has been entered and the search button is pressed ', () => {
    const submit = jest.fn();
    const wrapper = mount(
      <DocumentSearchForm onSubmit={submit} inputValue="lakers" />
    );
    wrapper.find('button.transcriptSubmit').simulate('click');
    expect(submit).toHaveBeenCalled();
  });
});
