import OAuthReducer, * as OAuthModule from './';

describe('OAuth module', function() {
  it('merges new and old config in the reducer', function() {
    const state = [
      undefined,
      OAuthModule.OAuthGrantSuccess({ OAuthToken: 'test-token' })
    ].reduce(OAuthReducer);

    expect(state).toEqual({
      OAuthToken: 'test-token'
    });
  });
});
