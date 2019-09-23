import React from 'react';
import { string, func } from 'prop-types';
import { noop } from 'lodash';
import TextField from '@material-ui/core/TextField';

const type = "label";

export default function Label({ value, onChange }) {
  const handleChange = React.useCallback((e) => onChange({
    name: type,
    value: e.target.value
  }), []);
  return (
    <TextField
      label='Field Label'
      variant="outlined"
      classes={{root: "configuration-input"}}
      fullWidth
      value={value}
      onChange={handleChange}
    />
  )
}

Label.propTypes = {
  value: string,
  onChange: func
}

Label.defaultProps = {
  onChange: noop
}
