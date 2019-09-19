import React from 'react';
import {string, func } from 'prop-types';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import _ from 'lodash';

const dateFormats = [
  'dd-MM-yyyy',
  'MM-dd-yyyy',
  'yyyy-MM-dd'
];

const type = 'dateFormat';

export default function DateFormat({ value='dd-MM-yyyy', onChange }) {
  const handleChange = React.useCallback(
    (e) => {
      onChange({ name: type, value: e.target.value})
    },
    [],
  );

  return (
    <TextField
      label='Date format'
      variant="outlined"
      select
      classes={{ root: "configuration-input" }}
      fullWidth
      value={value}
      helperText="Select your date format"
      onChange={handleChange}
    >
      {dateFormats.map(format => (
        <MenuItem key={format} value={format}>
          {format}
        </MenuItem>
      ))}
    </TextField>
  )
}

DateFormat.propTypes = {
  value: string,
  onChange: func
}

DateFormat.defaultProps = {
  onChange: _.noop,
  value: dateFormats[0]
}
