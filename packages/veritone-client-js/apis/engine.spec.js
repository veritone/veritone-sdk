import nock from 'nock';
nock.disableNetConnect();

// import { headers } from './config';
// import { noop } from './helper/util';
import { assertMatches } from '../apis/helper/test-util';
import engineHandlers from './engine';

describe('Engine', function() {
  describe('getEngines', function() {
    it('makes a get request to list engines', function() {
      const expected = {
        method: 'get',
        path: /engine/
      };

      const result = engineHandlers.getEngines();

      assertMatches(result, expected);
    });
  });

  describe('getEngineCategories', function() {
    it('makes a get request to list engine categories', function() {
      const expected = {
        method: 'get',
        path: /engine\/category/
      };

      const result = engineHandlers.getEngineCategories();

      assertMatches(result, expected);
    });
  });

  describe('getEngineUsingRightsFiltered', function() {
    it('makes a get request to the correct endpoint', function() {
      const expected = {
        method: 'get',
        path: /some-id/
      };

      const result = engineHandlers.getEngineUsingRightsFiltered('some-id');

      assertMatches(result, expected);
    });
  });

  describe('getEngineCategoriesWithEngines', function() {
    it('makes a get request to the correct endpoint', function() {
      const expected = {
        method: 'get',
        path: /job\/task_type/
      };

      const result = engineHandlers.getEngineCategoriesWithEngines('some-id');

      assertMatches(result, expected);
    });
  });
});
