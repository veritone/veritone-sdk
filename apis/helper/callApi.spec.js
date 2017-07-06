import { expect } from 'chai';
import nock from 'nock';
nock.disableNetConnect();

import { callApi } from './callApi';

const apiToken = 'api-token-abc';
const apiBaseUri = 'http://fake.domain';

describe('callApi', function() {
	beforeEach(function() {
		this.callApi = callApi.bind(null, {
			token: apiToken,
			baseUri: apiBaseUri
		});
	});

	afterEach(function() {
		nock.cleanAll();
	});

	it('validates baseUri', function() {
		const validUris = ['http://www.test.com', 'https://www.test.com'];
		const invalidUris = ['www.test.com', 'test.com'];

		invalidUris.forEach(baseUri =>
			expect(() => callApi({ baseUri, token: apiToken }, () => {})).to.throw()
		);

		validUris.forEach(baseUri =>
			expect(() =>
				callApi({ baseUri, token: apiToken }, () => {})
			).not.to.throw()
		);
	});

	it('validates handlerFn', function() {
		const validHandlers = [() => {}];
		const invalidHandlers = [undefined, null, 123];

		invalidHandlers.forEach(handler =>
			expect(() =>
				callApi({ baseUri: 'http://www.test.com', token: apiToken }, handler)
			).to.throw()
		);

		validHandlers.forEach(handler =>
			expect(() =>
				callApi({ baseUri: 'http://www.test.com', token: apiToken }, handler)
			).not.to.throw()
		);
	});

	it('requires an auth token', function() {
		expect(() =>
			callApi({ baseUri: 'http://www.test.com' }, () => {})
		).to.throw();

		expect(() =>
			callApi({ baseUri: 'http://www.test.com', token: apiToken }, () => {})
		).not.to.throw();
	});

	it('validates requestOptions');

	it('returns a function', function() {
		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path'
		}));

		expect(requestFn).to.be.a('function');
	});

	it('should call the callback with an error', function(done) {
		const scope = nock(apiBaseUri).get('/test-path').reply(404);

		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path'
		}));

		requestFn(null, null, err => {
			expect(err.response.status).to.equal(404);

			scope.done();
			done();
		})
			// suppress unhandled rejection error
			.catch(() => {});
	});

	it('should call the callback with the response', function(done) {
		const scope = nock(apiBaseUri).get('/test-path').reply(200, 'ok');

		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path'
		}));

		requestFn(null, null, (err, res) => {
			expect(err).to.equal(null);
			expect(res.status).to.equal(200);
			expect(res.data).to.equal('ok');

			scope.done();
			done();
		});
	});

	it('should return a promise that is rejected on error', function(done) {
		const scope = nock(apiBaseUri).get('/test-path').reply(404);

		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path'
		}));

		requestFn()
			.then(() => {
				done(new Error('Expected requestFn to throw.'));
			})
			.catch(err => {
				expect(err.response.status).to.equal(404);
				done();
			})
			.then(() => scope.done());
	});

	it('should return a promise that is resolved with the response', function(
		done
	) {
		const scope = nock(apiBaseUri).get('/test-path').reply(200, 'ok');

		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path'
		}));

		requestFn()
			.then(res => {
				expect(res.status).to.equal(200);
				expect(res.data).to.equal('ok');
				done();
			})
			.catch(() => {
				done(new Error('Expected requestFn to throw.'));
			})
			.then(() => scope.done());
	});

	it('should include token in the request', function() {
		const scope = nock(apiBaseUri, {
			reqheaders: {
				authorization: `Bearer ${apiToken}`
			}
		})
			.get('/test-path')
			.reply(200, 'ok');

		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path'
		}));

		return requestFn().then().then(() => scope.done());
	});

	it('should make a post request with data payload', function() {
		const scope = nock(apiBaseUri)
			.post('/test-path', {
				postBody: 'ok'
			})
			.reply(200, 'ok');

		const requestFn = this.callApi(() => ({
			method: 'post',
			path: 'test-path',
			data: { postBody: 'ok' }
		}));

		return requestFn().then(() => scope.done());
	});

	it('should include query params in the request', function() {
		const scope = nock(apiBaseUri)
			.get('/test-path')
			.query({ it: 'worked' })
			.reply(200, 'ok');

		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path',
			query: { it: 'worked' }
		}));

		return requestFn().then(() => scope.done());
	});

	it('should include headers in the request', function() {
		const scope = nock(apiBaseUri, {
			reqheaders: {
				it: 'worked'
			}
		})
			.get('/test-path')
			.reply(200, 'ok');

		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path',
			headers: { it: 'worked' }
		}));

		return requestFn().then(() => scope.done());
	});
});
