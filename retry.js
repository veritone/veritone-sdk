module.exports = function initRetryHelper(maxRetry, retryIntervalMs) {
	if (typeof maxRetry !== 'number') {
    	throw 'Missing maxRetry!';
	}
	if (maxRetry < 1) {
		throw 'Invalid maxRetry must be greater than 0!';
	}
	if (typeof retryIntervalMs !== 'number' || retryIntervalMs < 0) {
		throw 'Missing retryIntervalMs!';
	}

	var async = require('async');

	function retry(task, callback) {
		if (typeof task !== 'function') {
			throw 'task is required!';
		}
		if (typeof callback !== 'function') {
			throw 'callback is required!';
		}

		var attemptCount = 0;

		function retryTask(retryCallback) {
			attemptCount++;

			if (attemptCount === 1) {
				task(retryCallback);
			} else {
				setTimeout(function retryTaskTimeoutCallback() {
					task(retryCallback);
				}, retryIntervalMs);
			}
		}

		async.retry(maxRetry, retryTask, callback);
	}

	return {
		retry: retry
	};
};