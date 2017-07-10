import { expect } from 'chai';

import { path } from './util';

describe('utils', function() {
	describe('path', function() {
		it('should validate the path', function() {
			const validPaths = ['/test/:param', 'test/path', 'path'];
			const invalidPaths = ['', null, undefined, 123];

			validPaths.forEach(p => {
				expect(() => path(p, { param: 123 })).not.to.throw();
			});

			invalidPaths.forEach(p => {
				expect(() => path(p)).to.throw();
			});
		});

		it('should validate the params object', function() {
			const validParams = [{}, { a: 1 }, undefined];
			const invalidParams = [123, 'asdf', () => {}];

			validParams.forEach(p => {
				expect(() => path('path', p)).not.to.throw();
			});

			invalidParams.forEach(p => {
				expect(() => path('path', p)).to.throw();
			});
		});

		it('should throw if not all params are specified', function() {
			expect(() => path('/:param/asdf', { param: 123 })).not.to.throw();
			expect(() => path('/:param/asdf', {})).to.throw();
			expect(() => path('/param/asdf')).not.to.throw();
		});

		it('should return the populated path', function() {
			expect(path('/:one/:two', { one: '1', two: '2' })).to.equal('/1/2');
		});

		it('should make sure path starts with a slash', function() {
			expect(
				path('/:one/:two', { one: '1', two: '2' }).startsWith('/')
			).to.equal(true);
			expect(
				path(':one/:two', { one: '1', two: '2' }).startsWith('/')
			).to.equal(true);
			expect(path('one/:two', { two: '2' }).startsWith('/')).to.equal(true);
			expect(path('/one/:two', { two: '2' }).startsWith('/')).to.equal(true);
		});
	});
});
