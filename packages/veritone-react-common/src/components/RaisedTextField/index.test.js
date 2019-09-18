import React from 'react';
import { shallow, mount } from 'enzyme';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Edit from '@material-ui/icons/Edit';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import RaisedTextField from './';

describe('RaisedTextField', function() {
  it('passes className to the root element', function() {
    const wrapper = shallow(<RaisedTextField className="test" />);
    expect(wrapper.find('.test')).toHaveLength(1);
  });

  it('passes containerStyle to the root element', function() {
    const wrapper = mount(
      <RaisedTextField
        containerStyle={{
          background: 'red'
        }}
      />
    );

    expect(wrapper.find(Paper).props().style.background).toBe('red');
  });

  it('shows the label', function() {
    const wrapper = mount(<RaisedTextField label="test" />);
    expect(wrapper.text()).toMatch(/test/);
  });

  it('shows the value', function() {
    const wrapper = mount(<RaisedTextField value="testvalue" />);
    expect(wrapper.text()).toMatch(/testvalue/);
  });

  it('shows the label + value', function() {
    const wrapper = mount(
      <RaisedTextField label="testlabel" value="testvalue" />
    );
    expect(wrapper.text()).toMatch(/testvalue/);
    expect(wrapper.text()).toMatch(/testlabel/);
  });

  it('shows correct action icon', function() {
    let wrapper = mount(<RaisedTextField action="go" />);
    expect(wrapper.find(KeyboardArrowRight)).toHaveLength(1);

    wrapper = mount(<RaisedTextField action="edit" />);
    expect(wrapper.find(Edit)).toHaveLength(1);

    wrapper = mount(<RaisedTextField />);
    expect(wrapper.find(IconButton).find('svg')).toHaveLength(0);
  });

  it('calls onClickAction', function() {
    const handler = jest.fn();
    const handler2 = jest.fn();
    let wrapper = mount(
      <RaisedTextField action="go" onClickAction={handler} />
    );

    wrapper.find(IconButton).simulate('click');
    expect(handler).toHaveBeenCalled();

    wrapper = mount(<RaisedTextField action="edit" onClickAction={handler2} />);
    wrapper.find(IconButton).simulate('click');
    expect(handler2).toHaveBeenCalled();
  });
});
