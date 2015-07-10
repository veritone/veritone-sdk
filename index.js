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
	this._version = options.version || 1;
	if (typeof this._version === 'number') {
		this._baseUri = this._baseUri + '/v' + this._version;
	} else {
		this._baseUri = this._baseUri + '/' + this._version;
	}
}

var request = require('request'),
	validatejs = require('validate.js'),
	fs = require('fs');

var applicationEndpoint = '/application/',
	recordingEndpoint = '/recording/',
	jobEndpoint = '/job/',
	searchEndpoint = '/search',
	reportsEndpoint = '/report/',
	batchEndpoint = '/batch',
	metadataHeader = 'X-Veritone-Metadata',
	applicationIdHeader = 'X-Veritone-Application-Id';

function generateHeaders(token) {
	var headers = {};
	headers.Authorization = 'Bearer ' + token;
	return headers;
}

//function validateApplication(application) {
//	if (typeof application !== 'object') {
//		throw 'Missing application!';
//	}
//	var validation = {
//		applicationName: {
//			presence: true
//		},
//		contact: {
//			presence: true
//		},
//		'contact.name': {
//			presence: true
//		},
//		'contact.emailAddress': {
//			presence: true,
//			email: true
//		}
//	};
//	var validationErrors = validatejs(application, validation);
//	if (validationErrors) {
//		throw 'Invalid application object!';
//	}
//}
//
//ApiClient.prototype.createApplication = function createApplication(application, callback) {
//	validateApplication(application);
//	if (typeof callback !== 'function') {
//		throw 'Missing callback!';
//	}
//
//	request({
//		method: 'POST',
//		url: this._baseUri + applicationEndpoint,
//		headers: generateHeaders(this._token),
//		json: application
//	}, function(err, response, body) {
//		if (err) {
//			return callback(err);
//		}
//		if (response.statusCode !== 200) {
//			return callback('Received status: ' + response.statusCode, body);
//		}
//		callback(null, body);
//	});
//};
//
//ApiClient.prototype.getApplication = function getApplication(callback) {
//	if (typeof callback !== 'function') {
//		throw 'Missing callback!';
//	}
//
//	request({
//		method: 'GET',
//		url: this._baseUri + applicationEndpoint,
//		headers: generateHeaders(this._token),
//		json: true
//	}, function(err, response, body) {
//		if (err) {
//			return callback(err);
//		}
//		if (response.statusCode !== 200) {
//			return callback('Received status: ' + response.statusCode, body);
//		}
//		callback(null, body);
//	});
//};
//
//ApiClient.prototype.updateApplication = function updateApplication(application, callback) {
//	validateApplication(application);
//	if (typeof callback !== 'function') {
//		throw 'Missing callback!';
//	}
//
//	request({
//		method: 'PUT',
//		url: this._baseUri + applicationEndpoint,
//		headers: generateHeaders(this._token),
//		json: application
//	}, function(err, response, body) {
//		if (err) {
//			return callback(err);
//		}
//		if (response.statusCode !== 200) {
//			return callback('Received status: ' + response.statusCode, body);
//		}
//		callback(null, body);
//	});
//};

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

	request({
		method: 'POST',
		url: this._baseUri + applicationEndpoint + 'token/',
		headers: generateHeaders(this._token),
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

	request({
		method: 'DELETE',
		url: this._baseUri + applicationEndpoint + 'token/' + token,
		headers: generateHeaders(this._token),
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
		throw 'Invalid recording object: ' + JSON.stringify(validationErrors);
	}
}

ApiClient.prototype.createRecording = function createRecording(recording, callback) {
	validateRecording(recording);
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	request({
		method: 'POST',
		url: this._baseUri + recordingEndpoint,
		headers: generateHeaders(this._token),
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

	request({
		method: 'GET',
		uri: this._baseUri + recordingEndpoint,
		headers: generateHeaders(this._token),
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

	request({
		method: 'GET',
		uri: this._baseUri + recordingEndpoint + recordingId,
		headers: generateHeaders(this._token),
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

	request({
		method: 'PUT',
		url: this._baseUri + recordingEndpoint + recording.recordingId,
		headers: generateHeaders(this._token),
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

//ApiClient.prototype.deleteRecording = function deleteRecording(recordingId, callback) {
//	if (typeof recordingId !== 'string' || recordingId === '') {
//		throw 'Missing recordingId!';
//	}
//	if (typeof callback !== 'function') {
//		throw 'Missing callback!';
//	}
//
//	request({
//		method: 'DELETE',
//		url: this._baseUri + recordingEndpoint + recordingId,
//		headers: generateHeaders(this._token)
//	}, function (err, response, body) {
//		if (err) {
//			return callback(err);
//		}
//		if (response.statusCode !== 204) {
//			return callback('Received status: ' + response.statusCode, body);
//		}
//		callback(null, body);
//	});
//};

ApiClient.prototype.getRecordingTranscript = function getRecordingTranscript(recordingId, callback) {
	if (typeof recordingId !== 'string') {
		throw 'Missing recordingId!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	request({
		method: 'GET',
		uri: this._baseUri + recordingEndpoint + recordingId + '/transcript',
		headers: generateHeaders(this._token),
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

ApiClient.prototype.getRecordingMedia = function getRecordingMedia(recordingId, callback) {
	if (typeof recordingId !== 'string') {
		throw 'Missing recordingId!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var req = request({
		method: 'GET',
		uri: this._baseUri + recordingEndpoint + recordingId + '/media',
		headers: generateHeaders(this._token)
	}).on('error', function (err) {
		callback(err);
	}).on('response', function(response) {
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode);
		}
		var metadata = response.headers[metadataHeader.toLowerCase()];
		callback(null, {
			contentType: response.headers['content-type'],
			metadata: (metadata ? JSON.parse(metadata) : undefined),
			stream: req
		});
	});
};

ApiClient.prototype.getRecordingAssets = function getRecordingAssets(recordingId, callback) {
	if (typeof recordingId !== 'string') {
		throw 'Missing recordingId!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	request({
		method: 'GET',
		uri: this._baseUri + recordingEndpoint + recordingId + '/asset/',
		headers: generateHeaders(this._token),
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

	var req = request({
		method: 'GET',
		uri: this._baseUri + recordingEndpoint + recordingId + '/asset/' + assetId,
		headers: generateHeaders(this._token)
	}).on('error', function (err) {
		callback(err);
	}).on('response', function(response) {
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode);
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

	var headers = generateHeaders(this._token);
	headers['X-Veritone-Asset-Type'] = asset.assetType;
	headers['Content-Type'] = asset.contentType;

	var opts = {
		method: 'POST',
		uri: this._baseUri + recordingEndpoint + recordingId + '/asset/',
		headers: headers,
		json: true
	};
	if (asset.metadata) {
		opts.headers[metadataHeader] = JSON.stringify(asset.metadata);
	}
	if (asset.applicationId) {
		opts.headers[applicationIdHeader] = asset.applicationId;
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

	var opts = {
		method: 'PUT',
		uri: this._baseUri + recordingEndpoint + recordingId + '/asset/' + asset.assetId,
		headers: generateHeaders(this._token),
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

//ApiClient.prototype.deleteAsset = function deleteAsset(recordingId, assetId, callback) {
//	if (typeof recordingId !== 'string' || recordingId === '') {
//		throw 'Missing recordingId!';
//	}
//	if (typeof assetId !== 'string' || assetId === '') {
//		throw 'Missing assetId!';
//	}
//	if (typeof callback !== 'function') {
//		throw 'Missing callback!';
//	}
//
//	request({
//		method: 'DELETE',
//		url: this._baseUri + recordingEndpoint + recordingId + '/asset/' + assetId,
//		headers: generateHeaders(this._token)
//	}, function (err, response, body) {
//		if (err) {
//			return callback(err);
//		}
//		if (response.statusCode !== 204) {
//			return callback('Received status: ' + response.statusCode, body);
//		}
//		callback(null, body);
//	});
//};

ApiClient.prototype.createJob = function createJob(job, callback) {
	if (typeof job !== 'object') {
		throw 'Missing job!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
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

	request({
		method: 'POST',
		url: this._baseUri + jobEndpoint,
		headers: generateHeaders(this._token),
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

	request({
		method: 'GET',
		url: this._baseUri + jobEndpoint,
		headers: generateHeaders(this._token),
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

ApiClient.prototype.getJob = function getJob(jobId, callback) {
	if (typeof jobId !== 'string') {
		throw 'Missing jobId!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	request({
		method: 'GET',
		url: this._baseUri + jobEndpoint + jobId,
		headers: generateHeaders(this._token),
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

//ApiClient.prototype.cancelJob = function cancelJob(jobId, callback) {
//	if (typeof jobId !== 'string') {
//		throw 'Missing jobId!';
//	}
//	if (typeof callback !== 'function') {
//		throw 'Missing callback!';
//	}
//	
//	request({
//		method: 'DELETE',
//		url: this._baseUri + jobEndpoint + jobId,
//		headers: generateHeaders(this._token),
//		json: true
//	}, function(err, response, body) {
//		if (err) {
//			return callback(err);
//		}
//		if (response.statusCode !== 204) {
//			return callback('Received status: ' + response.statusCode, body);
//		}
//		callback(null, body);
//	});
//};

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

	request({
		method: 'PUT',
		url: this._baseUri + jobEndpoint + jobId + '/task/' + taskId,
		headers: generateHeaders(this._token),
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
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	request({
		method: 'POST',
		url: this._baseUri + searchEndpoint,
		headers: generateHeaders(this._token),
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

ApiClient.prototype.generateRecordingsReport = function generateRecordingsReport(reportRequest, callback) {
	if (typeof reportRequest !== 'object') {
		throw 'Missing report request!';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	request({
		method: 'POST',
		url: this._baseUri + reportsEndpoint + 'recordings',
		headers: generateHeaders(this._token),
		json: reportRequest
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

ApiClient.prototype.getRecordingsReport = function getRecordingsReport(reportId, contentType, callback) {
	if (typeof reportId !== 'string') {
		throw 'Missing reportId!';
	}
	if (typeof contentType === 'function' && !callback) {
		callback = contentType;
		contentType = 'application/json';
	}
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	var headers = generateHeaders(this._token);
	headers.Accept = contentType;

	request({
		method: 'GET',
		url: this._baseUri + reportsEndpoint + 'recordings/' + reportId,
		headers: headers,
		json: (contentType === 'application/json')
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

//ApiClient.prototype.listUsageReports = function listUsageReports(callback) {
//	if (typeof reportId !== 'string') {
//		throw 'Missing reportId!';
//	}
//	if (typeof callback !== 'function') {
//		throw 'Missing callback!';
//	}
//
//	request({
//		method: 'GET',
//		url: this._baseUri + reportsEndpoint + 'usage',
//		headers: generateHeaders(this._token),
//		json: true
//	}, function(err, response, body) {
//		if (err) {
//			return callback(err);
//		}
//		if (response.statusCode !== 200) {
//			return callback('Received status: ' + response.statusCode, body);
//		}
//		callback(null, body);
//	});
//};

//ApiClient.prototype.getUsageReport = function getUsageReport(reportId, callback) {
//	if (typeof reportId !== 'string') {
//		throw 'Missing reportId!';
//	}
//	if (typeof callback !== 'function') {
//		throw 'Missing callback!';
//	}
//
//	request({
//		method: 'GET',
//		url: this._baseUri + reportsEndpoint + 'usage/' + reportId,
//		headers: generateHeaders(this._token),
//		json: true
//	}, function(err, response, body) {
//		if (err) {
//			return callback(err);
//		}
//		if (response.statusCode !== 200) {
//			return callback('Received status: ' + response.statusCode, body);
//		}
//		callback(null, body);
//	});
//};

ApiClient.prototype.batch = function batch(requests, callback) {
	//validateBatch(requests);
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}

	request({
		method: 'POST',
		url: this._baseUri + batchEndpoint,
		headers: generateHeaders(this._token),
		json: requests
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

module.exports = ApiClient;
