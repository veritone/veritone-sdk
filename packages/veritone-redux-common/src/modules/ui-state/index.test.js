import reducer, * as module from './';

describe('ui-state module', function() {
  describe('setStateForKey/getStateForKey', function() {
    it('sets/gets the state at a given key', function() {
      let state = [
        undefined,

        module.setStateForKey('key', { test: 123 })
      ].reduce(reducer);

      state = { [module.namespace]: state };

      expect(module.getStateForKey(state, 'key')).toEqual({
        test: 123
      });
    });

    it('shallow merges the state at a given key into the existing state', function() {
      let state = [
        undefined,

        module.setStateForKey('key', { test: 123 }),
        module.setStateForKey('key', { test: 124 }),
        module.setStateForKey('key', { testObj: { key: 123 } }),
        module.setStateForKey('key', { testObj: { key: 124 } })
      ].reduce(reducer);

      state = { [module.namespace]: state };

      expect(module.getStateForKey(state, 'key').test).toEqual(
        124,
        'later additions should supercede'
      );

      expect(module.getStateForKey(state, 'key').testObj).toEqual(
        { key: 124 },
        'shallow merge only'
      );

      expect(module.getStateForKey(state, 'key')).toEqual(
        { test: 124, testObj: { key: 124 } },
        'merges'
      );
    });
  });

  describe('clearStateForKey', function() {
    it('clears ui state at the given key', function() {
      let state = [
        undefined,

        module.setStateForKey('key', { test: 123 }),
        module.setStateForKey('otherKey', { test: 123 }),
        module.clearStateForKey('key')
      ].reduce(reducer);

      state = { [module.namespace]: state };

      expect(module.getStateForKey(state, 'key')).toBe(undefined);

      expect(module.getStateForKey(state, 'otherKey')).toEqual({ test: 123 });
    });
  });
});
