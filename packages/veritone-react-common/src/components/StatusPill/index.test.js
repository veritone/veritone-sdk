import React from 'react';
import { mount } from 'enzyme';
import StatusPill from './';

describe('StatusPill', () => {
  it('Should render props.status', () => {
    let wrapper = mount(<StatusPill status='active' />);
    expect(wrapper.text()).toMatch(/active/);
    let span = wrapper.find('span');
    expect(span).toHaveLength(1);
    expect(span.get(0).props.children).toEqual('active');

    wrapper = mount(<StatusPill status='inactive' />);
    expect(wrapper.text()).toMatch(/inactive/);
    span = wrapper.find('span');
    expect(span.get(0).props.children).toEqual('inactive');

    wrapper = mount(<StatusPill status='paused' />);
    expect(wrapper.text()).toMatch(/paused/);
    span = wrapper.find('span');
    expect(span.get(0).props.children).toEqual('paused');

    wrapper = mount(<StatusPill status='processing' />);
    expect(wrapper.text()).toMatch(/processing/);
    span = wrapper.find('span');
    expect(span.get(0).props.children).toEqual('processing');
  });

  it('Should render correct styles', () => {
    let wrapper = mount(<StatusPill status='active' />);
    expect(wrapper.find('div').get(0).props.className).toEqual('statusPill');
    expect(wrapper.find('div').get(0).props.style).toHaveProperty('backgroundColor', '#00C853');
    expect(wrapper.find('div').get(0).props.style).toHaveProperty('color', '#FFFFFF');

    const span = wrapper.find('span');
    expect(span).toHaveLength(1);
    expect(span.get(0).props.className).toEqual('statusPillText');

    wrapper = mount(<StatusPill status='inactive' />);
    expect(wrapper.find('div').get(0).props.style).toHaveProperty('backgroundColor', '#9E9E9E');
    expect(wrapper.find('div').get(0).props.style).toHaveProperty('color', '#FFFFFF');

    wrapper = mount(<StatusPill status='paused' />);
    expect(wrapper.find('div').get(0).props.style).toHaveProperty('backgroundColor', '#FFFFFF');
    expect(wrapper.find('div').get(0).props.style).toHaveProperty('color', '#607D8B');
    expect(wrapper.find('div').get(0).props.style).toHaveProperty('border', '1px solid #607D8B');

    wrapper = mount(<StatusPill status='processing' />);
    expect(wrapper.find('div').get(0).props.style).toHaveProperty('backgroundColor', '#2196F3');
    expect(wrapper.find('div').get(0).props.style).toHaveProperty('color', '#FFFFFF');
  });
});