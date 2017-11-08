import configReducer, * as configModule from './';

describe('config module', function() {
  it('merges new and old config in the reducer', function() {
    const state = [
      undefined,
      configModule.setConfig({ a: 'asdf', b: 'b' }),
      configModule.setConfig({ a: 'a', c: 'c' })
    ].reduce(configReducer);

    expect(state).toEqual({
      a: 'a',
      b: 'b',
      c: 'c'
    });
  });
});
