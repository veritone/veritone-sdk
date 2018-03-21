import { msToReadableString } from './time';

describe('time formatting helpers', () => {
  describe('msToReadableString', () => {
    it('should return a "HH:mm:ss" formatted string when greater than or equal to an hour', () => {
      let formattedString = msToReadableString(3600000);
      expect(formattedString).toEqual('01:00:00');

      formattedString = msToReadableString(360000000);
      expect(formattedString).toEqual('100:00:00');
    });

    it('should return a "mm:ss" formatted string when less than an hour', () => {
      let formattedString = msToReadableString(3540000);
      expect(formattedString).toEqual('59:00');
    });
  });
});