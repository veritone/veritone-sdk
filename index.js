'use strict';

function ApiClient(options) {
	if (typeof options === 'string') {
		options = {
			token: options
		};
	}
	if (!options.token) {
		throw 'Missing token!';
	}
	this._token = options.token;
	this._baseUri = options.baseUri || 'https://api.veritone.com';
}

var request = require('request'),
	validatejs = require('validate.js'),
	fs = require('fs');

var applicationEndpoint = '/api/application/',
	recordingEndpoint = '/api/recording/',
	jobEndpoint = '/api/job/',
	searchEndpoint = '/api/search',
	reportsEndpoint = '/api/report/',
	tokenHeader = 'X-Veritone-Application',
	metadataHeader = 'X-Veritone-Metadata';

function validateApplication(application) {
	if (typeof application !== 'object') {
		throw 'Missing application!';
	}
	var validation = {
		applicationName: {
			presence: true
		},
		contact: {
			presence: true
		},
		'contact.name': {
			presence: true
		},
		'contact.emailAddress': {
			presence: true,
			email: true
		}
	};
	var validationErrors = validatejs(application, validation);
	if (validationErrors) {
		throw 'Invalid application object!';
	}
}

ApiClient.prototype.createApplication = function createApplication(application, callback) {
	validateApplication(application);
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	request({
		method: 'POST',
		url: this._baseUri + applicationEndpoint,
		headers: headers,
		json: application
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

ApiClient.prototype.getApplication = function getApplication(callback) {
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	request({
		method: 'GET',
		url: this._baseUri + applicationEndpoint,
		headers: headers,
		json: true
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

ApiClient.prototype.updateApplication = function updateApplication(application, callback) {
	validateApplication(application);
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	request({
		method: 'PUT',
		url: this._baseUri + applicationEndpoint,
		headers: headers,
		json: application
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

ApiClient.prototype.createToken = function createToken(label, rights, callback) {
	if (typeof label !== 'string') {
		throw 'Missing label!';
	}
	if (!rights || !rights.length) {
		throw 'Missing rights!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	request({
		method: 'POST',
		url: this._baseUri + '/api/application/token/',
		headers: headers,
		json: {
			tokenLabel: label,
			rights: rights
		}
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

ApiClient.prototype.revokeToken = function revokeToken(token, callback) {
	if (typeof token !== 'string') {
		throw 'Missing token!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	request({
		method: 'DELETE',
		url: this._baseUri + '/api/application/token/' + token,
		headers: headers,
		json: true
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200 && response.statusCode !== 204) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

function validateRecording(recording) {
	if (typeof recording !== 'object') {
		throw 'Missing recording!';
	}
	var validation = {
		startDateTime: {
			presence: true,
			numericality: {
				onlyInteger: true
			}
		},
		stopDateTime: {
			presence: true,
			numericality: {
				onlyInteger: true,
				greaterThan: recording.startDateTime
			}
		}
	};
	var validationErrors = validatejs(recording, validation);
	if (validationErrors) {
		throw 'Invalid recording object!';
	}
}

ApiClient.prototype.createRecording = function createRecording(recording, callback) {
	validateRecording(recording);
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	request({
		method: 'POST',
		url: this._baseUri + recordingEndpoint,
		headers: headers,
		json: recording
	}, function (err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

ApiClient.prototype.getRecordings = function getRecordings(callback) {
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	request({
		method: 'GET',
		uri: this._baseUri + recordingEndpoint,
		headers: headers,
		json: true
	}, function (err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

ApiClient.prototype.getRecording = function getRecording(recordingId, callback) {
	if (typeof recordingId !== 'string') {
		throw 'Missing recordingId!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	request({
		method: 'GET',
		uri: this._baseUri + recordingEndpoint + recordingId,
		headers: headers,
		json: true
	}, function (err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

ApiClient.prototype.updateRecording = function updateRecording(recording, callback) {
	validateRecording(recording);
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	request({
		method: 'PUT',
		url: this._baseUri + recordingEndpoint + recording.recordingId,
		headers: headers,
		json: recording
	}, function (err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

ApiClient.prototype.deleteRecording = function deleteRecording(recordingId, callback) {
	if (typeof recordingId !== 'object') {
		throw 'Missing recordingId!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	request({
		method: 'DELETE',
		url: this._baseUri + recordingEndpoint + recordingId,
		headers: headers
	}, function (err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 204) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

ApiClient.prototype.getRecordingAssets = function getRecordingAssets(recordingId, callback) {
	if (typeof recordingId !== 'string') {
		throw 'Missing recordingId!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	request({
		method: 'GET',
		uri: this._baseUri + recordingEndpoint + recordingId + '/asset/',
		headers: headers,
		json: true
	}, function (err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

ApiClient.prototype.getAsset = function getAsset(recordingId, assetId, callback) {
	if (typeof recordingId !== 'string') {
		throw 'Missing recordingId!';
	}
	if (typeof assetId !== 'string') {
		throw 'Missing assetId!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	var req = request({
		method: 'GET',
		uri: this._baseUri + recordingEndpoint + recordingId + '/asset/' + assetId,
		headers: headers
	}).on('error', function (err) {
		callback(err);
	}).on('response', function(response) {
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		var metadata = response.headers[metadataHeader.toLowerCase()];
		callback(null, {
			contentType: response.headers['content-type'],
			metadata: (metadata ? JSON.parse(metadata) : undefined),
			stream: req
		});
	});
};

ApiClient.prototype.saveAssetToFile = function saveAssetToFile(recordingId, assetId, fileName, callback) {
	if (typeof recordingId !== 'string') {
		throw 'Missing recordingId!';
	}
	if (typeof assetId !== 'string') {
		throw 'Missing assetId!';
	}
	if (typeof fileName !== 'string') {
		throw 'Missing fileName!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	this.getAsset(recordingId, assetId, function(err, result) {
		if (err) {
			return callback(err);
		}
		result.stream.on('end', function() {
			callback(null, result);
		});
		result.stream.pipe(fs.createWriteStream(fileName));
	});
};

ApiClient.prototype.createAsset = function createAsset(recordingId, asset, callback) {
	if (typeof recordingId !== 'string') {
		throw 'Missing recordingId!';
	}
	if (typeof asset !== 'object') {
		throw 'Missing asset!';
	}
	if (typeof asset.fileName !== 'string') {
		throw 'Missing asset.fileName!';
	}
	if (typeof asset.assetType !== 'string') {
		throw 'Missing asset.assetType!';
	}
	if (typeof asset.contentType !== 'string') {
		throw 'Missing asset.contentType!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}
	if (!fs.existsSync(asset.fileName)) {
		throw 'File "' + asset.fileName + '" does not exist!';
	}

	var headers = {
		'X-Veritone-Asset-Type': asset.assetType,
		'Content-Type': asset.contentType
	};
	headers[tokenHeader] = this._token;

	var opts = {
		method: 'POST',
		uri: this._baseUri + recordingEndpoint + recordingId + '/asset/',
		headers: headers,
		json: true
	};
	if (asset.metadata) {
		opts.headers[metadataHeader] = JSON.stringify(asset.metadata);
	}
	fs.createReadStream(asset.fileName).pipe(
		request(opts, function (err, response, body) {
			if (err) {
				return callback(err);
			}
			if (response.statusCode !== 200) {
				return callback('Received status: ' + response.statusCode, body);
			}
			callback(null, body);
		})
	);
};

ApiClient.prototype.updateAsset = function updateAsset(recordingId, asset, callback) {
	if (typeof recordingId !== 'string') {
		throw 'Missing recordingId!';
	}
	if (typeof asset !== 'object') {
		throw 'Missing asset!';
	}
	if (asset.fileName && !asset.contentType) {
		throw 'Missing asset.contentType!';
	}
	if (asset.contentType && !asset.fileName) {
		throw 'Missing asset.fileName!';
	}
	if (!asset.contentType && !asset.fileName && !asset.metadata) {
		throw 'Nothing to do!';
	}
	if (!fs.existsSync(asset.fileName)) {
		throw 'File "' + asset.fileName + '" does not exist!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	var opts = {
		method: 'PUT',
		uri: this._baseUri + recordingEndpoint + recordingId + '/asset/' + asset.assetId,
		headers: headers,
		json: true
	};
	if (asset.fileName) {
		if (!fs.existsSync(asset.fileName)) {
			throw 'File "' + asset.fileName + '" does not exist!';
		}
		opts.headers['Content-Type'] = asset.contentType;
	}
	if (asset.metadata) {
		opts.headers[metadataHeader] = JSON.stringify(asset.metadata);
	}
	var req = request(opts, function (err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
	if (asset.fileName) {
		fs.createReadStream(asset.fileName).pipe(req);
	}
};

ApiClient.prototype.createJob = function createJob(job, callback) {
	if (typeof job !== 'object') {
		throw 'Missing job!';
	}
	var validation = {
		tasks: {
			presence: true
		}
	};
	var validationErrors = validatejs(job, validation);
	if (validationErrors) {
		throw 'Invalid job object!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	request({
		method: 'POST',
		url: this._baseUri + jobEndpoint,
		headers: headers,
		json: job
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

ApiClient.prototype.getJobs = function getJobs(callback) {
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}
	throw 'Not implemented!';
};

ApiClient.prototype.getJob = function getJob(jobId, callback) {
	if (typeof jobId !== 'string') {
		throw 'Missing jobId!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;

	request({
		method: 'GET',
		url: this._baseUri + jobEndpoint + jobId,
		headers: headers,
		json: true
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

ApiClient.prototype.cancelJob = function cancelJob(jobId, callback) {
	if (typeof jobId !== 'string') {
		throw 'Missing jobId!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}
	throw 'Not implemented!';
};

ApiClient.prototype.updateTask = function updateTask(jobId, taskId, result, callback) {
	if (typeof jobId !== 'string') {
		throw 'Missing jobId!';
	}
	if (typeof taskId !== 'string') {
		throw 'Missing taskId!';
	}
	if (typeof result !== 'object') {
		throw 'Missing result!';
	}
	if (typeof result.taskStatus !== 'string') {
		throw 'Missing result.taskStatus!';
	}
	if (result.taskStatus !== 'running' && result.taskStatus !== 'complete' && result.taskStatus !== 'failed') {
		throw 'Invalid task status: ' + result.taskStatus;
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;
	
	request({
		method: 'PUT',
		url: this._baseUri + jobEndpoint + jobId + '/task/' + taskId,
		headers: headers,
		json: result
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 204) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null);
	});
};

ApiClient.prototype.search = function search(searchRequest, callback) {
	if (typeof searchRequest !== 'object') {
		throw 'Missing search request!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;
	
	request({
		method: 'POST',
		url: this._baseUri + searchEndpoint,
		headers: headers,
		json: searchRequest
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};
/*
ApiClient.prototype.generateRecordingsReport = function generateRecordingsReport(reportRequest, callback) {
	if (typeof reportRequest !== 'object') {
		throw 'Missing report request!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;
	
	request({
		method: 'POST',
		url: this._baseUri + reportsEndpoint + 'recordings',
		headers: headers,
		json: searchRequest
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body.reportId);
	});
};

ApiClient.prototype.getRecordingsReport = function getRecordingsReport(reportId, callback) {
	if (typeof reportId !== 'string') {
		throw 'Missing reportId!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;
	
	request({
		method: 'GET',
		url: this._baseUri + reportsEndpoint + 'recordings/' + reportId,
		headers: headers,
		json: true
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode === 420) {
			// report isn't ready
			return callback();
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

ApiClient.prototype.listUsageReports = function listUsageReports(callback) {
	if (typeof reportId !== 'string') {
		throw 'Missing reportId!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;
	
	request({
		method: 'GET',
		url: this._baseUri + reportsEndpoint + 'usage',
		headers: headers,
		json: true
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};

ApiClient.prototype.getUsageReport = function getUsageReport(reportId, callback) {
	if (typeof reportId !== 'string') {
		throw 'Missing reportId!';
	}

	var headers = {};
	headers[tokenHeader] = this._token;
	
	request({
		method: 'GET',
		url: this._baseUri + reportsEndpoint + 'usage/' + reportId,
		headers: headers,
		json: true
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		callback(null, body);
	});
};
*/

module.exports = ApiClient;
