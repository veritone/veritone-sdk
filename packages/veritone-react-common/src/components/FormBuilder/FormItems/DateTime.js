import React from 'react';
import { bool, string, func, number, oneOfType, instanceOf } from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker,
  DateTimePicker
} from '@material-ui/pickers';
import useStyles from './styles.js';

export default function DateTime({
  enableTimeOption,
  value,
  onChange,
  name,
  dateFormat,
  required,
  label,
  instruction,
  error
}) {
  const TimePicker = enableTimeOption ? DateTimePicker : DatePicker;
  const handleChange = React.useCallback(
    (date) => onChange({ name, value: date }),
    [name, onChange]
  );

  const styles = useStyles({});

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <TimePicker
        error={error.length > 0}
        instruction={instruction}
        label={label}
        inputVariant="outlined"
        value={value}
        required={required}
        fullWidth
        format={dateFormat}
        onChange={handleChange}
        helperText={error || instruction}
        className={styles.formItem}
        name={name}
      />
    </MuiPickersUtilsProvider>
  )
}

DateTime.propTypes = {
  enableTimeOption: bool,
  required: bool,
  error: string,
  value: oneOfType([instanceOf(Date), number, string]),
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
