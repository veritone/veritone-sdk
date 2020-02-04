import sinon from 'sinon';
import { subDays, subHours, subMonths } from 'date-fns';

import { Interval, format } from './date';

describe('date interval helpers', () => {
  describe('Interval class', () => {
    let clock;

    beforeEach(() => {
      // ensure date tests are stable by stopping time
      clock = sinon.useFakeTimers(new Date('Apr 01 2017'));
    });

    afterEach(() => {
      clock.restore();
    });

    it('throws an error if a malformed interval is passed in', () => {
      let assertions = 6;

      try {
        // eslint-disable-next-line no-new
        new Interval({ start: new Date() });
      } catch (e) {
        assertions -= 1;
      }

      try {
        // eslint-disable-next-line no-new
        new Interval({ end: new Date() });
      } catch (e) {
        assertions -= 1;
      }

      try {
        // eslint-disable-next-line no-new
        new Interval({ window: new Date() });
      } catch (e) {
        assertions -= 1;
      }

      try {
        // eslint-disable-next-line no-new
        new Interval({ _start: new Date(), _end: 5 });
      } catch (e) {
        assertions -= 1;
      }

      try {
        // eslint-disable-next-line no-new
        new Interval({ _start: 5, _end: new Date() });
      } catch (e) {
        assertions -= 1;
      }

      // eslint-disable-next-line no-new
      new Interval({ window: [24, 'h'], start: new Date() });
      assertions -= 1;

      expect(assertions).toEqual(0);
    });

    it('translates a window to a concrete start/end', () => {
      const hourRange = new Interval({ window: [12, 'h'] });
      const dayRange = new Interval({ window: [2, 'd'] });
      const monthRange = new Interval({ window: [2, 'm'] });

      expect(hourRange.start).toEqual(subHours(new Date(), 12));
      expect(hourRange.end).toEqual(new Date());

      expect(dayRange.start).toEqual(subDays(new Date(), 2));
      expect(dayRange.end).toEqual(new Date());

      expect(monthRange.start).toEqual(subMonths(new Date(), 2));
      expect(monthRange.end).toEqual(new Date());
    });

    it('returns the same interval given a fixed interval', () => {
      const start = subDays(new Date(), 2);
      const end = subDays(new Date(), 1);

      const interval = new Interval({ start, end });

      expect(interval.start).toEqual(start);
      expect(interval.end).toEqual(end);
    });

    it('prioritizes the window if both window and start/end exist in a interval', () => {
      const interval = new Interval({
        start: subDays(new Date(), 2),
        end: new Date(),
        window: [12, 'h'],
      });

      expect(interval.start).toEqual(subHours(new Date(), 12));
      expect(interval.end).toEqual(new Date());
    });

    it('returns whether the interval will be treated as static/sliding', () => {
      const intervalBoth = new Interval({
        start: subDays(new Date(), 2),
        end: new Date(),
        window: [12, 'h'],
      });

      expect(intervalBoth.isStatic()).toEqual(false);
      expect(intervalBoth.isSliding()).toEqual(true);

      const intervalWindow = new Interval({
        window: [12, 'h'],
      });

      expect(intervalWindow.isStatic()).toEqual(false);
      expect(intervalWindow.isSliding()).toEqual(true);

      const intervalStatic = new Interval({
        start: subDays(new Date(), 2),
        end: new Date(),
      });

      expect(intervalStatic.isStatic()).toEqual(true);
      expect(intervalStatic.isSliding()).toEqual(false);
    });

    it('tests equality across instances with isEqual', () => {
      expect(
        new Interval({
          start: subDays(new Date(), 2),
          end: new Date(),
          window: [12, 'h'],
        }).isEqual(
          new Interval({
            start: subDays(new Date(), 2),
            end: new Date(),
            window: [12, 'h'],
          })
        )
      ).toEqual(true);

      expect(
        new Interval({
          start: subDays(new Date(), 2),
          end: new Date(),
        }).isEqual(
          new Interval({
            start: subDays(new Date(), 2),
            end: new Date(),
          })
        )
      ).toEqual(true);

      expect(
        new Interval({
          window: [12, 'h'],
        }).isEqual(
          new Interval({
            window: [12, 'h'],
          })
        )
      ).toEqual(true);

      expect(
        new Interval({
          start: subDays(new Date(), 2),
          end: new Date(),
          window: [12, 'h'],
        }).isEqual(
          new Interval({
            start: subDays(new Date(), 2),
            end: new Date(),
            window: [13, 'h'],
          })
        )
      ).toEqual(false);

      expect(
        new Interval({
          start: subDays(new Date(), 2),
          end: new Date(),
          window: [12, 'h'],
        }).isEqual(
          new Interval({
            start: subDays(new Date(), 3),
            end: new Date(),
            window: [12, 'h'],
          })
        )
      ).toEqual(true); // if window is present, ignore start/end

      expect(
        new Interval({
          start: subDays(new Date(), 2),
          end: new Date(),
        }).isEqual(
          new Interval({
            start: subDays(new Date(), 3),
            end: new Date(),
          })
        )
      ).toEqual(false);

      expect(
        new Interval({
          start: subDays(new Date(), 3),
          end: new Date(),
        }).isEqual(
          new Interval({
            start: subDays(new Date(), 3),
            end: subDays(new Date(), 2),
          })
        )
      ).toEqual(false);

      expect(
        new Interval({
          window: [12, 'h'],
        }).isEqual(
          new Interval({
            window: [13, 'h'],
          })
        )
      ).toEqual(false);

      expect(
        new Interval({
          label: 'last 12 hours',
          window: [12, 'h'],
        }).isEqual(
          new Interval({
            label: 'previous 12 hours',
            window: [12, 'h'],
          })
        )
      ).toEqual(true); // ignores label
    });

    it('JSON stringifies to start/end, also serializing private properties', () => {
      const windowInterval = new Interval({
        window: [12, 'h'],
      });
      const staticInterval = new Interval({
        start: subDays(new Date(), 2),
        end: new Date(),
      });

      expect(JSON.stringify(windowInterval)).toEqual(
        JSON.stringify({
          start: subHours(new Date(), 12),
          end: new Date(),
          _window: [12, 'h'],
        })
      );

      expect(JSON.stringify(staticInterval)).toEqual(
        JSON.stringify({
          start: subDays(new Date(), 2),
          end: new Date(),
          _start: subDays(new Date(), 2),
          _end: new Date(),
        })
      );
    });

    it('parses back from JSON', () => {
      const windowInterval = new Interval({
        window: [12, 'h'],
      });
      const staticInterval = new Interval({
        start: subDays(new Date(), 2),
        end: new Date(),
      });

      expect(
        Interval.fromJSON(JSON.stringify(windowInterval)).isEqual(
          windowInterval
        )
      ).toEqual(true);

      expect(
        Interval.fromJSON(JSON.stringify(staticInterval)).isEqual(
          staticInterval
        )
      ).toEqual(true);
    });

    it('sets/gets a label', () => {
      const interval = new Interval({
        label: 'My Interval',
        window: [12, 'h'],
      });

      expect(interval.label).toEqual('My Interval');
    });

    it('formats the interval as a human-readable string', () => {
      const labelInterval = new Interval({
        label: 'My Interval',
        window: [12, 'h'],
      });

      expect(labelInterval.toString()).toEqual('My Interval');

      const windowInterval = new Interval({
        window: [36, 'h'],
      });

      expect(windowInterval.toString()).toEqual('03/30/2017 – 04/01/2017');

      const staticInterval = new Interval({
        start: subDays(new Date(), 3),
        end: new Date(),
      });

      expect(staticInterval.toString()).toEqual('03/29/2017 – 04/01/2017');
    });

    it('allows setting start/end', () => {
      const staticInterval = new Interval({
        start: subDays(new Date(), 2),
        end: new Date(),
      });

      staticInterval.start = subDays(new Date(), 3);
      staticInterval.end = subDays(new Date(), 1);

      expect(
        staticInterval.isEqual(
          new Interval({
            start: subDays(new Date(), 3),
            end: subDays(new Date(), 1),
          })
        )
      ).toEqual(true);

      let validated = 0;
      try {
        staticInterval.start = 'asdf';
      } catch (e) {
        validated += 1;
      }

      try {
        staticInterval.end = 'asdf';
      } catch (e) {
        validated += 1;
      }

      expect(validated).toEqual(2, 'validates when setting start/end');
    });
  });

  describe('format', () => {
    it('returns empty string if date is null or undefined', () => {
      expect(format(null)).toEqual('');
      expect(format(undefined)).toEqual('');
    });

    it('returns empty string if date is invalid', () => {
      expect(format('invalid')).toEqual('');
    });

    it('returns formatted string for valid dates', () => {
      expect(format('jan 1, 2018', 'MM/DD/YYYY')).toEqual('01/01/2018');
    });
  });
});
