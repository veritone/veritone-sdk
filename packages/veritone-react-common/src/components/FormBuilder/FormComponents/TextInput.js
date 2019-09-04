import React from 'react';
import { string, bool, func } from 'prop-types';
import _ from 'lodash';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';

export default function TextInput({
  label,
  required,
  name,
  onChange,
  instruction,
  value,
  error
}) {
  const helperText = instruction ? instruction : '';
  const handleChange = (e) => onChange({ name, value: e.target.value });

  return (
    <FormGroup>
      <TextField
        fullWidth
        required={required}
        className="configurationItem"
        label={label}
        helperText={instruction}
        error={error}
        variant="outlined"
        value={value}
        onChange={handleChange}
      />
    </FormGroup>
  )
}

TextInput.propTypes = {
  label: string,
  required: bool,
  name: string,
  instruction: string,
  value: string,
  error: string,
  onChange: func
}

TextInput.defaultProps = {
  onChange: _.noop
}
