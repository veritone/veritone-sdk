import React from 'react';
import Today from '@material-ui/icons/Today';
import isValid from 'date-fns/isValid'
import getYear from 'date-fns/getYear'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import isDate from 'date-fns/isDate'
import TextField from '@material-ui/core/TextField';
import { instanceOf, func, shape, string, bool, oneOfType, any } from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/styles';

import styles from './styles/dateTimePicker';
const useStyles = makeStyles(styles);
class DateTimePicker extends React.Component {
  static propTypes = {
    min: instanceOf(Date),
    max: instanceOf(Date),
    showIcon: bool,
    timeZone: oneOfType([string, bool]),
    input: shape({
      value: instanceOf(Date).isRequired,
      onChange: func
    }).isRequired,
    readOnly: bool,
    classes: shape({ any })
  };

  handleDateChange = ({ target }) => {
    const newDate = target.value;

    if (
      !isValid(new Date(newDate)) ||
      getYear(newDate) > 9999
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
    let { timeZone, classes } = this.props;

    // some components are not passing timezone, so we need to find it out
    // eslint-disable-next-line lodash/prefer-lodash-typecheck
    if (typeof timeZone === 'boolean' && timeZone) {
      timeZone = getTimeZone(input.value);
    }

    return (
      <div className={classes.container}>
        {this.props.showIcon && <Today className={classes.todayIcon} />}
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
        {timeZone && <TimeZoneField value={timeZone} {...rest} />}
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
  const classes = useStyles();
  return value ? (
    <TextField
      className={classes.dateTimeTZ}
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
  return parse(`${dateString}T${timeString}:00`);
}

function getDateString(date) {
  return format(date, 'yyyy-MM-dd');
}

function getTimeString(date) {
  return format(date, 'HH:mm');
}

function getTimeZone(date) {
  let tzDate = date;
  if (isDate(tzDate)) {
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

export default withStyles(styles)(DateTimePicker);
