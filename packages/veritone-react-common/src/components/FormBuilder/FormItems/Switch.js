import React from 'react';
import { string, bool, func } from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import MuiSwitch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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

  return (
    <FormControl error={error.length > 0}>
      <FormControlLabel
        control={
          <MuiSwitch
            checked={value}
            onChange={handleChange}
            color="primary"
          />
        }
        label={`${label || name}` + `${required ? ' *' : ''}`}
      />
      <FormHelperText>{error || instruction}</FormHelperText>
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
