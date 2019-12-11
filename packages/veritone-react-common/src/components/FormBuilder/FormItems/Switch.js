import React from 'react';
import { string, bool, func } from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import MuiSwitch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import useStyles from './styles.js';

export default function Switch({
  label,
  required,
  name,
  onChange,
  instruction,
  value,
  error
}) {
  const handleChange = React.useCallback(
    (e) => onChange({ name, value: e.target.checked }),
    [name, onChange]
  );

  const styles = useStyles({});

  return (
    <FormControl
      fullWidth
      error={error.length > 0}
      className={styles.formItem}
      required={required}
    >
      <FormControlLabel
        control={
          <MuiSwitch
            checked={value}
            onChange={handleChange}
            color="primary"
            name={name}
          />
        }
        label={label}
      />
      {
        (error || instruction) && (
          <FormHelperText variant="outlined">
            {error || instruction}
          </FormHelperText>
        )
      }
    </FormControl>
  );
}

Switch.propTypes = {
  label: string,
  name: string,
  instruction: string,
  error: string,
  value: bool,
  required: bool,
  onChange: func,
}

Switch.defaultProps = {
  onChange: () => {},
  error: ''
}
