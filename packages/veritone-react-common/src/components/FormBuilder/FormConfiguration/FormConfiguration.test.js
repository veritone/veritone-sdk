import React from 'react';
import { mount } from 'enzyme';
import { wrapInTestContext } from 'react-dnd-test-utils';
import typeConfiguration, { initData } from '../typeConfiguration';
import FormConfiguration from './';

describe('form configuration', () => {
  it('Should render form configuration', () => {
    Object.keys(typeConfiguration)
      .forEach(type => {
        const onChange = jest.fn();
        const data = typeConfiguration[type].reduce((p, c) => ({
          ...p,
          [c]: initData[c]
        }), {});
        const FormConfigurationWithContext = wrapInTestContext(FormConfiguration);
        const wrapper = mount(
          <FormConfigurationWithContext
            type={type}
            onChange={onChange}
            {...data}
          />
        );
        expect(wrapper.find('FormConfigurationItem')).toHaveLength(typeConfiguration[type].length);
        wrapper.find('FormConfigurationItem').forEach(node => expect(node.prop('onChange')).toBe(onChange));
      })
  })
})
