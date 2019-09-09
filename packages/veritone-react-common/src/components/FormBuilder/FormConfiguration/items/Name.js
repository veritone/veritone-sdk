import React from 'react';
import TextField from '@material-ui/core/TextField';

const type = "name"

export default function Name({ value, onChange }) {
  return (
    <TextField
      label='Field Name'
      variant="outlined"
      classes={{root: "configuration-input"}}
      fullWidth
      value={value}
      onChange={(e) => onChange({ name: type, value: e.target.value })}
    />
  )
}
