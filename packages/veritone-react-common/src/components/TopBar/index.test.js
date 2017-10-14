import React from 'react';
import { mount, shallow } from 'enzyme';

import TopBar from './';
import {appBarHeight} from '../AppBar';

describe('TopBar', function() {
  it('exists', function() {
    const wrapper = shallow(<TopBar/>);
    expect(wrapper.length).toBeTruthy();
  });

  it('adds top offset with props.appBarOffset', function() {
    const wrapper = shallow(<TopBar appBarOffset/>);
    console.log(wrapper.props().style);
    expect(wrapper.props().style.top).toBe(appBarHeight);
  });
});
