import React from 'react';
import { bool, func } from 'prop-types';
import { noop } from 'lodash';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const type = "enableTimeOption"

export default function EnableTimeOption({ value, onChange }) {
  const handleChange = React.useCallback(
    (e) => {
      onChange({name: type, value: e.target.checked})
    },
    [],
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
      label="Enable time option"
    />
  )
}

EnableTimeOption.propTypes = {
  value: bool,
  onChange: func
}

EnableTimeOption.defaultProps = {
  onChange: noop
}
