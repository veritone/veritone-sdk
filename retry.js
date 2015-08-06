module.exports = function initRetryHelper() {
	var async = require('async');

	function retry(maxRetry, retryIntervalMs, task, callback) {
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