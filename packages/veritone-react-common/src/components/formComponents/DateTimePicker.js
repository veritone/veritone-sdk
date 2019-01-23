import React from 'react';
import Today from '@material-ui/icons/Today';
import dateFns from 'date-fns';
import { isString } from 'lodash';
import TextField from '@material-ui/core/TextField';
import { instanceOf, func, shape, string, bool } from 'prop-types';

import styles from './styles/dateTimePicker.scss';

export default class DateTimePicker extends React.Component {
  static propTypes = {
    min: instanceOf(Date),
    max: instanceOf(Date),
    showIcon: bool,
    showTimezone: bool,
    input: shape({
      value: instanceOf(Date).isRequired,
      onChange: func
    }).isRequired,
    readOnly: bool
  };

  handleDateChange = ({ target }) => {
    const newDate = target.value;

    if (
      !dateFns.isValid(new Date(newDate)) ||
      dateFns.getYear(newDate) > 9999
    ) {
      return;
    }

    this.props.input.onChange(
      consolidate(newDate, getTimeString(this.props.input.value))
    );
  };

  handleTimeChange = ({ target }) => {
    this.props.input.onChange(
      consolidate(getDateString(this.props.input.value), target.value)
    );
  };

  render() {
    const { input, min, max, ...rest } = this.props;
    return (
      <div className={styles.container}>
        {this.props.showIcon && <Today className={styles.todayIcon} />}
        <DateSelector
          min={min}
          max={max}
          value={getDateString(input.value)}
          onChange={this.handleDateChange}
          {...rest}
        />
        <TimeSelector
          min={min}
          max={max}
          value={getTimeString(input.value)}
          onChange={this.handleTimeChange}
          {...rest}
        />
        {this.props.showTimezone && (
          <TimeZoneField value={getTimeZone(input.value)} {...rest} />
        )}
      </div>
    );
  }
}

const DateSelector = ({ value, min, max, onChange, readOnly, ...rest }) => {
  return (
    <TextField
      type="date"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      InputProps={{
        readOnly: readOnly
      }}
    />
  );
};

DateSelector.propTypes = {
  min: instanceOf(Date),
  max: instanceOf(Date),
  value: string.isRequired,
  onChange: func.isRequired,
  readOnly: bool
};

const TimeSelector = ({ value, min, max, onChange, readOnly, ...rest }) => {
  return (
    <TextField
      type="time"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      InputLabelProps={{
        shrink: true
      }}
      InputProps={{
        readOnly: readOnly
      }}
    />
  );
};

TimeSelector.propTypes = {
  min: instanceOf(Date),
  max: instanceOf(Date),
  value: string.isRequired,
  onChange: func.isRequired,
  readOnly: bool
};

const TimeZoneField = ({ value, ...rest }) => {
  return value ? (
    <TextField
      className={styles.dateTimeTZ}
      value={value}
      InputProps={{
        disableUnderline: true
      }}
      disabled
    />
  ) : null;
};

TimeZoneField.propTypes = {
  value: string.isRequired
};

function consolidate(dateString, timeString) {
  return dateFns.parse(`${dateString}T${timeString}:00`);
}

function getDateString(date) {
  return dateFns.format(date, 'YYYY-MM-DD');
}

function getTimeString(date) {
  return dateFns.format(date, 'HH:mm');
}

function getTimeZone(date) {
  let tzDate = date;
  if (dateFns.isDate(tzDate)) {
    const tzMatch = tzDate.toTimeString().match(/\(([^)]+)\)$/);
    if (tzMatch && tzMatch.length > 1) {
      const tzParts = tzMatch[1].split(' ');
      if (tzParts.length > 1) {
        return tzParts.map(part => part[0]).join('');
      }
      return tzMatch[1];
    }
  }
  return '';
}
