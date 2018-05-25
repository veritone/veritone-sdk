import React from 'react';
import LibCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// based on https://github.com/erikras/redux-form-material-ui/blob/5.0/src/Checkbox.js
const Checkbox = ({
  /* eslint-disable react/prop-types, react/jsx-no-bind */
  meta,
  input: { onChange, value, ...inputProps },
  label,
  labelProps,
  ...props
}) => (
  <FormControlLabel
    control={
      <LibCheckbox
        checked={!!value}
        onChange={(event, isInputChecked) => {
          onChange(isInputChecked);
        }}
        {...inputProps}
        {...props}
      />
    }
    label={label}
    {...labelProps}
  />
);

export default Checkbox;
