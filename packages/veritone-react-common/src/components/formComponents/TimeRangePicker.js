import React from 'react';
import { string, func, shape, bool } from 'prop-types';
import dateFns from 'date-fns';
import TextField from '@material-ui/core/TextField';

import styles from './styles/timeRangePicker.scss';

export default class TimeRangePicker extends React.Component {
  static propTypes = {
    input: shape({
      value: shape({
        start: string,
        end: string
      }).isRequired,
      onChange: func.isRequired
    }).isRequired,
    readOnly: bool
  };

  handleChangeStart = ({ target: { value } }) => {
    this.props.input.onChange({
      start: value,
      end: this.props.input.value.end
    });
  };

  handleChangeEnd = ({ target: { value } }) => {
    this.props.input.onChange({
      start: this.props.input.value.start,
      end: value
    });
  };

  getTimeZone() {
    const tzDate = new Date();
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

  render() {
    return (
      <div className={styles.container}>
        <TimeSelector
          value={this.props.input.value.start}
          onChange={this.handleChangeStart}
          readOnly={this.props.readOnly}
        />
        <TextField
          className={styles.dateTimeTZ}
          value={this.getTimeZone()}
          InputProps={{
            disableUnderline: true,
            readOnly: this.props.readOnly
          }}
          disabled
        />
        <span className={styles.separator}>to</span>
        <TimeSelector
          value={this.props.input.value.end}
          onChange={this.handleChangeEnd}
          readOnly={this.props.readOnly}
        />
        <TextField
          className={styles.dateTimeTZ}
          value={this.getTimeZone()}
          InputProps={{
            disableUnderline: true,
            readOnly: this.props.readOnly
          }}
          disabled
        />
      </div>
    );
  }
}

const TimeSelector = ({ value, onChange, readOnly }) => {
  return <TextField type="time" value={value} onChange={onChange} InputProps={{ readOnly }} />;
};

TimeSelector.propTypes = {
  value: string,
  onChange: func,
  readOnly: bool
};
