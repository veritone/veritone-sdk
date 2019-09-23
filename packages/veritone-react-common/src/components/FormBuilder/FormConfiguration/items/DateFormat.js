import React from 'react';
import { string, func, bool } from 'prop-types';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import _ from 'lodash';

const dateFormats = [
  'dd-MM-yyyy',
  'MM-dd-yyyy',
  'yyyy-MM-dd'
];

const dateTimeFormats = [
  'dd-MM-yyyy HH:MM',
  'MM-dd-yyyy HH:MM',
  'yyyy-MM-dd HH:MM'
];

const type = 'dateFormat';

function getFormatValue(value, enableTimeOption) {
  if (enableTimeOption && dateFormats.includes(value)) {
    return dateTimeFormats[dateFormats.indexOf(value)];
  }
  if (!enableTimeOption && dateTimeFormats.includes(value)) {
    return dateFormats[dateTimeFormats.indexOf(value)];
  }
  return value;
}

export default function DateFormat({
  value,
  onChange,
  className,
  enableTimeOption
}) {
  const handleChange = React.useCallback(
    (e) => {
      onChange({ name: type, value: e.target.value })
    },
    [onChange],
  );

  React.useEffect(() => {
    handleChange({
      target: {
        value: getFormatValue(value, enableTimeOption)
      }
    })
  }, [enableTimeOption, value]);

  const formats = enableTimeOption ? dateTimeFormats : dateFormats;
  return (
    <TextField
      label='Date format'
      variant="outlined"
      select
      fullWidth
      value={value}
      helperText="Select your date format"
      onChange={handleChange}
      className={className}
    >
      {formats.map(format => (
        <MenuItem key={format} value={format}>
          {format}
        </MenuItem>
      ))}
    </TextField>
  )
}

DateFormat.propTypes = {
  value: string,
  onChange: func,
  className: string,
  enableTimeOption: bool
}

DateFormat.defaultProps = {
  onChange: _.noop,
}
