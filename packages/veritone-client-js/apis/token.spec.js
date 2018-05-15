import { expect } from 'chai';
import { noop } from './helper/util';

import { assertMatches } from '../apis/helper/test-util';
import tokenHandlers from './token';

describe('Token', function() {
  describe('createToken', function() {
    it('validates label', function() {
      const incorrectLabels = [undefined, noop, ''];
      const correctLabels = ['ok'];

      incorrectLabels.forEach(l => {
        expect(() => tokenHandlers.createToken(l, 'a', noop)).to.throw();
      });

      correctLabels.forEach(l => {
        expect(() => tokenHandlers.createToken(l, 'a', noop)).not.to.throw();
      });
    });

    it('validates rights', function() {
      const incorrectRights = [undefined, ''];
      const correctRights = ['rights']; // todo: string or array?

      incorrectRights.forEach(r => {
        expect(() => tokenHandlers.createToken('label', r, noop)).to.throw();
      });

      correctRights.forEach(r => {
        expect(() =>
          tokenHandlers.createToken('label', r, noop)
        ).not.to.throw();
      });
    });

    it('posts to API with tokenLabel and rights in json body', function() {
      const expected = {
        method: 'post',
        path: /token/,
        data: {
          tokenLabel: 'label',
          rights: 'rights'
        }
      };

      const result = tokenHandlers.createToken('label', 'rights');

      assertMatches(result, expected);
    });
  });

  describe('revokeToken', function() {
    it('validates token', function() {
      const incorrectTokens = [undefined, noop, ''];
      const correctTokens = ['ok'];

      incorrectTokens.forEach(t => {
        expect(() => tokenHandlers.revokeToken(t, noop)).to.throw();
      });

      correctTokens.forEach(t => {
        expect(() => tokenHandlers.revokeToken(t, noop)).not.to.throw();
      });
    });

    it('makes a delete request to the api with the token', function() {
      const expected = {
        method: 'delete',
        path: /some-token/
      };

      const result = tokenHandlers.revokeToken('some-token');

      assertMatches(result, expected);
    });
  });
});
