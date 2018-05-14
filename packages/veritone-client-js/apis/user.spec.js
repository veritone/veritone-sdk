import { assertMatches } from '../apis/helper/test-util';
import userHandlers from './user';

describe('User', function() {
  describe('getCurrentUser', function() {
    it('gets the current user', function() {
      const expected = {
        method: 'get'
      };

      const result = userHandlers.getCurrentUser();
      assertMatches(result, expected);
    });
  });
  describe('getApplications', function() {
    it('gets applications', function() {
      const expected = {
        method: 'get',
        path: /applications/
      };

      const result = userHandlers.getApplications();
      assertMatches(result, expected);
    });
  });
});
