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
    }).isRequired
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
    return (
      <div className={styles.container}>
        {this.props.showIcon && <Today className={styles.todayIcon} />}
        <DateSelector
          min={this.props.min}
          max={this.props.max}
          value={getDateString(this.props.input.value)}
          onChange={this.handleDateChange}
        />
        <TimeSelector
          min={this.props.min}
          max={this.props.max}
          value={getTimeString(this.props.input.value)}
          onChange={this.handleTimeChange}
        />
        {this.props.showTimezone && (
          <TimeZoneField value={getTimeZone(this.props.input.value)} />
        )}
      </div>
    );
  }
}

const DateSelector = ({ value, min, max, onChange }) => {
  return (
    <TextField
      type="date"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
    />
  );
};

DateSelector.propTypes = {
  min: instanceOf(Date),
  max: instanceOf(Date),
  value: string.isRequired,
  onChange: func.isRequired
};

const TimeSelector = ({ value, min, max, onChange }) => {
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
    />
  );
};

TimeSelector.propTypes = {
  min: instanceOf(Date),
  max: instanceOf(Date),
  value: string.isRequired,
  onChange: func.isRequired
};

const TimeZoneField = ({ value }) => {
  return (
    value && (
      <TextField
        className={styles.dateTimeTZ}
        value={value}
        InputProps={{
          disableUnderline: true
        }}
        disabled
      />
    )
  );
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
  if (isString(tzDate)) {
    tzDate = new Date();
  }
  if (dateFns.isDate(tzDate)) {
    const tzMatch = tzDate.toTimeString().match(/\(([^)]+)\)$/);

    return tzMatch ? tzMatch[1] : '';
  }
}
