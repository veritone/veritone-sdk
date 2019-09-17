import {
  parse,
  addMinutes,
} from 'date-fns';
import format from 'date-fns/format';

const fromLocalToUTC = (inputTime) => {
  const converted = parse(new Date().toDateString() + ' ' + inputTime);
  return format(addMinutes(converted, new Date().getTimezoneOffset()), 'HH:mm');
};

const fromUTCToLocal = (inputTime) => {
  const converted = parse(new Date().toDateString() + ' ' + inputTime + ":00Z");
  return format(converted, 'HH:mm');
};

const getTimeLabel = modalState => {
  let abbreviationMessage = '';
  if (modalState.search.dayPartStartTime && modalState.search.dayPartEndTime) {
    let dayPartStartTime = modalState.search.dayPartStartTime;
    let dayPartEndTime = modalState.search.dayPartEndTime;

    if(modalState.search.stationBroadcastTime === false) {
      dayPartStartTime = fromUTCToLocal(dayPartStartTime);
      dayPartEndTime = fromUTCToLocal(dayPartEndTime);
    }
    const startTime = format(new Date().toDateString() + " " + dayPartStartTime, 'hh:mm A');
    const endTime = format(new Date().toDateString() + " " + dayPartEndTime, 'hh:mm A');

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

export { getTimeLabel }
