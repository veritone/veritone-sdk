import React from 'react';
import { string, func } from 'prop-types';
import { noop } from 'lodash';
import TextField from '@material-ui/core/TextField';

const type = "instruction"

export default function Instruction({ value, onChange }) {
  const handleChange = React.useCallback((e) => onChange({
    name: type,
    value: e.target.value
  }), []);
  return (
    <TextField
      label='Field Instruction'
      variant="outlined"
      classes={{root: "configuration-input"}}
      value={value}
      multiline
      rows={4}
      fullWidth
      onChange={handleChange}
    />
  )
}

Instruction.propTypes = {
  value: string,
  onChange: func
}

Instruction.defaultProps = {
  onChange: noop
}
