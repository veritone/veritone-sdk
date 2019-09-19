import React from 'react';
import { bool, func } from 'prop-types';
import { noop } from 'lodash';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const type = "required"

export default function Required({ value, onChange }) {
  const handleChange = React.useCallback(
    (e) => {
      onChange({name: type, value: e.target.checked})
    },
    [onChange],
  );

  return (
    <FormControlLabel
      control={
        <Checkbox
          color="primary"
          checked={value}
          onChange={handleChange}
        />
      }
      label="Required"
    />
  )
}

Required.propTypes = {
  value: bool,
  onChange: func
}

Required.defaultProps = {
  onChange: noop,
  value: false
}
