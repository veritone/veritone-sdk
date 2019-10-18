import React from 'react';
import { arrayOf, shape, string, func, objectOf, any } from 'prop-types';
import formItems from './FormItems';

export default function Form({ formDefinition, onChange, value, errors }) {
  const handleChange = React.useCallback(
    ({ name, value: itemValue }) => {
      onChange(Object.assign({}, value, { [name]: itemValue }))
    },
    [value, onChange],
  );

  return (
    <div>
      {
        formDefinition.map(formItem => {
          const FormItem = formItems[formItem.type];
          FormItem.displayName = 'FormItem';
          return (
            <FormItem
              key={formItem.name}
              {...formItem}
              value={value[formItem.name]}
              onChange={handleChange}
              error={errors[formItem.name]}
            />
          );
        })
      }
    </div>
  )
}

Form.propTypes = {
  formDefinition: arrayOf(shape({ name: string })),
  onChange: func,
  value: objectOf(any),
  errors: objectOf(string)
}

Form.defaultProps = {
  errors: {}
}
