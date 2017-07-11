import { expect } from 'chai';
import nock from 'nock';
nock.disableNetConnect();

import veritoneApi from './ApiClient';

// const noop = () => {};
const apiBaseUrl = 'http://fake.domain';

describe('veritoneApi', function() {
	describe('veritoneApi constructor', function() {
		it('throws if no token is configured', function() {
			expect(() => veritoneApi({})).to.throw();
			expect(() => veritoneApi({})).to.throw();
			expect(() => veritoneApi({ token: 'testToken' })).not.to.throw();
		});
	});

	describe('API methods', function() {
		it('Returns the configured API functions', function() {
			const api = veritoneApi(
				{
					token: 'api-token-abc'
				},
				{
					libraries: {
						getLibrary: () => 'ok'
					}
				}
			);

			expect(typeof api.libraries.getLibrary).to.equal('function');
		});

		it('should wrap handlers to make an API call', function(done) {
			const api = veritoneApi(
				{
					token: 'api-token-abc',
					baseUrl: apiBaseUrl
				},
				{
					libraries: {
						getLibrary: () => ({
							method: 'get',
							path: '/test-path'
						})
					}
				}
			);

			const scope = nock(apiBaseUrl).get(/test-path/).reply(200, 'ok');
			api.libraries.getLibrary(() => {
				scope.done();
				done();
			});
		});
	});
});
