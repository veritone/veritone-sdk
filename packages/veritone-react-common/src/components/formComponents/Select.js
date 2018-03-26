import React from 'react';
import LibSelect from 'redux-form-material-ui';

/* eslint-disable react/prop-types */
const Select = ({ meta, input, ...props }) => {
  return <LibSelect {...input} {...props} />;
};

export default Select;
