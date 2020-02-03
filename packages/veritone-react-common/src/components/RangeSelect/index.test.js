import React from 'react';
import { mount } from 'enzyme';
import RangeSelect from './index';

describe('RangeSelect', () => {
  const onChangeConfidenceRange = jest.fn();
  it('Should render with the default value filled in', () => {
    const selectedConfidenceRange = [0, 100];
    const wrapper = mount(
      <RangeSelect
        onChangeConfidenceRange={onChangeConfidenceRange}
        selectedConfidenceRange={selectedConfidenceRange}
      />
    );
    expect(wrapper.find('Range').exists()).toBeTruthy();
  });

  it('Should render min max with random value filled in', () => {
    const selectedConfidenceRange = [25, 75];
    const wrapper = mount(
      <RangeSelect
        onChangeConfidenceRange={onChangeConfidenceRange}
        selectedConfidenceRange={selectedConfidenceRange}
      />
    );
    expect(wrapper.find('.value-min').text()).toEqual(
      String(selectedConfidenceRange[0])
    );
    expect(wrapper.find('.value-max').text()).toEqual(
      String(selectedConfidenceRange[1])
    );
  });
});
