import { expect } from 'chai';
// fixme: move polyfills to entry
const values = require('object.values');
if (!Object.values) {
	values.shim();
}


import { handler, REQUIRED } from './handler';

describe('handler', function() {
	it('should validate the request method', function() {
		const methods = ['get', 'post', 'put', 'patch', 'delete', 'head'];
		const allowedMethods = [
			...methods,
			// case-insensitive
			...methods.map(s => s.toUpperCase())
		];
		const invalidMethods = ['asdf', undefined, null, () => {}, 5];

		allowedMethods.forEach(m => {
			expect(() => handler(m, 'path')).not.to.throw();
		});

		invalidMethods.forEach(m => {
			expect(() => handler(m, 'path')).to.throw();
		});
	});

	it('should validate the path', function() {
		const validPaths = ['/test/:param', 'test/path', 'path'];
		const invalidPaths = ['', null, undefined, 123];

		validPaths.forEach(p => {
			expect(() => handler('get', p)).not.to.throw();
		});

		invalidPaths.forEach(p => {
			expect(() => handler('get', p)).to.throw();
		});
	});

	it('should validate the params object', function() {
		const validParams = [{}, { a: 1 }, undefined];
		const invalidParams = [123, 'asdf', () => {}];

		validParams.forEach(p => {
			expect(() => handler('get', 'path', p)).not.to.throw();
		});

		invalidParams.forEach(p => {
			expect(() => handler('get', 'path', p)).to.throw();
		});

		it('should validate against collisions between all configurable params');
	});

	it('should return a handler function', function() {
		expect(typeof handler('get', 'path')).to.equal('function');
	});

	describe('method', function() {
		it('should add the method to the request object', function() {
			const request = handler('get', 'path');
			expect(request().method).to.equal('GET');
		});
	});

	describe('path', function() {
		it('should add a basic path to the request object', function() {
			const request = handler('get', '/path')();
			expect(request.path).to.equal('/path');
		});

		it('should prepend a slash to the path if needed', function() {
			let request = handler('get', 'path')();
			expect(request.path).to.equal('/path');

			request = handler('get', 'path/')();
			expect(request.path).to.equal('/path/');
		});

		it('should accept path parameters and add them to the request object', function() {
			let request = handler('get', '/thing/:id/path')({ id: 5 });
			expect(request.path).to.equal('/thing/5/path');

			request = handler('get', '/:name/:id/path')({ name: 'mitch', id: 5 });
			expect(request.path).to.equal('/mitch/5/path');
		});

		it('should validate that all path params are present', function() {
			let makeRequest = handler('get', '/:name/:id/path');

			expect(() => makeRequest({ id: 5 })).to.throw();
			expect(() => makeRequest({ name: 'mitch' })).to.throw();
		});
	});

	describe('request data', function() {
		it('should attach the request data to PUT/POST/PATCH', function() {
			const methods = ['put', 'post', 'patch'];
			const handlers = methods.map(m => handler(m, '/:thing/path'));

			handlers.forEach(h => {
				const request = h({ thing: 123 }, { worked: true });
				expect(request.data).to.eql({
					worked: true
				});
			});
		});

		it('should ignore the request body for methods that do not support it', function() {
			const methods = ['get', 'delete', 'head'];
			const handlers = methods.map(m => handler(m, '/:thing/path'));

			handlers.forEach(h => {
				const request = h({ thing: 123 }, { body: true });
				expect(request.data).to.be.undefined;
			});
		});

		xit(
			'should accept request data as the first argument if no path params exist',
			function() {
				const makeRequest = handler('post', '/no/parameters');

				const request = makeRequest({ worked: true });
				expect(request.data).to.eql({
					worked: true
				});

				expect(request.path).to.eql('/no/parameters');
			}
		);
	});

	describe('query parameters', function() {
		it('should attach specified query params to the request', function() {
			const makeRequest = handler('get', '/path', {
				query: ['status']
			});

			let request = makeRequest({ status: 'ok' });
			expect(request.query).to.eql({ status: 'ok' });
		});

		it('should attach specified query params to the request (with data)', function() {
			const makeRequest = handler('post', '/path', {
				query: ['status']
			});

			let request = makeRequest({ status: 'ok' }, { value: 123 });
			expect(request.query).to.eql({ status: 'ok' });
			expect(request.data).to.eql({ value: 123 });
		});

		it('should ignore any params not specified', function() {
			const makeRequest = handler('post', '/path', {
				query: ['status']
			});

			let request = makeRequest({ status: 'ok', somethingElse: 'not-ok' });
			expect(request.query).to.eql({ status: 'ok' });
		});

		it('should allow default params', function() {
			const makeRequest = handler('post', '/path', {
				query: [{ paramWithDefault: 5 }, 'paramWithoutDefault']
			});

			let request = makeRequest({ paramWithoutDefault: 6 });
			expect(request.query).to.eql({
				paramWithDefault: 5,
				paramWithoutDefault: 6
			});
		});

		it('should validate presence of required query params', function() {
			const makeRequest = handler('post', '/path', {
				query: [{ requiredParam: REQUIRED }, { otherRequiredParam: REQUIRED }]
			});

			const invalidParams = [
				{},
				{ requiredParam: 5 },
				{ otherRequiredParam: 5 }
			];

			invalidParams.forEach(p => {
				expect(() => makeRequest(p)).to.throw();
			});

			expect(() =>
				makeRequest({ requiredParam: 5, otherRequiredParam: 5 })
			).not.to.throw();
		});
		xit('should allow camelCase and Original-Case config keys', function() {});
	});

	describe('headers', function() {
		it('should attach specified headers to the request', function() {
			const makeRequest = handler('get', '/path', {
				headers: ['Some-Header']
			});

			let request = makeRequest({ 'Some-Header': 'ok' });
			expect(request.headers).to.eql({ 'Some-Header': 'ok' });
		});

		it('should ignore any headers not specified', function() {
			const makeRequest = handler('post', '/path', {
				headers: ['status']
			});

			let request = makeRequest({ status: 'ok', somethingElse: 'not-ok' });
			expect(request.headers).to.eql({ status: 'ok' });
		});

		it('should allow default headers', function() {
			const makeRequest = handler('post', '/path', {
				headers: [{ headerWithDefault: 5 }, 'headerWithoutDefault']
			});

			let request = makeRequest({ headerWithoutDefault: 6 });
			expect(request.headers).to.eql({
				headerWithDefault: 5,
				headerWithoutDefault: 6
			});
		});

		it('should validate the presence of required headers', function() {
			const makeRequest = handler('post', '/path', {
				headers: [{ requiredHeader: REQUIRED }, { otherRequiredHeader: REQUIRED }]
			});

			const invalidHeaders = [
				{},
				{ requiredHeader: 5 },
				{ otherRequiredHeader: 5 }
			];

			invalidHeaders.forEach(p => {
				expect(() => makeRequest(p)).to.throw();
			});

			expect(() =>
				makeRequest({ requiredHeader: 5, otherRequiredHeader: 5 })
			).not.to.throw();
		});
		xit('should allow camelCase and Original-Case config keys');
	});
});
