import React from 'react';
import { mount } from 'enzyme';

import RangeSlider from './';

describe('RangeSlider - Single', function() {
  const wrapper = mount(
    <RangeSlider
      min={10}
      max={90}
      value={30}
      prefix="$"
      suffix="%"
      showValues
    />
  );

  it('Missing track background', function() {
    expect(wrapper.find('.background')).toHaveLength(1);
  });

  it('Missing track highlight', function() {
    expect(wrapper.find('.highlight')).toHaveLength(1);
  });

  it('Single Range Slider must have 1 thumb', function() {
    expect(wrapper.find('button')).toHaveLength(1);
  });

  it('Must have 1 hit area', function() {
    expect(wrapper.find('.hitArea')).toHaveLength(1);
  });

  it('Should not have block area', function() {
    expect(wrapper.find('.backArea')).toHaveLength(1);
  });

  it('Missing prefix', function() {
    expect(/^\$.*/.test(wrapper.text())).toBe(true);
  });

  it('Missing suffix', function() {
    expect(/.*%$/.test(wrapper.text())).toBe(true);
  });

  it('Wrong Slider Value', function() {
    expect(/^.*30.*$/.test(wrapper.text())).toBe(true);
    expect(wrapper.state('upperValue')).toEqual(30);
    expect(wrapper.state('upperRatio')).toEqual(0.25);
  });

  it('Invalid lower bound values', function() {
    expect(wrapper.state('lowerRatio')).toEqual(0);
  });
});

describe('RangeSlider - Dual', function() {
  const wrapper = mount(
    <RangeSlider
      dual
      min={10}
      max={90}
      lowerValue={30}
      upperValue={50}
      prefix="$"
      suffix="%"
      showValues
    />
  );

  it('Missing track background', function() {
    expect(wrapper.find('.background')).toHaveLength(1);
  });

  it('Missing track highlight', function() {
    expect(wrapper.find('.highlight')).toHaveLength(1);
  });

  it('Dual Range Slider must have 2 thumbs', function() {
    expect(wrapper.find('button')).toHaveLength(2);
  });

  it('Must have 1 Hit Area', function() {
    expect(wrapper.find('.hitArea')).toHaveLength(1);
  });

  it('Missing Block Area', function() {
    expect(wrapper.find('.backArea')).toHaveLength(2);
  });

  it('Missing prefix', function() {
    expect(/^\$.*/.test(wrapper.text())).toBe(true);
  });

  it('Missing suffix', function() {
    expect(/.*%$/.test(wrapper.text())).toBe(true);
  });

  it('Invalid lower value', function() {
    expect(/^.*30.*$/.test(wrapper.text())).toBe(true);
    expect(wrapper.state('lowerValue')).toEqual(30);
    expect(wrapper.state('lowerRatio')).toEqual(0.25);
  });

  it('Invalid uper value', function() {
    expect(/^.*50.*$/.test(wrapper.text())).toBe(true);
    expect(wrapper.state('upperValue')).toEqual(50);
    expect(wrapper.state('upperRatio')).toEqual(0.5);
  });
});
