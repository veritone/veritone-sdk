import { isEmpty, isFunction } from 'lodash';
import * as reduxHelpers from './';

describe('helpers/redux', function() {
  it('exports the right stuff', function() {
    const expectedKeys = [
      'promiseMiddleware',
      'createReducer',
      'reduceReducers',
      'handleApiCall',
      'fetchingStatus'
    ];

    expect(Object.keys(reduxHelpers)).toEqual(expectedKeys);

    expectedKeys.forEach(k => {
      const exported = reduxHelpers[k];
      const isEmptyExport = isEmpty(exported) && !isFunction(exported);
      expect(isEmptyExport).toEqual(false);
    });
  });
});
