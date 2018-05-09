import { expect } from 'chai';

import { assertMatches } from '../apis/helper/test-util';
import facesetHandlers from './faceset';

describe('Faceset', function() {
  describe('queryFaceset', function() {
    it('validates q', function() {
      expect(() => facesetHandlers.queryFaceset()).to.throw(/query/);
    });

    it('makes the correct request to the api', function() {
      const expected = {
        method: 'get',
        path: /autocomplete\/my-face/
      };

      const result = facesetHandlers.queryFaceset('my-face');
      assertMatches(result, expected);
    });
  });

  describe('createFaceset', function() {
    it('validates faceSet', function() {
      expect(() => facesetHandlers.createFaceset()).to.throw(/faceset/);
      expect(() => facesetHandlers.createFaceset({})).to.throw(/faceSetId/);
    });

    it('makes the correct request to the api', function() {
      const data = {
        faceSetId: 'my-face'
      };

      const expected = {
        method: 'post',
        path: /my-face/,
        data
      };

      const result = facesetHandlers.createFaceset(data);
      assertMatches(result, expected);
    });
  });

  describe('updateFaceset', function() {
    it('validates faceSet', function() {
      expect(() => facesetHandlers.updateFaceset()).to.throw(/faceset/);
      expect(() => facesetHandlers.updateFaceset({})).to.throw(/faceSetId/);
    });

    it('makes the correct request to the api', function() {
      const data = {
        faceSetId: 'my-face'
      };

      const expected = {
        method: 'put',
        path: /my-face/,
        data
      };

      const result = facesetHandlers.updateFaceset(data);
      assertMatches(result, expected);
    });
  });
});
