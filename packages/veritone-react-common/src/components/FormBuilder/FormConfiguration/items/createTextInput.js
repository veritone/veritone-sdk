import React from 'react';
import { string, func, number, oneOfType } from 'prop-types';
import _ from 'lodash';
import TextField from '@material-ui/core/TextField';

export default function createTextInput({
  type = 'text',
  itemType,
  label
}) {
  function TextInputComponent({ value, onChange, className }) {
    const handleChange = React.useCallback(
      (e) => onChange({ name: itemType, value: e.target.value }),
      [onChange]
    );
    return (
      <TextField
        label={label}
        variant="outlined"
        fullWidth
        value={value}
        type={type}
        onChange={handleChange}
        className={className}
      />
    )
  }

  TextInputComponent.propTypes = {
    value: oneOfType([string, number]),
    onChange: func,
    className: string
  }

  TextInputComponent.defaultProps = {
    onChange: _.noop,
    value: ''
  }
  return TextInputComponent;
}
