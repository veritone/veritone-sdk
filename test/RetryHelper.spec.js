'use strict';

describe('RetryHelper', function() {

	var RetryHelper = require('../RetryHelper');

	it('should have defaults', function(done) {
		var retryHelper = new RetryHelper();
		expect(retryHelper._maxRetry).toEqual(0);
		expect(retryHelper._retryIntervalMs).toEqual(0);
		done();
	});

	it('should load settings', function(done) {
		var retryHelper = new RetryHelper({ maxRetry: 3, retryIntervalMs: 10 });
		expect(retryHelper._maxRetry).toEqual(3);
		expect(retryHelper._retryIntervalMs).toEqual(10);
		done();
	});

	it('should have function "retry"', function(done) {
		var retryHelper = new RetryHelper({ maxRetry: 3 });
		expect(retryHelper.retry).toBeTruthy();
		expect(typeof retryHelper.retry).toEqual('function');
		done();
	});

	it('should run once', function(done) {
		var retryHelper = new RetryHelper({ maxRetry: 3 }),
			runCount = 0;

		function task(cb) {
			if (typeof cb !== 'function') {
				throw new Error('Invalid cb value!');
			}

			runCount++;
			cb(null, 'whee');
		}

		retryHelper.retry(task, function(err, results) {
			expect(err).not.toBeTruthy();
			expect(results).toEqual('whee');
			expect(runCount).toEqual(1);

			done();
		});
	});

	it('should run three times', function(done) {
		var retryHelper = new RetryHelper({ maxRetry: 3 }),
			runCount = 0;

		function task(cb) {
			if (typeof cb !== 'function') {
				throw new Error('Invalid cb value!');
			}

			runCount++;
			if (runCount < 3) {
				cb('error');
			} else {
				cb(null, 'whee');
			}
		}

		retryHelper.retry(task, function(err, results) {
			expect(err).not.toBeTruthy();
			expect(results).toEqual('whee');
			expect(runCount).toEqual(3);

			done();
		});
	});

	it('should run and return error', function(done) {
		var retryHelper = new RetryHelper({ maxRetry: 3 });

		function task(cb) {
			if (typeof cb !== 'function') {
				throw new Error('Invalid cb value!');
			}

			cb('error');
		}

		retryHelper.retry(task, function(err, results) {
			expect(err).toEqual('error');
			expect(results).not.toBeTruthy();

			done();
		});
	});
});
