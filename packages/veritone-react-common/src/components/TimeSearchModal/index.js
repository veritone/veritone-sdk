import React from 'react';
import cx from 'classnames';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import { FormControlLabel, FormHelperText } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import moment from 'moment';
import styles from './styles.scss';
import { arrayOf, bool, func, string, date, shape } from 'prop-types';

import TextField from 'material-ui/TextField';

import ModalSubtitle from '../ModalSubtitle';
import Typography from 'material-ui/Typography';

export default class TimeSearchModal extends React.Component {
  static propTypes = {
    open: bool,
    modalState: shape({
      search: shape({
        dayPartStartTime: date,
        dayPartEndTime: date,
        stationBroadcastTime: bool,
        selectedDays: arrayOf(bool)
      })
    }),
    applyFilter: func,
    cancel: func
  };
  static defaultProps = {
    applyFilter: value => console.log('Search by time', value),
    cancel: () => console.log('You clicked cancel')
  };

  copyFilter = searchFilter => {
    const copy = Object.assign({}, searchFilter);
    copy.selectedDays = Object.assign([], searchFilter.selectedDays);
    return copy;
  };

  state = {
    filterValue: null || this.copyFilter(this.props.modalState.search)
  };

  onDayPartStartTimeChange = event => {
    this.state.filterValue.dayPartStartTime = event.target.value;
    this.setState({
      filterValue: this.state.filterValue
    });
  };

  onDayPartEndTimeChange = event => {
    this.state.filterValue.dayPartEndTime = event.target.value;
    this.setState({
      filterValue: this.state.filterValue
    });
  };

  onStationBroadcastTimeChange = event => {
    this.state.filterValue.stationBroadcastTime = event.target.checked;
    this.setState({
      filterValue: this.state.filterValue
    });
  };

  onDayOfWeekSelectionChange = event => {
    this.state.filterValue.selectedDays[Number(event.target.value)] =
      event.target.checked;
    this.setState({
      filterValue: this.state.filterValue
    });
  };

  applyFilterIfValue = () => {
    if (
      !this.state.filterValue ||
      !this.state.filterValue.dayPartStartTime ||
      !this.state.filterValue.dayPartEndTime
    ) {
      this.props.applyFilter();
    } else {
      this.props.applyFilter({
        search: this.copyFilter(this.state.filterValue)
      });
    }
  };

  returnValue() {
    if (
      !this.state.filterValue ||
      !this.state.filterValue.dayPartStartTime ||
      !this.state.filterValue.dayPartEndTime
    ) {
      return
    } else {
      return {
        search: this.copyFilter(this.state.filterValue)
      };
    }
  }

  render() {
    return (
      <TimeSearchForm
        cancel={this.props.cancel}
        onSubmit={this.applyFilterIfValue}
        onDayPartStartTimeChange={this.onDayPartStartTimeChange}
        onDayPartEndTimeChange={this.onDayPartEndTimeChange}
        onStationBroadcastTimeChange={this.onStationBroadcastTimeChange}
        onDayOfWeekSelectionChange={this.onDayOfWeekSelectionChange}
        inputValue={this.state.filterValue}
      />
    );
  }
}

const daysOfTheWeek = [
  {
    isoWeekday: 1,
    name: moment()
      .isoWeekday(1)
      .format('ddd')
  }, // MONDAY
  {
    isoWeekday: 2,
    name: moment()
      .isoWeekday(2)
      .format('ddd')
  },
  {
    isoWeekday: 3,
    name: moment()
      .isoWeekday(3)
      .format('ddd')
  },
  {
    isoWeekday: 4,
    name: moment()
      .isoWeekday(4)
      .format('ddd')
  },
  {
    isoWeekday: 5,
    name: moment()
      .isoWeekday(5)
      .format('ddd')
  },
  {
    isoWeekday: 6,
    name: moment()
      .isoWeekday(6)
      .format('ddd')
  },
  {
    isoWeekday: 7,
    name: moment()
      .isoWeekday(7)
      .format('ddd')
  } // SUNDAY
];

