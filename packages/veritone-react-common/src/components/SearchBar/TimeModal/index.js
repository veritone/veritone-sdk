import { truncate } from 'lodash';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

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

export { getTimeLabel };
