import React from 'react';
import LibInput from 'material-ui/Input';

// fixme: not sure why this passthrough is needed?
/* eslint-disable react/prop-types */
const Input = ({ meta, input, ...props }) => {
  return <LibInput {...input} {...props} />;
};

export default Input;
