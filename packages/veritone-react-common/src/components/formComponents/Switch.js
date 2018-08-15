import React from 'react';
import LibSwitch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// based on https://github.com/erikras/redux-form-material-ui/blob/5.0/src/Checkbox.js
const Switch = ({
  /* eslint-disable react/prop-types, react/jsx-no-bind */
  meta,
  input: { onChange, value, ...inputProps },
  label,
  labelProps,
  ...props
}) => (
  <FormControlLabel
    control={
      <LibSwitch
        checked={!!value}
        onChange={(event, isSwitchChecked) => {
          onChange(isSwitchChecked);
        }}
        {...inputProps}
        {...props}
      />
    }
    label={label}
    {...labelProps}
  />
);

export default Switch;
