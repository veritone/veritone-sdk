import React from 'react';
import TextField from '@material-ui/core/TextField';

const type = "min";

export default function Label({ value, onChange }) {
  return (
    <TextField
      label='Min value'
      variant="outlined"
      classes={{root: "configuration-input"}}
      fullWidth
      value={value}
      type="number"
      onChange={(e) => onChange({ name: type, value: e.target.value })}
    />
  )
}
