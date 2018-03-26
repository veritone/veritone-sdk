import React from 'react';
import { shallow } from 'enzyme';

import OAuthLoginButton from './';

describe('OAuthLoginButton', () => {
  it('Should exist', () => {
    const wrapper = shallow(<OAuthLoginButton />);
    expect(wrapper.find('button')).toHaveLength(1);
  });

  it('adds props.className to the root', function() {
    const wrapper = shallow(<OAuthLoginButton className="my-class" />);
    expect(wrapper.hasClass('my-class')).toBe(true);
  });

  it('shows only the icon when props.iconOnly is true', function() {
    const wrapper = shallow(<OAuthLoginButton iconOnly />);
    expect(wrapper.text()).toEqual('');
    expect(wrapper.find('img')).toHaveLength(1);
  });

  it('calls props.onClick when clicked', function() {
    const handler = jest.fn();
    const wrapper = shallow(<OAuthLoginButton onClick={handler} />);

    wrapper.simulate('click');

    expect(handler).toHaveBeenCalled();
  });
});
