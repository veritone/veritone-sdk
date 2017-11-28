import React from 'react';
import { instanceOf, func, shape } from 'prop-types';
import InfiniteCalendar, {
  Calendar,
  withRange,
  EVENT_TYPE
} from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import {
  differenceInHours,
  startOfMonth,
  endOfDay,
  subYears
} from 'date-fns';

import { Interval } from '../../helpers/date';
const RangedCalendar = withRange(Calendar);

export default class DateRangePicker extends React.Component {
  static propTypes = {
    minViewableDate: instanceOf(Date),
    maxViewableDate: instanceOf(Date),
    minDate: instanceOf(Date),
    maxDate: instanceOf(Date),
    input: shape({
      value: instanceOf(Interval),
      onChange: func
    })
  };
  static defaultProps = {
    minViewableDate: startOfMonth(subYears(new Date(), 3)),
    maxViewableDate: endOfDay(new Date())
  };

  handleSelectCustomDate = ({ eventType, start, end }) => {
    if (eventType === EVENT_TYPE.END) {
      this.props.input.onChange(
        differenceInHours(end, start) > 0
          ? new Interval({ start, end })
          : // single day selection is full day
            new Interval({ start, end: endOfDay(end) })
      );
    }
  };

  render() {
    // const defaultCalendarDate = {
    //   start: subDays(new Date(), 2),
    //   end: new Date()
    // };

    return (
      <InfiniteCalendar
        Component={RangedCalendar}
        min={this.props.minViewableDate}
        max={this.props.maxViewableDate}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        selected={this.props.input.value /*|| defaultCalendarDate*/}
        onSelect={this.handleSelectCustomDate}
        locale={{
          headerFormat: 'MMM Do'
        }}
        // theme={{
        //   // headerColor: '#4caf50',
        //   // weekdayColor: '#00c753'
        // }}
      />
    );
  }
}
