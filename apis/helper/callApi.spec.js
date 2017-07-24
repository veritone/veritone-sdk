import { expect } from 'chai';
import nock from 'nock';
nock.disableNetConnect();

import callApi from './callApi';

const apiToken = 'api-token-abc';
const apiBaseUri = 'http://fake.domain';

process.on('unhandledRejection', error => {
	// suppress errors from nock disabling net connect
	if (error.name !== 'NetConnectNotAllowedError') {
		throw error;
	}
});

describe('callApi', function() {
	beforeEach(function() {
		this.callApi = callApi.bind(null, {
			token: apiToken,
			baseUrl: apiBaseUri
		});
	});

	afterEach(function() {
		nock.cleanAll();
	});

	it('validates baseUrl', function() {
		const validUris = ['http://www.test.com', 'https://www.test.com'];
		const invalidUris = ['www.test.com', 'test.com'];

		invalidUris.forEach(baseUrl =>
			expect(() => callApi({ baseUrl, token: apiToken }, () => {})).to.throw()
		);

		validUris.forEach(baseUrl =>
			expect(() =>
				callApi({ baseUrl, token: apiToken }, () => {})
			).not.to.throw()
		);
	});

	it('validates handlerFn', function() {
		const validHandlers = [() => {}];
		const invalidHandlers = [undefined, null, 123];

		invalidHandlers.forEach(handler =>
			expect(() =>
				callApi({ baseUrl: 'http://www.test.com', token: apiToken }, handler)
			).to.throw()
		);

		validHandlers.forEach(handler =>
			expect(() =>
				callApi({ baseUrl: 'http://www.test.com', token: apiToken }, handler)
			).not.to.throw()
		);
	});

	it('requires an auth token', function() {
		expect(() =>
			callApi({ baseUrl: 'http://www.test.com' }, () => {})
		).to.throw();

		expect(() =>
			callApi({ baseUrl: 'http://www.test.com', token: apiToken }, () => {})
		).not.to.throw();
	});

	it('validates requestOptions', function() {
		const baseOptions = {
			method: 'get',
			path: 'test-path'
		};

		expect(
			this.callApi(() => ({
				...baseOptions,
				_requestOptions: { unknownOption: true }
			}))
		).to.throw();

		expect(
			this.callApi(() => ({
				...baseOptions,
				_requestOptions: { maxRetries: 0 }
			}))
		).not.to.throw();
		expect(
			this.callApi(() => ({
				...baseOptions,
				_requestOptions: { maxRetries: -1 }
			}))
		).to.throw();
		expect(
			this.callApi(() => ({
				...baseOptions,
				_requestOptions: { maxRetries: 1.1 }
			}))
		).to.throw();

		expect(
			this.callApi(() => ({
				...baseOptions,
				_requestOptions: { timeoutMs: 0 }
			}))
		).not.to.throw();
		expect(
			this.callApi(() => ({
				...baseOptions,
				_requestOptions: { timeoutMs: -1 }
			}))
		).to.throw();
		expect(
			this.callApi(() => ({
				...baseOptions,
				_requestOptions: { timeoutMs: 1.1 }
			}))
		).to.throw();

		expect(
			this.callApi(() => ({
				...baseOptions,
				_requestOptions: { withCredentials: 'ok' }
			}))
		).to.throw();
		expect(
			this.callApi(() => ({
				...baseOptions,
				_requestOptions: { withCredentials: false }
			}))
		).not.to.throw();
		expect(
			this.callApi(() => ({
				...baseOptions,
				_requestOptions: { withCredentials: true }
			}))
		).not.to.throw();

		expect(
			this.callApi(() => ({
				...baseOptions,
				_requestOptions: { headers: 'ok' }
			}))
		).to.throw();
		expect(
			this.callApi(() => ({
				...baseOptions,
				_requestOptions: { headers: {} }
			}))
		).not.to.throw();
		expect(
			this.callApi(() => ({
				...baseOptions,
				_requestOptions: { headers: { someHeader: 'ok' } }
			}))
		).not.to.throw();
		expect(
			this.callApi(() => ({
				...baseOptions,
				_requestOptions: { headers: null }
			}))
		).not.to.throw();
	});

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

		requestFn(err => {
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

		requestFn((err, body, res) => {
			expect(err).to.equal(null);
			expect(res.status).to.equal(200);
			expect(body).to.equal('ok');

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
			.then(body => {
				expect(body).to.equal('ok');
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

	it('should attach additional headers if specified in requestOptions', function() {
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
			_requestOptions: { headers: { it: 'worked' } }
		}));

		return requestFn().then(() => scope.done());
	});

	it('should use a request timeout if timeout option is specified (times out)', function(
		done
	) {
		const scope = nock(apiBaseUri)
			.get('/test-path')
			.delayConnection(1000)
			.reply(200, 'ok');

		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path',
			_requestOptions: { timeoutMs: 50 }
		}));

		requestFn()
			.then(() => {
				done(new Error('Expected requestFn to throw.'));
			})
			.catch(err => {
				expect(err.code).to.equal('ECONNABORTED');
				done();
				scope.done();
			});
	});

	it('should use a request timeout if timeout option is specified (does not time out)', function() {
		const scope = nock(apiBaseUri)
			.get('/test-path')
			.delayConnection(50)
			.reply(200, 'ok');

		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path',
			_requestOptions: { timeoutMs: 100 }
		}));

		return requestFn().then(() => scope.done());
	});

	it('should allow response data to be transformed', function() {
		const scope = nock(apiBaseUri)
			.get('/test-path')
			.reply(200, { worked: false, otherKey: 123 });

		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path',
			_requestOptions: {
				transformResponseData: res => ({
					...res,
					worked: true
				})
			}
		}));

		return requestFn().then(body => {
			expect(body.worked).to.equal(true);
			expect(body.otherKey).to.equal(123);
			scope.done();
		});
	});

	it('should retry failed requests if configured (promise)', function() {
		const scope = nock(apiBaseUri)
			.get('/test-path')
			.reply(404, { worked: false })
			.get('/test-path')
			.reply(200, { worked: true });

		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path',
			_requestOptions: { maxRetries: 3, retryIntervalMs: 50 }
		}));

		return requestFn().then(body => {
			expect(body.worked).to.equal(true);

			scope.done();
		});
	});

	it('should retry failed requests if configured (callback)', function(done) {
		const scope = nock(apiBaseUri)
			.get('/test-path')
			.reply(404, { worked: false })
			.get('/test-path')
			.reply(200, { worked: true });

		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path',
			_requestOptions: { maxRetries: 3, retryIntervalMs: 50 }
		}));

		requestFn((err, body) => {
			expect(body.worked).to.equal(true);

			scope.done();
			done();
		});
	});

	it('should ultimately fail after exhausting retries (promise)', function(
		done
	) {
		const scope = nock(apiBaseUri)
			.get('/test-path')
			.reply(404, { worked: false })
			.get('/test-path')
			.reply(404, { worked: false });

		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path',
			_requestOptions: { maxRetries: 2, retryIntervalMs: 50 }
		}));

		requestFn().catch(err => {
			expect(err.response.data.worked).to.equal(false);

			scope.done();
			done();
		});
	});

	it('should ultimately fail after exhausting retries (callback)', function(
		done
	) {
		const scope = nock(apiBaseUri)
			.get('/test-path')
			.reply(404, { worked: false })
			.get('/test-path')
			.reply(404, { worked: false });

		const requestFn = this.callApi(() => ({
			method: 'get',
			path: 'test-path',
			_requestOptions: { maxRetries: 2, retryIntervalMs: 50 }
		}));

		requestFn(err => {
			expect(err.response.data.worked).to.equal(false);

			scope.done();
			done();
		});
	});

	it('should resolve by default if status >= 200 && status < 300', function(
		done
	) {
		const scope1 = nock(apiBaseUri).get('/test-path1').reply(200);
		const scope2 = nock(apiBaseUri).get('/test-path2').reply(299);

		Promise.all([
			this.callApi(() => ({
				method: 'get',
				path: 'test-path1'
			}))(),
			this.callApi(() => ({
				method: 'get',
				path: 'test-path2'
			}))()
		]).then(() => {
			scope1.done();
			scope2.done();
			done();
		});
	});

	it('should reject by default if status < 200 && status >= 300', function(
		done
	) {
		const scope1 = nock(apiBaseUri).get('/test-path1').reply(199);
		const scope2 = nock(apiBaseUri).get('/test-path2').reply(300);

		let status1, status2;

		this.callApi(() => ({
			method: 'get',
			path: 'test-path1'
		}))()
			.catch(e => {
				status1 = e.response.status;
			})
			.then(
				this.callApi(() => ({
					method: 'get',
					path: 'test-path2'
				}))
			)
			.catch(e => {
				status2 = e.response.status;
			})
			.then(() => {
				expect(status1).to.equal(199);
				expect(status2).to.equal(300);

				scope1.done();
				scope2.done();
				done();
			});
	});

	it('should resolve/reject properly with a custom status validator', function(
		done
	) {
		const scope1 = nock(apiBaseUri).get('/test-path1').reply(101, 'one');
		const scope2 = nock(apiBaseUri).get('/test-path2').reply(102, 'two');

		let status1, body2;

		this.callApi(() => ({
			method: 'get',
			path: 'test-path1',
			_requestOptions: {
				validateStatus: status => status !== 101
			}
		}))()
			.catch(e => {
				// fails because status is 101
				status1 = e.response.status;
			})
			.then(
				this.callApi(() => ({
					method: 'get',
					path: 'test-path2',
					_requestOptions: {
						validateStatus: status => status !== 101
					}
				}))
			)
			.then(data => {
				// fails because status is !== 101
				body2 = data;
			})
			.then(() => {
				expect(status1).to.equal(101);
				expect(body2).to.equal('two');

				scope1.done();
				scope2.done();
				done();
			});
	});

	it('allows request options to be overridden on a per-call basis (cb)', function(
		done
	) {
		const handler = id => ({
			method: 'get',
			path: 'test',
			query: { id },
			_requestOptions: {
				headers: { ok: 'no' }
			}
		});

		const scope = nock(apiBaseUri, {
			reqheaders: {
				ok: 'yes'
			}
		})
			.get('/test')
			.query({
				id: 123
			})
			.reply(200, 'ok');

		this.callApi(handler)(
			123,
			{
				headers: {
					ok: 'yes'
				}
			},
			function() {
				scope.done();
				done();
			}
		);
	});

	it('allows request options to be overridden on a per-call basis (promise)', function(
		done
	) {
		const handler = id => ({
			method: 'get',
			path: 'test',
			query: { id },
			_requestOptions: {
				headers: { ok: 'no' }
			}
		});

		const scope = nock(apiBaseUri, {
			reqheaders: {
				ok: 'yes'
			}
		})
			.get('/test')
			.query({
				id: 123
			})
			.reply(200, 'ok');

		this.callApi(handler)(123, {
			headers: {
				ok: 'yes'
			}
		}).then(() => {
			scope.done();
			done();
		});
	});

	it('deals with optional args in handlers (cb)', function(done) {
		let handler = (id, options) => {
			return {
				method: 'get',
				path: `ok/${id}`,
				query: options
			};
		};

		const scope = nock(apiBaseUri).get(/ok\/123/).reply(200, 'ok');

		this.callApi(handler)(123, (err, body, res) => {
			expect(err).to.equal(null);
			expect(res.request.path).to.equal('/ok/123');

			scope.done();
			done();
		});
	});

	it('deals with optional args in handlers (promise)', function(done) {
		let handler = (id, options) => {
			const path = `${id}/${options || 'no-options'}`;

			return {
				method: 'get',
				path
			};
		};

		// assert that options is undefined
		const scope = nock(apiBaseUri).get('/123/no-options').reply(200, 'ok');

		this.callApi(handler)(123).then(() => {
			scope.done();
			done();
		});
	});

	it('deals with optional args + request overrides in handlers', function(
		done
	) {
		let handler = (id, options) => {
			return {
				method: 'get',
				path: `ok/${id}`,
				query: options,
				_requestOptions: {
					validateStatus: s => s === 200
				}
			};
		};

		const scope = nock(apiBaseUri).get(/ok\/123/).reply(201, 'ok');

		this.callApi(handler)(
			123,
			{ validateStatus: s => s === 201 },
			(err, body, res) => {
				expect(err).to.equal(null);
				// no query in path
				expect(res.request.path).to.equal('/ok/123');

				scope.done();
				done();
			}
		);
	});

	it('binds options to nonStandard handlers, and leaves them otherwise unmodified', function() {
		let handler = ({ token, baseUrl }, id) => ({
			method: 'get',
			path: id,
			data: { token, baseUrl }
		});

		handler.isNonStandard = true;
		const result = this.callApi(handler)('123');

		expect(result).to.deep.equal({
			method: 'get',
			path: '123',
			data: { token: apiToken, baseUrl: apiBaseUri }
		});
	});
});
