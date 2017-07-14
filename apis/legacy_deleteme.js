import request from 'request';
import validatejs from 'validate.js';
import path from 'path';

import RetryHelper from './helper/RetryHelper';
import { endpoints } from './config';

const retryHelper = new RetryHelper();
const baseUri = 'http://fake.domain';
var enginePageLimit = 99999;
function generateHeaders() {
	return {};
}

export default {
	createJob: function createJob(job, callback) {
		if (typeof job !== 'object') {
			throw new Error('Missing job!');
		}
		if (typeof job.recordingId === 'number') {
			job.recordingId = job.recordingId + '';
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}
		var validation = {
			tasks: {
				presence: true
			}
		};
		var validationErrors = validatejs(job, validation);
		if (validationErrors) {
			throw new Error('Invalid job object!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var self = this;

		function task(callback) {
			request(
				{
					method: 'POST',
					url: baseUri + endpoints.job,
					headers: generateHeaders(self._token),
					json: job
				},
				function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null, body);
				}
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	getJobs: function getJobs(options, callback) {
		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		} else if (typeof options === 'string') {
			options = {
				recordingId: options
			};
		} else if (typeof options !== 'object') {
			throw new Error('Missing options!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var uri = baseUri + endpoints.job;
		if (options.limit || options.offset) {
			if (options.limit && options.offset) {
				uri += '?limit=' + options.limit + '&offset=' + options.offset;
			} else if (options.limit) {
				uri += '?limit=' + options.limit;
			} else if (options.offset) {
				uri += '?offset=' + options.offset;
			}
		}

		var self = this;

		function task(callback) {
			request(
				{
					method: 'GET',
					url: uri,
					headers: generateHeaders(self._token),
					json: true
				},
				function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null, body);
				}
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	getJobsForRecording: function getJobsForRecording(options, callback) {
		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		} else if (typeof options === 'string') {
			options = {
				recordingId: options
			};
		} else if (typeof options !== 'object') {
			throw new Error('Missing options!');
		}
		if (typeof options.recordingId === 'number') {
			options.recordingId = options.recordingId + '';
		}
		if (typeof options.recordingId !== 'string' || options.recordingId === '') {
			throw new Error('Missing options.recordingId!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var uri = baseUri + endpoints.job + 'recording/' + options.recordingId;
		if (options.limit || options.offset) {
			if (options.limit && options.offset) {
				uri += '?limit=' + options.limit + '&offset=' + options.offset;
			} else if (options.limit) {
				uri += '?limit=' + options.limit;
			} else if (options.offset) {
				uri += '?offset=' + options.offset;
			}
		}

		var self = this;

		function task(callback) {
			request(
				{
					method: 'GET',
					url: uri,
					headers: generateHeaders(self._token),
					json: true
				},
				function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null, body);
				}
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	getJob: function getJob(jobId, callback) {
		if (typeof jobId !== 'string' || jobId === '') {
			throw new Error('Missing jobId!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var self = this;

		function task(callback) {
			request(
				{
					method: 'GET',
					url: baseUri + endpoints.job + jobId,
					headers: generateHeaders(self._token),
					json: true
				},
				function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null, body);
				}
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	restartJob: function restartJob(jobId, callback) {
		if (typeof jobId !== 'string' || jobId === '') {
			throw new Error('Missing jobId!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		request(
			{
				method: 'PUT',
				url: baseUri + endpoints.job + jobId + '/restart',
				headers: generateHeaders(this._token),
				json: true
			},
			function requestCallback(err, response, body) {
				if (err) {
					return callback(err, body);
				}
				if (response.statusCode !== 204) {
					return callback('Received status: ' + response.statusCode, body);
				}
				callback(null, body);
			}
		);
	},

	retryJob: function retryJob(jobId, callback) {
		if (typeof jobId !== 'string' || jobId === '') {
			throw new Error('Missing jobId!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		request(
			{
				method: 'PUT',
				url: baseUri + endpoints.job + jobId + '/retry',
				headers: generateHeaders(this._token),
				json: true
			},
			function requestCallback(err, response, body) {
				if (err) {
					return callback(err, body);
				}
				if (response.statusCode !== 204) {
					return callback('Received status: ' + response.statusCode, body);
				}
				callback(null, body);
			}
		);
	},

	cancelJob: function cancelJob(jobId, callback) {
		if (typeof jobId !== 'string' || jobId === '') {
			throw new Error('Missing jobId!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		request({
			method: 'DELETE',
			url: baseUri + endpoints.job+ jobId,
			headers: generateHeaders(this._token),
			json: true
		}, function requestCallback(err, response, body) {
			if (err) {
				return callback(err, body);
			}
			if (response.statusCode !== 204) {
				return callback('Received status: ' + response.statusCode, body);
			}
			callback(null, body);
		});
	},

	getEngines: function getEngines(callback) {
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var self = this;

		function task(callback) {
			request(
				{
					method: 'GET',
					url: baseUri + endpoints.engine + '?limit=' + enginePageLimit,
					headers: generateHeaders(self._token),
					json: true
				},
				function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null, body);
				}
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	getEngineCategories: function getEngineCategories(callback) {
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var self = this;

		function task(callback) {
			request(
				{
					method: 'GET',
					url:
						baseUri + endpoints.engine + '/category?limit=' + enginePageLimit,
					headers: generateHeaders(self._token),
					json: true
				},
				function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null, body);
				}
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	getTaskType: function getTaskType() {
		throw new Error('Migration - use getEngineUsingRightsFiltered!');
	},

	getTaskTypes: function getTaskTypes() {
		throw new Error('Migration - use getEngineCategoriesWithEngines!');
	},

	getEngineUsingRightsFiltered: function getEngineUsingRightsFiltered(
		engineId,
		callback
	) {
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var self = this;

		function task(callback) {
			request(
				{
					method: 'GET',
					url: baseUri + endpoints.taskTypeByJob + engineId,
					headers: generateHeaders(self._token),
					json: true
				},
				function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null, body);
				}
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	getEngineCategoriesWithEngines: function getEngineCategoriesWithEngines(
		callback
	) {
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var self = this;

		function task(callback) {
			request(
				{
					method: 'GET',
					url: baseUri + endpoints.job + 'task_type',
					headers: generateHeaders(self._token),
					json: true
				},
				function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null, body);
				}
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	updateTask: function updateTask(jobId, taskId, result, callback) {
		if (typeof jobId !== 'string' || jobId === '') {
			throw new Error('Missing jobId!');
		}
		if (typeof taskId !== 'string' || taskId === '') {
			throw new Error('Missing taskId!');
		}
		if (typeof result !== 'object') {
			throw new Error('Missing result!');
		}
		if (typeof result.taskStatus !== 'string' || result.taskStatus === '') {
			throw new Error('Missing result.taskStatus!');
		}
		if (
			result.taskStatus !== 'running' &&
			result.taskStatus !== 'complete' &&
			result.taskStatus !== 'failed'
		) {
			throw new Error('Invalid task status: ' + result.taskStatus);
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var self = this;

		function task(callback) {
			request(
				{
					method: 'PUT',
					url: baseUri + endpoints.job + jobId + '/task/' + taskId,
					headers: generateHeaders(self._token),
					json: result
				},
				function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 204) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null);
				}
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	search: function search(searchRequest, callback) {
		if (typeof searchRequest !== 'object') {
			throw new Error('Missing search request!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var self = this;

		function task(callback) {
			request(
				{
					method: 'POST',
					url: baseUri + endpoints.search,
					headers: generateHeaders(self._token),
					json: searchRequest
				},
				function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null, body);
				}
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	pollTask: function pollTask(jobId, taskId, data, callback) {
		if (typeof jobId !== 'string' || jobId === '') {
			throw new Error('Missing jobId!');
		}
		if (typeof taskId !== 'string' || taskId === '') {
			throw new Error('Missing taskId!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}
		data = data || {};

		var self = this;

		function task(callback) {
			request(
				{
					method: 'POST',
					url: baseUri + endpoints.job + jobId + '/task/' + taskId + '/poll',
					headers: generateHeaders(self._token),
					json: data
				},
				function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 204) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null, body);
				}
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	//generateRecordingsReport: function generateRecordingsReport(reportRequest, callback) {
	//	if (typeof reportRequest !== 'object') {
	//		throw new Error('Missing report request!');
	//	}
	//	if (typeof callback !== 'function') {
	//		throw new Error('Missing callback!');
	//	}
	//
	//	var self = this;
	//	function task(callback) {
	//		request({
	//			method: 'POST',
	//			url: baseUri + endpoints.reports+ 'recordings',
	//			headers: generateHeaders(self._token),
	//			json: reportRequest
	//		}, function requestCallback(err, response, body) {
	//			if (err) {
	//				return callback(err, body);
	//			}
	//			if (response.statusCode !== 200) {
	//				return callback('Received status: ' + response.statusCode, body);
	//			}
	//			callback(null, body.reportId);
	//		});
	//	}
	//
	//	retryHelper.retry(task, function retryCallback(err, body) {
	//		if (err) {
	//			return callback(err, body);
	//		}
	//		callback(null, body);
	//	});
	//};
	//
	//getRecordingsReport: function getRecordingsReport(reportId, contentType, callback) {
	//	if (typeof reportId !== 'string' || reportId === '') {
	//		throw new Error('Missing reportId!');
	//	}
	//	if (typeof contentType === 'function' && !callback) {
	//		callback = contentType;
	//		contentType = 'application/json';
	//	}
	//	if (typeof callback !== 'function') {
	//		throw new Error('Missing callback!');
	//	}
	//
	//	var headers = generateHeaders(this._token);
	//	headers.Accept = contentType;
	//
	//	var self = this;
	//	function task(callback) {
	//		request({
	//			method: 'GET',
	//			url: baseUri + endpoints.reports+ 'recordings/' + reportId,
	//			headers: headers,
	//			json: (contentType === 'application/json')
	//		}, function requestCallback(err, response, body) {
	//			if (err) {
	//				return callback(err, body);
	//			}
	//			if (response.statusCode === 420) {
	//				// report isn't ready
	//				return callback();
	//			}
	//			if (response.statusCode !== 200) {
	//				return callback('Received status: ' + response.statusCode, body);
	//			}
	//			callback(null, body);
	//		});
	//	}
	//
	//	retryHelper.retry(task, function retryCallback(err, body) {
	//		if (err) {
	//			return callback(err, body);
	//		}
	//		callback(null, body);
	//	});
	//};
	//
	//listUsageReports: function listUsageReports(callback) {
	//	if (typeof reportId !== 'string' || reportId === '') {
	//		throw new Error('Missing reportId!');
	//	}
	//	if (typeof callback !== 'function') {
	//		throw new Error('Missing callback!');
	//	}
	//
	//	request({
	//		method: 'GET',
	//		url: baseUri + endpoints.reports+ 'usage',
	//		headers: generateHeaders(this._token),
	//		json: true
	//	}, function requestCallback(err, response, body) {
	//		if (err) {
	//			return callback(err, body);
	//		}
	//		if (response.statusCode !== 200) {
	//			return callback('Received status: ' + response.statusCode, body);
	//		}
	//		callback(null, body);
	//	});
	//};

	//getUsageReport: function getUsageReport(reportId, callback) {
	//	if (typeof reportId !== 'string' || reportId === '') {
	//		throw new Error('Missing reportId!');
	//	}
	//	if (typeof callback !== 'function') {
	//		throw new Error('Missing callback!');
	//	}
	//
	//	request({
	//		method: 'GET',
	//		url: baseUri + endpoints.reports+ 'usage/' + reportId,
	//		headers: generateHeaders(this._token),
	//		json: true
	//	}, function requestCallback(err, response, body) {
	//		if (err) {
	//			return callback(err, body);
	//		}
	//		if (response.statusCode !== 200) {
	//			return callback('Received status: ' + response.statusCode, body);
	//		}
	//		callback(null, body);
	//	});
	//};

	batch: function batch(requests, callback) {
		//validateBatch(requests);
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var self = this;

		function task(callback) {
			request(
				{
					method: 'POST',
					url: baseUri + endpoints.batch,
					headers: generateHeaders(self._token),
					json: requests
				},
				function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null, body);
				}
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	getTaskSummaryByRecording: function getRecordings(options, callback) {
		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		} else if (typeof options === 'string') {
			options = {
				recordingId: options
			};
		} else if (typeof options !== 'object') {
			throw new Error('Missing options!');
		}
		if (typeof options.recordingId === 'number') {
			options.recordingId = options.recordingId + '';
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var uri = baseUri + endpoints.tasksByRecording;
		if (options.keys.length > 0) {
			uri += '?';
		}

		Object.keys(options).forEach(function forEachKey(key) {
			uri += key + '=' + options[key];
		});

		var self = this;

		function task(callback) {
			request(
				{
					method: 'GET',
					uri: uri,
					headers: generateHeaders(self._token),
					json: true
				},
				function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null, body);
				}
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	/** SaaS functions ************************************************************************************************/

	createDropboxWatcher: function createDropboxWatcher(watcher, callback) {
		this._retryRequest('POST', endpoints.dropboxWatcher, watcher, callback);
	},

	getDropboxWatchers: function getDropboxWatchers(options, callback) {
		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		} else if (typeof options === 'string') {
			options = {
				watcherId: options
			};
		} else if (typeof options !== 'object') {
			throw new Error('Missing options!');
		}
		this._retryRequest('GET', endpoints.dropboxWatcher, options, callback);
	},

	getDropboxWatcher: function getDropboxWatcher(watcherId, callback) {
		if (typeof watcherId !== 'string' || watcherId === '') {
			throw new Error('Missing watcherId!');
		}
		this._retryRequest(
			'GET',
			endpoints.dropboxWatcher + watcherId,
			null,
			callback
		);
	},

	updateDropboxWatcher: function updateDropboxWatcher(watcher, callback) {
		if (typeof watcher !== 'object') {
			throw new Error('Missing watcher!');
		}
		this._retryRequest(
			'PUT',
			endpoints.dropboxWatcher + watcher.watcherId,
			watcher,
			callback
		);
	},

	deleteDropboxWatcher: function deleteDropboxWatcher(watcherId, callback) {
		if (typeof watcherId !== 'string' || watcherId === '') {
			throw new Error('Missing watcherId!');
		}
		this._retryRequest(
			'DELETE',
			endpoints.dropboxWatcher + watcherId,
			null,
			callback
		);
	},

	queryFaceset: function queryFaceset(q, callback) {
		if (typeof q !== 'string' || q === '') {
			throw new Error('Missing query!');
		}
		this._retryRequest(
			'GET',
			endpoints.faceset + 'autocomplete/' + encodeURIComponent(q),
			null,
			callback
		);
	},

	createFaceset: function createFaceset(faceset, callback) {
		if (typeof faceset !== 'object') {
			throw new Error('Missing faceset!');
		}
		if (typeof faceset.faceSetId !== 'string') {
			throw new Error('Missing faceSetId!');
		}
		this._retryRequest(
			'POST',
			endpoints.faceset + encodeURIComponent(faceset.faceSetId),
			faceset,
			callback
		);
	},

	updateFaceset: function updateFaceset(faceset, callback) {
		if (typeof faceset !== 'object') {
			throw new Error('Missing faceset!');
		}
		if (typeof faceset.faceSetId !== 'string') {
			throw new Error('Missing faceSetId!');
		}
		this._retryRequest(
			'PUT',
			endpoints.faceset + encodeURIComponent(faceset.faceSetId),
			faceset,
			callback
		);
	},

	_retryRequest: function _retryRequest(method, path, params, callback) {
		if (typeof callback !== 'function') {
			throw new Error('callback must be a function.');
		} else if (typeof params !== 'object') {
			throw new Error('params must be an object.');
		}

		var cfg = {
			method: method,
			uri: baseUri + path,
			headers: generateHeaders(this._token)
		};

		if (method === 'GET' || method === 'DELETE') {
			if (params) {
				cfg.qs = params;
			}
			cfg.json = true;
		} else if (method === 'POST' || method === 'PUT') {
			cfg.json = params;
		} else {
			throw new Error('Unsupported HTTP method: ' + method);
		}

		function getRequestCallbackHandler(retryCallback) {
			return function requestCallback(err, response, body) {
				if (err) {
					retryCallback(err, body);
				} else if (response.statusCode === 200 || response.statusCode === 204) {
					retryCallback(null, body);
				} else {
					retryCallback('Received status: ' + response.statusCode, body);
				}
			};
		}

		function retryFinalCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		}

		this._retryHelper.retry(function task(retryCallback) {
			request(cfg, getRequestCallbackHandler(retryCallback));
		}, retryFinalCallback);
	},

	searchMentions: function searchMentions(options, callback) {
		this._retryRequest('POST', endpoints.mention + 'search', options, callback);
	},

	getMentions: function getMention(mentionId, filter, callback) {
		this._retryRequest('GET', endpoints.mention + mentionId, filter, callback);
	},

	updateMentionSelectively: function updateMentionSelectively(
		mentionId,
		mention,
		callback
	) {
		this._retryRequest('PUT', endpoints.mention + mentionId, mention, callback);
	},

	createMentionComment: function createMentionComment(
		mentionId,
		comment,
		callback
	) {
		this._retryRequest(
			'POST',
			endpoints.mention + mentionId + '/comment',
			comment,
			callback
		);
	},

	updateMentionComment: function updateMentionComment(
		mentionId,
		commentId,
		comment,
		callback
	) {
		this._retryRequest(
			'PUT',
			endpoints.mention + mentionId + '/comment/' + commentId,
			comment,
			callback
		);
	},

	deleteMentionComment: function deleteMentionComment(
		mentionId,
		commentId,
		comment,
		callback
	) {
		this._retryRequest(
			'DELETE',
			endpoints.mention + mentionId + '/comment/' + commentId,
			comment,
			callback
		);
	},

	createMentionRating: function createMentionRating(
		mentionId,
		rating,
		callback
	) {
		this._retryRequest(
			'POST',
			endpoints.mention + mentionId + '/rating',
			rating,
			callback
		);
	},

	updateMentionRating: function updateMentionRating(
		mentionId,
		ratingId,
		rating,
		callback
	) {
		this._retryRequest(
			'PUT',
			endpoints.mention + mentionId + '/comment/' + ratingId,
			rating,
			callback
		);
	},

	deleteMentionRating: function deleteMentionRating(
		mentionId,
		ratingId,
		rating,
		callback
	) {
		this._retryRequest(
			'DELETE',
			endpoints.mention + mentionId + '/comment/' + ratingId,
			rating,
			callback
		);
	},

	createWidget: function createWidget(collectionId, widget, callback) {
		this._retryRequest(
			'POST',
			path.join(endpoints.collection, collectionId, 'widget'),
			widget,
			callback
		);
	},

	getWidgets: function getWidgets(collectionId, options, callback) {
		if (typeof collectionId !== 'string' || collectionId === '') {
			throw new Error('Missing collectionId');
		}

		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		}

		this._retryRequest(
			'GET',
			path.join(endpoints.collection, collectionId, 'widget'),
			options,
			callback
		);
	},

	getWidget: function getWidget(widgetId, options, callback) {
		if (typeof widgetId !== 'string' || widgetId === '') {
			throw new Error('Missing widgetId');
		}

		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		}

		this._retryRequest(
			'GET',
			path.join(endpoints.widget, widgetId),
			options,
			callback
		);
	},

	updateWidget: function updateWidget(widget, callback) {
		this._retryRequest('PUT', endpoints.widget, widget, callback);
	},

	getRootTreeFolder: function getRootTreeFolder(
		organizationId,
		userId,
		rootFolderType,
		options,
		callback
	) {
		if (typeof organizationId !== 'string' || organizationId === '') {
			throw new Error('Missing organizationId');
		}
		if (typeof userId !== 'string' || userId === '') {
			throw new Error('Missing userId');
		}
		if (typeof rootFolderType !== 'string' || rootFolderType === '') {
			throw new Error('Missing rootFolderType');
		}
		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		}
		var rootFolderPath =
			endpoints.collectionFolders +
			organizationId +
			'/' +
			userId +
			'/type/' +
			rootFolderType;
		this._retryRequest('GET', rootFolderPath, options, callback);
	},
	getTreeObject: function getTreeObject(treeObjectId, options, callback) {
		if (typeof treeObjectId !== 'string' || treeObjectId === '') {
			throw new Error('Missing organizationId');
		}
		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		}
		var treeObjectPath = endpoints.collectionFolders + treeObjectId;
		this._retryRequest('GET', treeObjectPath, options, callback);
	},
	createTreeFolder: function createTreeFolder(treeFolder, callback) {
		if (typeof treeFolder !== 'object') {
			throw new Error('Missing tree folder!');
		}
		this._retryRequest(
			'POST',
			endpoints.collectionFolders,
			treeFolder,
			callback
		);
	},
	createTreeObject: function createTreeObject(treeObject, callback) {
		if (typeof treeObject !== 'object') {
			throw new Error('Missing tree object!');
		}
		this._retryRequest(
			'POST',
			endpoints.collectionFolders + 'object/',
			treeObject,
			callback
		);
	},
	moveTreeFolder: function moveTreeFolder(
		treeObjectId,
		treeFolderMoveObj,
		callback
	) {
		if (typeof treeObjectId !== 'string') {
			throw new Error('Missing tree object id!');
		}
		if (typeof treeFolderMoveObj !== 'object') {
			throw new Error('Missing tree folder move information!');
		}
		this._retryRequest(
			'PUT',
			endpoints.collectionFolders + 'move/' + treeObjectId,
			treeFolderMoveObj,
			callback
		);
	},
	updateTreeFolder: function updateTreeFolder(
		treeObjectId,
		treeFolderObj,
		callback
	) {
		if (typeof treeObjectId !== 'string') {
			throw new Error('Missing tree object id!');
		}
		if (typeof treeFolderObj !== 'object') {
			throw new Error('Missing tree folder information!');
		}
		this._retryRequest(
			'PUT',
			endpoints.collectionFolders + treeObjectId,
			treeFolderObj,
			callback
		);
	},
	deleteTreeFolder: function deleteTreeFolder(treeObjectId, options, callback) {
		if (typeof treeObjectId !== 'string') {
			throw new Error('Missing tree folder!');
		}
		console.log('\n\n\n\n\n\n\nthings:');
		console.log(JSON.stringify(options));
		this._retryRequest(
			'DELETE',
			endpoints.collectionFolders + treeObjectId,
			options,
			callback
		);
	},
	deleteTreeObject: function deleteTreeObject(treeObjectId, options, callback) {
		if (typeof treeObjectId !== 'string') {
			throw new Error('Missing tree folder!');
		}
		this._retryRequest(
			'DELETE',
			endpoints.collectionFolders + 'object/' + treeObjectId,
			options,
			callback
		);
	},
	searchTreeFolder: function searchTreeFolder(queryTerms, callback) {
		if (typeof queryTerms !== 'object') {
			throw new Error('Missing query terms!');
		}
		this._retryRequest(
			'POST',
			endpoints.collectionFolders + 'search/',
			queryTerms,
			callback
		);
	},
	folderSummary: function folderSummary(queryTerms, callback) {
		if (typeof queryTerms !== 'object') {
			throw new Error('Missing folder summary terms!');
		}
		this._retryRequest(
			'POST',
			endpoints.collectionFolders + 'summary/',
			queryTerms,
			callback
		);
	},
	createCollection: function createCollection(collection, callback) {
		this._retryRequest('POST', endpoints.collection, collection, callback);
	},

	getCollections: function getCollections(options, callback) {
		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		}

		this._retryRequest('GET', endpoints.collection, options, callback);
	},

	// getCollections: function getCollections(options, callback) {
	// 	if (typeof options === 'function' && !callback) {
	// 		callback = options;
	// 		options = {};
	// 	}
	// 	this._retryRequest('GET', endpoints.collection, options, callback);
	// },
	getCollection: function getCollection(collectionId, options, callback) {
		if (typeof collectionId !== 'string' || collectionId === '') {
			throw new Error('Missing collectionId');
		}
		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		}

		this._retryRequest(
			'GET',
			endpoints.collection + collectionId,
			options,
			callback
		);
	},

	updateCollection: function updateCollection(collectionId, patch, callback) {
		if (typeof collectionId !== 'string' || collectionId === '') {
			throw new Error('Missing collectionId');
		}

		this._retryRequest(
			'PUT',
			endpoints.collection + collectionId,
			patch,
			callback
		);
	},

	deleteCollection: function deleteCollection(collectionId, options, callback) {
		var ids = Array.isArray(collectionId)
			? collectionId.join(',')
			: collectionId;

		if (typeof ids !== 'string' || ids === '') {
			throw new Error('Missing collectionId');
		}

		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		}
		options.collectionId = ids;

		this._retryRequest('DELETE', endpoints.collection, options, callback);
	},

	shareCollection: function shareCollection(collectionId, share, callback) {
		if (typeof collectionId !== 'string' || collectionId === '') {
			throw new Error('Missing collecitonId');
		}

		var url = endpoints.collection + collectionId + '/share';
		this._retryRequest('POST', url, share, callback);
	},

	shareMentionFromCollection: function shareMentionFromCollection(
		collectionId,
		mentionId,
		share,
		callback
	) {
		if (typeof collectionId !== 'string' || collectionId === '') {
			throw new Error('Missing collectionId');
		}

		if (typeof mentionId !== 'string' || mentionId === '') {
			throw new Error('Missing mentionId');
		}

		var url =
			endpoints.collection + collectionId + '/mention/' + mentionId + '/share';
		this._retryRequest('POST', url, share, callback);
	},

	getShare: function getShare(shareId, options, callback) {
		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		}

		if (typeof shareId !== 'string' || shareId === '') {
			throw new Error('Missing shareId');
		}

		this._retryRequest(
			'GET',
			path.join(endpoints.collection, 'share/', shareId),
			options,
			callback
		);
	},

	deleteCollectionMention: function deleteCollectionMention(
		collectionId,
		mentionId,
		options,
		callback
	) {
		if (typeof collectionId !== 'string' || collectionId === '') {
			throw new Error('Missing collectionId');
		}

		if (typeof mentionId !== 'string' || mentionId === '') {
			throw new Error('Missing mentionId');
		}

		this._retryRequest(
			'DELETE',
			endpoints.collection + collectionId + '/mention/' + mentionId,
			options,
			callback
		);
	},

	getMetricsForAllCollections: function getMetricsForAllCollections(
		options,
		callback
	) {
		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		}

		this._retryRequest('GET', endpoints.metrics, options, callback);
	},

	createIngestion: function createIngestion(ingestion, callback) {
		this._retryRequest('POST', endpoints.ingestion, ingestion, callback);
	},

	getIngestions: function getIngestions(options, callback) {
		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		}
		this._retryRequest('GET', endpoints.ingestion, options, callback);
	},

	getIngestion: function getIngestion(ingestionId, options, callback) {
		if (typeof ingestionId !== 'string' || ingestionId === '') {
			throw new Error('Missing ingestionId');
		}
		if (typeof options === 'function' && !callback) {
			callback = options;
			options = {};
		}

		this._retryRequest(
			'GET',
			endpoints.ingestion + ingestionId,
			options,
			callback
		);
	},

	updateIngestion: function updateIngestion(ingestionId, patch, callback) {
		if (typeof ingestionId !== 'string' || ingestionId === '') {
			throw new Error('Missing ingestionId');
		}

		this._retryRequest(
			'PUT',
			endpoints.ingestion + ingestionId,
			patch,
			callback
		);
	},

	deleteIngestion: function deleteIngestion(ingestionId, options, callback) {
		if (typeof ingestionId !== 'string' || ingestionId === '') {
			throw new Error('Missing ingestionId');
		}

		this._retryRequest(
			'DELETE',
			endpoints.ingestion + ingestionId,
			options,
			callback
		);
	},

	ingestionConnect: function ingestionConnect(connectOptions, callback) {
		if (typeof connectOptions === 'undefined') {
			throw new Error('Missing Connect Options');
		}
		this._retryRequest(
			'POST',
			endpoints.ingestion + 'connect',
			connectOptions,
			callback
		);
	},

	verifyEmailIngestion: function verifyEmailIngestion(emailOptions, callback) {
		if (
			typeof emailOptions === 'undefined' ||
			(typeof emailOptions === 'object' && !emailOptions.emailAddress)
		) {
			throw new Error('Missing email address');
		}
		this._retryRequest(
			'POST',
			endpoints.ingestion + 'verifyEmailIngestion',
			emailOptions,
			callback
		);
	}
};

// createApplication: function createApplication(application, callback) {
// 	validateApplication(application);
// 	if (typeof callback !== 'function') {
// 		throw new Error('Missing callback!');
// 	}
//
// 	request({
// 		method: 'POST',
// 		url: baseUri + endpoints.application,
// 		headers: generateHeaders(this._token),
// 		json: application
// 	}, function requestCallback(err, response, body) {
// 		if (err) {
// 			return callback(err, body);
// 		}
// 		if (response.statusCode !== 200) {
// 			return callback('Received status: ' + response.statusCode, body);
// 		}
// 		callback(null, body);
// 	});
// };
//
// getApplication: function getApplication(callback) {
// 	if (typeof callback !== 'function') {
// 		throw new Error('Missing callback!');
// 	}
//
// 	request({
// 		method: 'GET',
// 		url: baseUri + endpoints.application,
// 		headers: generateHeaders(this._token),
// 		json: true
// 	}, function requestCallback(err, response, body) {
// 		if (err) {
// 			return callback(err, body);
// 		}
// 		if (response.statusCode !== 200) {
// 			return callback('Received status: ' + response.statusCode, body);
// 		}
// 		callback(null, body);
// 	});
// };
//
// updateApplication: function updateApplication(application, callback) {
// 	validateApplication(application);
// 	if (typeof callback !== 'function') {
// 		throw new Error('Missing callback!');
// 	}
//
// 	request({
// 		method: 'PUT',
// 		url: baseUri + endpoints.application,
// 		headers: generateHeaders(this._token),
// 		json: application
// 	}, function requestCallback(err, response, body) {
// 		if (err) {
// 			return callback(err, body);
// 		}
// 		if (response.statusCode !== 200) {
// 			return callback('Received status: ' + response.statusCode, body);
// 		}
// 		callback(null, body);
// 	});
// };
