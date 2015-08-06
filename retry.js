'use strict';

var async = require('async');

function RetryHelper(options) {
	options = options || {};
	options.maxRetry = options.maxRetry || 0;
	options.retryIntervalMs = retryIntervalMs || 0;

	if (typeof options.maxRetry !== 'number') {
		throw 'maxRetry must be a number!';
	}
	if (options.maxRetry < 0) {
		throw 'maxRetry must be zero or greater!';
	}

	if (typeof options.retryIntervalMs !== 'number') {
		throw 'retryIntervalMs must be a number!';
	}
	if (options.retryIntervalMs < 0) {
		throw 'retryIntervalMs must be zero or greater!';
	}

	this._maxRetry = options.maxRetry;
	this._retryIntervalMs = options.retryIntervalMs;
}

RetryHelper.prototype.retry = function retry(task, callback) {
	if (typeof task !== 'function') {
		throw 'task is required!';
	}
	if (typeof callback !== 'function') {
		throw 'callback is required!';
	}

	var self = this;

	if (self._maxRetry === 0) {
		return task(callback);
	}

	var attemptCount = 0;

	function retryTask(retryCallback) {
		attemptCount++;

		if (attemptCount === 1) {
			task(retryCallback);
		} else {
			setTimeout(function retryTaskTimeoutCallback() {
				task(retryCallback);
			}, self._retryIntervalMs);
		}
	}

	async.retry(self._maxRetry, retryTask, callback);
};

module.exports = RetryHelper;

