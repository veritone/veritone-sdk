import request from 'request';
import path from 'path';

import RetryHelper from './helper/RetryHelper';
import { endpoints } from './config';

const retryHelper = new RetryHelper();
const baseUri = 'http://fake.domain';

function generateHeaders() {
	return {};
}

export default {

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

	/** SaaS functions ************************************************************************************************/


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

		retryHelper.retry(function task(retryCallback) {
			request(cfg, getRequestCallbackHandler(retryCallback));
		}, retryFinalCallback);
	},



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
