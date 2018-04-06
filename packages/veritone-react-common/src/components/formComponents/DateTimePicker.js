import React from 'react';
import IconButton from 'material-ui/IconButton';
import Today from 'material-ui-icons/Today';
import DateFns from 'date-fns';
import TextField from 'material-ui/TextField';
import {
  instanceOf,
  func,
  shape,
  string,
  oneOfType,
  bool
} from 'prop-types';

import styles from './styles/dateTimePicker.scss';

export default class DateTimePicker extends React.Component {
  static propTypes = {
    label: string,
    min: instanceOf(Date),
    max: instanceOf(Date),
    showIcon: bool,
    clearable: bool,
    showTimezone: bool,
    input: shape({
      value: oneOfType([instanceOf(Date), string]),
      onChange: func
    }).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};

    // Handle invalid min max range - default to unset range
    if (this.props.min && this.props.max) {
      if (this.props.min < this.props.max) {
        this.state.min = this.props.min;
        this.state.max = this.props.max;
      }
    } else if (this.props.min) {
      this.state.min = this.props.min;
    } else if (this.props.max) {
      this.state.max = this.props.max;
    }
    // Use the valid range to set the date if it's out of range
    if (this.props.input && this.props.input.value) {
      if (this.state.min && this.state.min > this.props.input.value) {
        this.state.value = new Date(this.state.min);
      }
      if (this.state.max && this.state.max < this.props.input.value) {
        this.state.value = new Date(this.state.max);
      }
      this.state.value = this.props.input.value;
    } else if (!this.props.clearable) {
      this.state.value = new Date();
    }
    this.props.input.onChange(this.state.value);
    this.state.showIcon = this.props.showIcon || false;
  }

  handleDateChange = event => {
    let value = DateFns.parse(event.target.value);
    value = consolidate(value, this.state.value);
    this.setState({ value });
    this.props.input.onChange(value);
    console.log(value);
  };

  handleTimeChange = event => {
    let value = event.target.value; // Get date object somehow
    value = consolidate(this.state.value, value);
    this.setState({ value });
    this.props.input.onChange(value);
    console.log(value);
  };

  render() {
    return (
      <div>
        { this.state.showIcon ? (
          <IconButton color="inherit">
            <Today />
          </IconButton>
        ) : undefined }
        <DateSelector
          min={this.state.min}
          max={this.state.max}
          value={this.state.value}
          clearable={this.props.clearable}
          onChange={this.handleDateChange}/>
        <TimeSelector
          min={this.state.min}
          max={this.state.max}
          value={this.state.value}
          clearable={this.props.clearable}
          onChange={this.handleTimeChange}/>
        { this.props.showTimezone ? (
          <TextField
            className={styles.dateTimeTZ}
            value={getTimeZone(this.state.value)}
            InputProps={{
              disableUnderline: true
            }}
            disabled/>
          ) : null }
      </div>
    );
  }
}

const DateSelector = ({ value, min, max, onChange, clearable }) => {
  let date = getDateString(value);

  return (
    <TextField
      type="date"
      min={min}
      max={max}
      defaultValue={date}
      onChange={onChange}/>
  );
};

DateSelector.propTypes = {
  min: instanceOf(Date),
  max: instanceOf(Date),
  clearable: bool,
  value: oneOfType([instanceOf(Date), string]).isRequired,
  onChange: func.isRequired
};

const TimeSelector = ({ value, min, max, onChange, clearable }) => {
  let time = getTimeString(value);

  return (
    <TextField
      type="time"
      min={min}
      max={max}
      defaultValue={time}
      onChange={onChange}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        step: 60, // 1 min
      }}/>
  );
};

TimeSelector.propTypes = {
  min: instanceOf(Date),
  max: instanceOf(Date),
  clearable: bool,
  value: oneOfType([instanceOf(Date), string]).isRequired,
  onChange: func.isRequired  
}

function consolidate(dateObject, timeObject) {
  if (DateFns.isDate(dateObject)) {
    let timeDateObject = DateFns.parse(getDateString(dateObject) + 'T' + timeObject + ':00');
    if (DateFns.isDate(timeDateObject)) {
      let consolidated = new Date(dateObject);
      consolidated.setHours(timeDateObject.getHours());
      consolidated.setMinutes(timeDateObject.getMinutes());
      consolidated.setSeconds(0);
      return consolidated;
    }
  }
}

function getDateString(date) {
  if (DateFns.isDate(date)) {
    return DateFns.format(date, 'YYYY-MM-DD');
  }
}

function getTimeString(date) {
  if (DateFns.isDate(date)) {
    return DateFns.format(date, 'HH:mm');
  }
}

function getTimeZone(date) {
  if (DateFns.isDate(date)) {
    let dateString = date.toTimeString();
    return dateString.slice(-4, -1);
  }
}