export const TimeSearchForm = ({
  cancel,
  onSubmit,
  onDayPartStartTimeChange,
  onDayPartEndTimeChange,
  onStationBroadcastTimeChange,
  onDayOfWeekSelectionChange,
  inputValue
}) => {
  const asterisk = !inputValue.stationBroadcastTime ? '*' : '';

  return (
      <div className={cx(styles['timeSearchConfigContent'])}>
        <div className={cx(styles['timeSelectSection'])}>
          <div className={cx(styles['timeSelectSection'])}>
            <div className={cx(styles['timeInputSection'])}>
              <TextField
                label={'Start Time' + asterisk}
                InputLabelProps={{
                  shrink: true
                }}
                autoFocus
                className="dayPartStartTimeInput"
                type="time"
                min="00:00"
                max="23:59"
                value={inputValue.dayPartStartTime}
                onChange={onDayPartStartTimeChange}
              />
            </div>
            <div className={cx(styles['timeInputSection'])}>
              <TextField
                label={'End Time' + asterisk}
                InputLabelProps={{
                  shrink: true
                }}
                className="dayPartEndTimeInput"
                type="time"
                min="00:00"
                max="23:59"
                value={inputValue.dayPartEndTime}
                onChange={onDayPartEndTimeChange}
              />
            </div>
          </div>
          <div className={cx(styles['stationSwitchSection'])}>
            <FormControlLabel
              control={
                <Switch
                  className="stationBroadcastSwitch"
                  checked={inputValue.stationBroadcastTime}
                  onChange={onStationBroadcastTimeChange}
                />
              }
              label="Station Broadcast Time"
            />
            <Typography variant="caption" color="textSecondary" gutterBottom>
              Display results against all timezones for this time range.
            </Typography>
          </div>
        </div>
        {inputValue.stationBroadcastTime && (
          <div className={cx(styles['dayOfWeekConfig'])}>
            <h4>Day of the Week</h4>
            <div className={cx(styles['dayOfWeekSelection'])}>
              {daysOfTheWeek.map(dayOfTheWeek => (
                <FormControlLabel
                  key={dayOfTheWeek.isoWeekday}
                  control={
                    <Checkbox
                      checked={
                        inputValue.selectedDays[dayOfTheWeek.isoWeekday - 1]
                      }
                      onChange={onDayOfWeekSelectionChange}
                      value={String(dayOfTheWeek.isoWeekday - 1)}
                    />
                  }
                  label={dayOfTheWeek.name}
                />
              ))}
            </div>
          </div>
        )}
        {!inputValue.stationBroadcastTime && (
          <label>
            <Typography variant="caption" color="textSecondary" gutterBottom>
              *{
                new Date()
                  .toLocaleTimeString('en-us', { timeZoneName: 'long' })
                  .split(' ')[2]
              }{' '}
              Time Zone
            </Typography>
          </label>
        )}
              { /*
        disabled={
          !inputValue ||
          !inputValue.dayPartStartTime ||
          !inputValue.dayPartStartTime.length ||
          !inputValue.dayPartEndTime ||
          !inputValue.dayPartEndTime.length ||
          (inputValue.stationBroadcastTime &&
            !inputValue.selectedDays.some(item => item == true))
        }

      */}
      </div>
  );
};

TimeSearchModal.defaultProps = {
  modalState: {
    search: {
      dayPartStartTime: moment()
        .subtract(1, 'hour')
        .startOf('hour')
        .format('HH:mm'),
      dayPartEndTime: moment()
        .subtract(1, 'hour')
        .endOf('hour')
        .milliseconds(0)
        .seconds(0)
        .format('HH:mm'),
      stationBroadcastTime: false,
      selectedDays: [true, true, true, true, true, true, true]
    }
  }
};

const TimeConditionGenerator = modalState => {
  const dayPartTimeToMinutes = function(hourMinuteTime) {
    if (
      !hourMinuteTime ||
      typeof hourMinuteTime !== 'string' ||
      hourMinuteTime.length != 5
    ) {
      return 0;
    }
    const hourMinute = hourMinuteTime.split(':');
    return parseInt(hourMinute[0]) * 60 + parseInt(hourMinute[1]);
  };
  const startMinutes = dayPartTimeToMinutes(modalState.search.dayPartStartTime);
  const endMinutes = dayPartTimeToMinutes(modalState.search.dayPartEndTime);
  const dayMinuteField = modalState.search.stationBroadcastTime
    ? 'dayMinuteLocal'
    : 'dayMinuteUTC';

  const conditions = [];

  if (startMinutes <= endMinutes) {
    conditions.push({
      operator: 'range',
      field: dayMinuteField,
      gte: startMinutes,
      lte: endMinutes
    });
  } else {
    conditions.push({
      operator: 'range',
      field: dayMinuteField,
      gte: startMinutes,
      lte: 24 * 60
    });
    conditions.push({
      operator: 'range',
      field: dayMinuteField,
      gte: 0,
      lte: endMinutes
    });
  }

  if (modalState.search.stationBroadcastTime) {
    const selectedIsoWeekdays = [];
    modalState.search.forEach((item, index) => {
      if (item) {
        selectedIsoWeekdays.push(String(index + 1));
      }
    });
    conditions.push({
      operator: 'terms',
      field: 'weekDayLocal',
      values: selectedIsoWeekdays
    });
  }

  return {
    operator: 'and',
    conditions: conditions
  };
};

const TimeDisplay = modalState => {
  let abbreviationMessage = '';
  if (modalState.search.dayPartStartTime && modalState.search.dayPartEndTime) {
    const startTime = moment(
      modalState.search.dayPartStartTime,
      'HH:mm'
    ).format('hh:mm A');
    const endTime = moment(modalState.search.dayPartEndTime, 'HH:mm').format(
      'hh:mm A'
    );
    abbreviationMessage = `${startTime}-${endTime}`;
    if (modalState.search.stationBroadcastTime) {
      const selectedDays = daysOfTheWeek
        .filter(
          dayOfTheWeek =>
            modalState.search.selectedDays[dayOfTheWeek.isoWeekday - 1]
        )
        .map(dayOfTheWeek => dayOfTheWeek.name)
        .join();
      abbreviationMessage += selectedDays.length ? ` (${selectedDays})` : '';
    }
  }
  return {
    abbreviation:
      abbreviationMessage.length > 10
        ? abbreviationMessage.substring(0, 10) + '...'
        : abbreviationMessage,
    thumbnail: null
  };
};

export { TimeSearchModal, TimeConditionGenerator, TimeDisplay };
