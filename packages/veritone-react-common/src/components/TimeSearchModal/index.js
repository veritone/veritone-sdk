import React from 'react';
import cx from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControlLabel } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { arrayOf, bool, func, date, shape, string } from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import styles from './styles';

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
    cancel: func,
  };
  static defaultProps = {
    cancel: () => console.log('You clicked cancel')
  };

  copyFilter = searchFilter => {
    const copy = Object.assign({}, searchFilter);
    copy.selectedDays = Object.assign([], searchFilter.selectedDays);
    return copy;
  };

  initializeState = (initialValue) => {
    const filterValue = this.copyFilter(initialValue);
    if (filterValue.stationBroadcastTime === false) {
      filterValue.dayPartStartTime = fromUTCToLocal(filterValue.dayPartStartTime);
      filterValue.dayPartEndTime = fromUTCToLocal(filterValue.dayPartEndTime);
    }
    return filterValue;
  }

  state = {
    filterValue: this.initializeState(this.props.modalState.search)
  };

  onDayPartStartTimeChange = event => {
    this.setState({
      filterValue: {
        ...this.state.filterValue,
        dayPartStartTime: event.target.value
      }
    });
  };

  onDayPartEndTimeChange = event => {
    this.setState({
      filterValue: {
        ...this.state.filterValue,
        dayPartEndTime: event.target.value
      }
    });
  };

  onStationBroadcastTimeChange = event => {
    this.setState({
      filterValue: {
        ...this.state.filterValue,
        stationBroadcastTime: event.target.checked
      }
    });
  };

  onDayOfWeekSelectionChange = event => {
    const selectedDays = [...this.state.filterValue.selectedDays];
    selectedDays[Number(event.target.value)] = event.target.checked;
    this.setState({
      filterValue: {
        ...this.state.filterValue,
        selectedDays
      }
    });
  };

  returnValue() {
    if (
      !this.state.filterValue ||
      !this.state.filterValue.dayPartStartTime ||
      !this.state.filterValue.dayPartEndTime
    ) {
      return
    } else {
      const filterValue = this.copyFilter(this.state.filterValue);
      if (filterValue.stationBroadcastTime === false) {
        filterValue.dayPartStartTime = fromLocalToUTC(filterValue.dayPartStartTime);
        filterValue.dayPartEndTime = fromLocalToUTC(filterValue.dayPartEndTime);
      }
      return {
        search: filterValue
      };
    }
  }

  render() {
    return (
      <TimeSearchForm
        cancel={this.props.cancel}
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

const useStyles = makeStyles(styles);

export const TimeSearchForm = ({
  onDayPartStartTimeChange,
  onDayPartEndTimeChange,
  onStationBroadcastTimeChange,
  onDayOfWeekSelectionChange,
  inputValue
}) => {
  const classes = useStyles();
  const asterisk = !inputValue.stationBroadcastTime ? '*' : '';

  return (
    <div className={cx(classes['timeSearchConfigContent'])}>
      <div className={cx(classes['timeSelectSection'])}>
        <div className={cx(classes['timeSelectSection'])}>
          <div className={cx(classes['timeInputSection'])}>
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
          <div className={cx(classes['timeInputSection'])}>
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
        <div className={cx(classes['stationSwitchSection'])}>
          <FormControlLabel
            control={
              <Switch
                className="stationBroadcastSwitch"
                color="primary"
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
        <div className={cx(classes['dayOfWeekConfig'])}>
          <h4>Day of the Week</h4>
          <div
            className={cx(classes['dayOfWeekSelection'])}
            data-test="dayOfWeekSelection"
          >
            {daysOfTheWeek.map(dayOfTheWeek => (
              <FormControlLabel
                key={dayOfTheWeek.isoWeekday}
                control={
                  <Checkbox
                    color="primary"
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

TimeSearchForm.propTypes = {
  onDayPartStartTimeChange: func,
  onDayPartEndTimeChange: func,
  onStationBroadcastTimeChange: func,
  onDayOfWeekSelectionChange: func,
  inputValue: shape({
    dayPartStartTime: string,
    dayPartEndTime: string,
    stationBroadcastTime: bool,
    selectedDays: arrayOf(bool)
  })
}

TimeSearchModal.defaultProps = {
  modalState: {
    search: {
      dayPartStartTime: moment.utc()
        .subtract(1, 'hour')
        .startOf('hour')
        .format('HH:mm'),
      dayPartEndTime: moment.utc()
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
  const dayPartTimeToMinutes = function (hourMinuteTime) {
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
    let dayPartStartTime = modalState.search.dayPartStartTime;
    let dayPartEndTime = modalState.search.dayPartEndTime;
    if (modalState.search.stationBroadcastTime === false) {
      dayPartStartTime = fromUTCToLocal(dayPartStartTime);
      dayPartEndTime = fromUTCToLocal(dayPartEndTime);
    }
    const startTime = moment(
      dayPartStartTime,
      'HH:mm'
    ).format('hh:mm A');
    const endTime = moment(dayPartEndTime, 'HH:mm').format(
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

const fromLocalToUTC = (inputTime) => {
  return moment(inputTime, 'HH:mm').utc().format('HH:mm');
};

const fromUTCToLocal = (inputTime) => {
  return moment.utc(inputTime, 'HH:mm').local().format('HH:mm');
};

export { TimeSearchModal, TimeConditionGenerator, TimeDisplay };
