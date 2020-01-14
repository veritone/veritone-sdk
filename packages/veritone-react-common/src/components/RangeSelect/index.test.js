import React from 'react';
import renderer from 'react-test-renderer';
import { RangeSelect } from './';
import { mount } from 'enzyme';

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
    expect(wrapper.find('[data-test="value-min"]').text()).toEqual(String(selectedConfidenceRange[0]));
    expect(wrapper.find('[data-test="value-max"]').text()).toEqual(String(selectedConfidenceRange[1]));
  });

});
