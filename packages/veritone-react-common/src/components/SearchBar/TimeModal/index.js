import { parse } from 'date-fns';
import { truncate } from 'lodash';
import format from 'date-fns/format';

import React from 'react';
import { func, string, shape } from 'prop-types';


import { TimeSearchForm } from './TimeSearchForm';

class TimeModal extends React.Component {

    // validating prop types
    static propTypes = {
      modalState: shape({
        search: string,
        language: string
      }),
      engineCategoryId: string,
      onCancel: func
    };

    // creating default props
    static defaultProps = {
      modalState: {
        search: '',
        language: 'en'
      },
      onCancel: () => console.log('You clicked onCancel')
    };
  
    state = {
      filterValue: null || this.props.modalState.search
    };
  
    onChange = event => {
      this.setState({
        filterValue: event.target.value
      });
    };
  
    returnValue() {
      if (!this.state.filterValue || this.state.filterValue.trim().length === 0) {
        return;
      } else {
        /*
            {
              state: { search: 'Kobe', language: 'en' },
              engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
            }
        */
        return  {
            state : {
            search: this.state.filterValue ? this.state.filterValue.trim() : null,
            language: 'en'
          },
          engineCategoryId: this.props.engineCategoryId
        }
        ;
      }
    }

  render() {
    return (
        <TimeSearchForm
          onCancel={this.props.onCancel}
          defaultValue={
            (this.props.modalState && this.props.modalState.search) || ''
          }
          onChange={this.onChange}
          inputValue={this.state.filterValue}
        />
    );
  }
}

const fromUTCToLocal = inputTime => {
  const converted = parse(new Date().toDateString() + ' ' + inputTime + ':00Z');
  return format(converted, 'HH:mm');
};

// ISO 8601
const daysOfTheWeek = [
  {
    isoWeekday: 1,
    name: 'Mon'
  }, // MONDAY
  {
    isoWeekday: 2,
    name: 'Tue'
  },
  {
    isoWeekday: 3,
    name: 'Wed'
  },
  {
    isoWeekday: 4,
    name: 'Thu'
  },
  {
    isoWeekday: 5,
    name: 'Fri'
  },
  {
    isoWeekday: 6,
    name: 'Sat'
  },
  {
    isoWeekday: 0,
    name: 'Sun'
  } // SUNDAY
];

const getTimeLabel = modalState => {
  let label = '';
  if (modalState.search.dayPartStartTime && modalState.search.dayPartEndTime) {
    let dayPartStartTime = modalState.search.dayPartStartTime;
    let dayPartEndTime = modalState.search.dayPartEndTime;

    if (modalState.search.stationBroadcastTime === false) {
      dayPartStartTime = fromUTCToLocal(dayPartStartTime);
      dayPartEndTime = fromUTCToLocal(dayPartEndTime);
    }
    const startTime = format(
      new Date().toDateString() + ' ' + dayPartStartTime,
      'hh:mm A'
    );
    const endTime = format(
      new Date().toDateString() + ' ' + dayPartEndTime,
      'hh:mm A'
    );

    label = `${startTime}-${endTime}`;
    if (modalState.search.stationBroadcastTime) {
      const selectedDays = daysOfTheWeek
        .filter(
          dayOfTheWeek =>
            modalState.search.selectedDays[dayOfTheWeek.isoWeekday]
        )
        .map(dayOfTheWeek => dayOfTheWeek.name)
        .join();
      label += selectedDays.length ? ` (${selectedDays})` : '';
    }
  }
  return {
    full: label,
    abbreviation: truncate(label, { length: 13 }),
    thumbnail: null
  };
};

export { getTimeLabel, TimeModal };
