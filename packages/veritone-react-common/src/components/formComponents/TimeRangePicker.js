import React from 'react';
import { string, func, shape, bool, oneOfType, any } from 'prop-types';
import isDate from 'date-fns/isDate';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/styles';
import styles from './styles/timeRangePicker';

class TimeRangePicker extends React.Component {
  static propTypes = {
    input: shape({
      value: shape({
        start: string,
        end: string,
        timeZone: string
      }).isRequired,
      onChange: func.isRequired
    }).isRequired,
    readOnly: bool,
    timeZone: oneOfType([string, bool]),
    classes: shape({ any })
  };

  handleChangeStart = ({ target: { value } }) => {
    this.props.input.onChange({
      start: value,
      end: this.props.input.value.end,
      timeZone: this.props.input.value.timeZone
    });
  };

  handleChangeEnd = ({ target: { value } }) => {
    this.props.input.onChange({
      start: this.props.input.value.start,
      end: value,
      timeZone: this.props.input.value.timeZone
    });
  };

  getTimeZone() {
    const tzDate = new Date();
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

  render() {
    let { timeZone, classes } = this.props;

    // some components are not passing timezone, so we need to find it out
    // eslint-disable-next-line lodash/prefer-lodash-typecheck
    if (typeof timeZone === 'boolean' && timeZone) {
      timeZone = this.props.input.value.timeZone || this.getTimeZone();
    }

    return (
      <div className={classes.container}>
        <TimeSelector
          value={this.props.input.value.start}
          onChange={this.handleChangeStart}
          readOnly={this.props.readOnly}
        />
        {timeZone && (
          <TextField
            className={classes.dateTimeTZ}
            value={timeZone}
            InputProps={{
              disableUnderline: true
            }}
            disabled
          />
        )}
        <span className={classes.separator}>to</span>
        <TimeSelector
          value={this.props.input.value.end}
          onChange={this.handleChangeEnd}
          readOnly={this.props.readOnly}
        />
        {timeZone && (
          <TextField
            className={classes.dateTimeTZ}
            value={timeZone}
            InputProps={{
              disableUnderline: true,
              readOnly: this.props.readOnly
            }}
            disabled
          />
        )}
      </div>
    );
  }
}

const TimeSelector = ({ value, onChange, readOnly }) => {
  return (
    <TextField
      type="time"
      value={value}
      onChange={onChange}
      InputProps={{ readOnly }}
    />
  );
};

TimeSelector.propTypes = {
  value: string,
  onChange: func,
  readOnly: bool
};

export default withStyles(styles)(TimeRangePicker);
