import React from 'react';
import { string, bool, func } from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import itemPropType from './itemPropType';
import styles from './styles.scss';


export default function Select({
  label,
  required,
  name,
  onChange,
  value,
  items,
  error,
  instruction
}) {
  const handleChange = React.useCallback(
    (e) => onChange({ name, value: e.target.value }),
    [onChange, name]
  );

  return (
    <TextField
      error={error.length > 0}
      label={label}
      variant="outlined"
      select
      fullWidth
      required={required}
      helperText={error || instruction}
      value={value}
      onChange={handleChange}
      className={styles['form-item']}
      name={name}
    >
      {items.map(({ id, value }) => (
        <MenuItem key={id} value={value}>
          {value}
        </MenuItem>
      ))}
    </TextField>
  );
}

Select.propTypes = {
  items: itemPropType,
  onChange: func,
  label: string,
  name: string,
  required: bool,
  value: string,
  error: string,
  instruction: string
}

Select.defaultProps = {
  items: [],
  onChange: () => {},
  error: '',
  value: ''
};
