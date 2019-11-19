import React from 'react';
import { bool, string, func } from 'prop-types';
import TextField from '@material-ui/core/TextField';
import useStyles from './styles.js';

export default function TextInput({ label, required, name, onChange, instruction, value, error }) {
  const handleChange = React.useCallback(
    (e) => {
      onChange({ name, value: e.target.value})
    },
    [name, onChange],
  );

  const styles = useStyles({});

  return (
    <TextField
      fullWidth
      label={label}
      required={required}
      error={error.length > 0}
      helperText={error || instruction}
      variant="outlined"
      value={value}
      onChange={handleChange}
      className={styles.formItem}
      name={name}
    />
  )
}

TextInput.propTypes = {
  label: string,
  required: bool,
  name: string,
  onChange: func,
  instruction: string,
  value: string,
  error: string
}

TextInput.defaultProps = {
  label: 'Text Input',
  name: `textInput-${Date.now()}`,
  onChange: () => { },
  value: '',
  error: ''
}
