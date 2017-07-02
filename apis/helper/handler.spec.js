import { expect } from 'chai';

import { handler } from './handler';

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
		const validParams = [{}, { a: 1 }, undefined, null];
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

		it('should validate that all path params are present');
	});
});
