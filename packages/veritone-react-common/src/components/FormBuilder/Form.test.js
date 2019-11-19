import React from 'react';
import { mount } from 'enzyme';
import Form from './Form';

describe('Form', () => {
  it('Form empty when formDefinition is empty', () => {
    const wrapper = mount(<Form formDefinition={[]} />);
    expect(wrapper.find('FormItem').length).toEqual(0);
  })
  it('Render form when formDefinition is not empty', () => {
    const formDefinition = [
      {
        name: 'firstName',
        type: 'textInput',
      },
      {
        name: 'email',
        type: 'textInput'
      },
      {
        name: 'gender',
        type: 'radio',
        items: [
          {
            value: 'Male',
            id: '1'
          },
          {
            value: 'Female',
            id: '2'
          },
          {
            value: 'Non specific',
            id: '3'
          }
        ]
      }
    ];
    const onChange = jest.fn();
    const value = {};
    const errors = {};

    const wrapper = mount(
      <Form
        formDefinition={formDefinition}
        onChange={onChange}
        value={value}
        errors={errors}
      />
    );

    expect(wrapper.find('FormItem').length).toBe(formDefinition.length);
    wrapper.find('FormItem').forEach((node, index) => {
      expect(node.prop('name')).toEqual(formDefinition[index].name);
      const name = formDefinition[index].name;
      const itemValue = 'New Value';
      node.prop('onChange')({name, value: itemValue});
      expect(onChange).toHaveBeenCalledWith(Object.assign(
        {},
        value,
        {
          [name]: itemValue
        }
      ));
    })
  })
})
