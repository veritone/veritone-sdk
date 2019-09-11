import React from 'react';
import { bool, string, func, number } from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker,
  DateTimePicker
} from '@material-ui/pickers';

export default function DateTime({
  enableTimeSelect,
  value,
  onChange,
  name,
  dateFormat,
  required,
  label,
  instruction,
  error
}) {
  const TimePicker = enableTimeSelect ? DateTimePicker : DatePicker;
  const handleChange = React.useCallback(
    (date) => onChange({ name, value: date }),
    [name, onChange]
  );

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <TimePicker
        error={error.length > 0}
        instruction={instruction}
        label={label || name}
        inputVariant="outlined"
        value={value}
        required={required}
        fullWidth
        format={dateFormat}
        onChange={handleChange}
        helperText={error || instruction}
      />
    </MuiPickersUtilsProvider>
  )
}

DateTime.propTypes = {
  enableTimeSelect: bool,
  required: bool,
  error: string,
  value: number,
  onChange: func,
  dateFormat: string,
  name: string,
  label: string,
  instruction: string
}

DateTime.defaultProps = {
  onChange: () => {},
  error: ''
}
