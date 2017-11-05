import { intersperse } from './fp';

describe('FP helpers', function() {
  describe('intersperse', function() {
    it('intersperses a constant in an array (even length)', function() {
      const a = ['one', 'two', 'three', 'four'];

      const result = intersperse(a, 'and');
      expect(result).toEqual([
        'one',
        'and',
        'two',
        'and',
        'three',
        'and',
        'four'
      ]);
    });

    it('intersperses a constant in an array (odd length)', function() {
      const a = ['one', 'two', 'three'];

      const result = intersperse(a, 'and');
      expect(result).toEqual(['one', 'and', 'two', 'and', 'three']);
    });

    it('intersperses a function in an array', function() {
      const a = ['one', 'two', 'three'];

      const result = intersperse(a, (right, left) => `${left}-${right}`);
      expect(result).toEqual(['one', 'one-two', 'two', 'two-three', 'three']);
    });

    it('returns one value given one value array', function() {
      expect(intersperse([0], 0)).toEqual([0]);
    });

    it('returns empty array given empty array', function() {
      expect(intersperse([], 'a')).toEqual([]);
    });

    it('returns empty array given falsy', function() {
      expect(intersperse(null, 'a')).toEqual([]);
    });
  });
});
