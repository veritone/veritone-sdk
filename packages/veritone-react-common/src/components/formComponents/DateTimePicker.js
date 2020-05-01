import React from 'react';
import Today from '@material-ui/icons/Today';
import isValid from 'date-fns/isValid';
import getYear from 'date-fns/getYear';
import format from 'date-fns/format';
import isDate from 'date-fns/isDate';
import TextField from '@material-ui/core/TextField';
import {
  instanceOf,
  func,
  shape,
  string,
  bool,
  oneOfType,
  any
} from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/styles';
import parseISO from 'date-fns/parseISO';

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
    const isoDate = parseISO(newDate);
    if (!isValid(isoDate) || getYear(isoDate) > 9999) {
      return;
    }
    this.props.input.onChange(isoDate);
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
        <DateTimeSelector
          min={min && specialDateTimeFormat(min)}
          max={max && specialDateTimeFormat(max)}
          value={specialDateTimeFormat(input.value || new Date())}
          onChange={this.handleDateChange}
          {...rest}
        />
        {timeZone && <TimeZoneField value={timeZone} {...rest} />}
      </div>
    );
  }
}

// T is special character, so build the date string manually
const specialDateTimeFormat = date =>
  format(new Date(date), 'yyyy-MM-dd HH:mm').replace(' ', 'T');

const DateTimeSelector = ({ value, min, max, onChange, readOnly, ...rest }) => {
  return (
    <TextField
      type="datetime-local"
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

DateTimeSelector.propTypes = {
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
