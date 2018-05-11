import React from 'react';
import { string, func, shape } from 'prop-types';
import TextField from 'material-ui/TextField';

import styles from './styles/timeRangePicker.scss';

export default class TimeRangePicker extends React.Component {
  static propTypes = {
    input: shape({
      value: shape({
        start: string,
        end: string
      }).isRequired,
      onChange: func.isRequired
    }).isRequired
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
    return new Date().toTimeString().slice(-4, -1);
  }

  render() {
    return (
      <div className={styles.container}>
        <TimeSelector
          value={this.props.input.value.start}
          onChange={this.handleChangeStart}
        />
        <TextField
          className={styles.dateTimeTZ}
          value={this.getTimeZone()}
          InputProps={{
            disableUnderline: true
          }}
          disabled
        />
        <span className={styles.separator}>to</span>
        <TimeSelector
          value={this.props.input.value.end}
          onChange={this.handleChangeEnd}
        />
        <TextField
          className={styles.dateTimeTZ}
          value={this.getTimeZone()}
          InputProps={{
            disableUnderline: true
          }}
          disabled
        />
      </div>
    );
  }
}

const TimeSelector = ({ value, onChange }) => {
  return <TextField type="time" value={value} onChange={onChange} />;
};

TimeSelector.propTypes = {
  value: string,
  onChange: func
};
