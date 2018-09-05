import * as reduxHelpers from './'

describe('helpers/redux', function() {
  it('exports the right stuff', function() {
    expect(Object.keys(reduxHelpers)).toEqual([
      'promiseMiddleware',
      'createReducer',
      'reduceReducers',
      'handleApiCall',
      'fetchingStatus'
    ])
  });
});
