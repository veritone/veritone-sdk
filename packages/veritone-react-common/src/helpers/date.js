import { isArray, isMatch, isDate } from 'lodash';
import subHours from 'date-fns/subHours';
import subDays from 'date-fns/subDays';
import subMonths from 'date-fns/subMonths';
import isValid from 'date-fns/isValid';
import libFormat from 'date-fns/format';

export class Interval {
  constructor({ label, start, end, window } = {}) {
    this.label = label;
    this._start = start;
    this._end = end;
    this._window = window;

    this.validate();
  }

  get start() {
    if (this._window) {
      return Interval._translateWidow(this._window).start;
    }

    return this._start;
  }

  get end() {
    if (this._window) {
      return Interval._translateWidow(this._window).end;
    }

    return this._end;
  }

  set start(val) {
    this._start = val;
    this.validate();
  }

  set end(val) {
    this._end = val;
    this.validate();
  }

  isStatic() {
    return !this._window;
  }

  isSliding() {
    return !this.isStatic();
  }

  isEqual(interval) {
    if (this.isSliding()) {
      return isMatch(interval, {
        _window: this._window
      });
    }

    return isMatch(interval, {
      _start: this._start,
      _end: this._end
    });
  }

  toJSON() {
    return {
      start: this.start,
      end: this.end,
      _start: this._start,
      _end: this._end,
      _window: this._window
    };
  }

  toString() {
    const dateFormat = dateFormats.short;

    return this.label
      ? this.label
      : `${format(this.start, dateFormat)} – ${format(this.end, dateFormat)}`;
  }

  validate() {
    if (this._window) {
      if (!isArray(this._window)) {
        throw new Error('Expected window to be an array');
      }

      if (this._window.length !== 2) {
        throw new Error('Expected window array to have two elements');
      }
    }

    if (!this._window) {
      if (!(this._start && this._end)) {
        throw new Error(
          'Expected interval to either have _window or _start & _end keys'
        );
      }

      if (!isDate(this._start)) {
        throw new Error('Expected _start to be an instance of Date');
      }

      if (!isDate(this._end)) {
        throw new Error('Expected _end to be an instance of Date');
      }
    }
  }

  static _translateWidow(window) {
    const subFn = {
      h: subHours,
      d: subDays,
      m: subMonths
    }[window[1]];

    if (!subFn) {
      throw new Error('Bucket had unexpected unit:', window[1]);
    }

    return {
      start: subFn(new Date(), window[0]),
      end: new Date()
    };
  }

  static fromJSON(jsonInterval) {
    const interval = JSON.parse(jsonInterval);

    return new Interval({
      window: interval._window,
      start: interval._start ? new Date(interval._start) : undefined,
      end: interval._end ? new Date(interval._end) : undefined
    });
  }
}

export const defaultIntervals = {
  day: new Interval({
    label: 'Last day',
    window: [1, 'd']
  }),
  week: new Interval({
    label: 'Last 7 days',
    window: [7, 'd']
  }),
  month: new Interval({
    label: 'Last 30 days',
    window: [30, 'd']
  }),
  quarter: new Interval({
    label: 'Last 90 days',
    window: [90, 'd']
  }),
  year: new Interval({
    label: 'Last 365 days',
    window: [365, 'd']
  })
};

export const dateFormats = {
  full: 'MMM Do, yyyy hh:mmA',
  short: 'MM/dd/yyyy'
};

export function format(date, ...args) {
  if (!date) {
    return '';
  }

  return isValid(new Date(date)) ? libFormat(date, ...args) : '';
}
