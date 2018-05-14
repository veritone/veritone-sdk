import { expect } from 'chai';
import nock from 'nock';
nock.disableNetConnect();

import veritoneApi from './ApiClient';

const apiBaseUrl = 'http://fake.domain';

describe('veritoneApi', function() {
  describe('API methods', function() {
    it('Returns the configured API functions', function() {
      const api = veritoneApi(
        {
          token: 'token-abc',
          apiToken: 'api-token-abc'
        },
        {
          libraries: {
            getLibrary: () => 'ok'
          }
        }
      );

      expect(typeof api.libraries.getLibrary).to.equal('function');
    });

    it('should wrap handlers to make an API call with options', function(done) {
      const testToken = 'api-token-abc';
      const api = veritoneApi(
        {
          token: testToken,
          apiToken: 'api-token',
          baseUrl: apiBaseUrl,
          maxRetries: 2,
          retryIntervalMs: 25
        },
        {
          libraries: {
            getLibrary: () => ({
              method: 'get',
              path: 'test-path',
              _requestOptions: { version: 1 }
            })
          }
        }
      );

      const scope = nock(`${apiBaseUrl}`, {
        reqheaders: {
          authorization: `Bearer ${testToken}`
        }
      })
        .get(/v1\/test-path/)
        .reply(404, 'not found')
        .get(/v1\/test-path/)
        .reply(200, 'ok');

      api.libraries.getLibrary((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.equal('ok');

        scope.done();
        done();
      });
    });
  });
});
