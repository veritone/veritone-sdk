
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
	fs = require('fs'),
	path = require('path');

var applicationEndpoint = '/api/application ',
	recordingEndpoint = '/api/recording ',
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
	request({
		method: 'POST',
		url: this._baseUri + applicationEndpoint,
		headers: {
			tokenHeader: this._token
		},
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
	request({
		method: 'GET',
		url: this._baseUri + applicationEndpoint,
		headers: {
			tokenHeader: this._token
		},
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
	request({
		method: 'PUT',
		url: this._baseUri + applicationEndpoint,
		headers: {
			tokenHeader: this._token
		},
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
	request({
		method: 'POST',
		url: this._baseUri + '/api/application/token/',
		headers: {
			tokenHeader: this._token
		},
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
		url: this._baseUri + '/api/application/token/' + token,
		headers: {
			tokenHeader: this._token
		},
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
			onlyInteger: true
		},
		stopDateTime: {
			presence: true,
			onlyInteger: true,
			greaterThan: recording.startDateTime
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
	request({
		method: 'POST',
		url: this._baseUri + recordingEndpoint,
		headers: {
			tokenHeader: this._token
		},
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
		headers: {
			tokenHeader: this._token
		},
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
		headers: {
			tokenHeader: this._token
		},
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
		headers: {
			tokenHeader: this._token
		},
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
	request({
		method: 'DELETE',
		url: this._baseUri + recordingEndpoint + recordingId,
		headers: {
			tokenHeader: this._token
		}
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
	request({
		method: 'GET',
		uri: this._baseUri + recordingEndpoint + recordingId + '/asset/',
		headers: {
			tokenHeader: this._token
		},
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
		headers: {
			tokenHeader: this._token
		}
	}, function (err, response, body) {
		if (err) {
			return callback(err);
		}
		if (response.statusCode !== 200) {
			return callback('Received status: ' + response.statusCode, body);
		}
		var metadata = response.headers[metadataHeader];
		callback(null, {
			contentType: response.headers['Content-Type'],
			metadata: (metadata ? JSON.parse(metadata) : undefined),
			stream: req
		});
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
	var opts = {
		method: 'POST',
		uri: this._baseUri + recordingEndpoint + recordingId + '/asset/',
		headers: {
			tokenHeader: this._token,
			'X-Veritone-Asset-Type': asset.assetType,
			'Content-Type': asset.contentType
		},
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
	var opts = {
		method: 'PUT',
		uri: this._baseUri + recordingEndpoint + recordingId + '/asset/' + asset.assetId,
		headers: {
			tokenHeader: this._token
		},
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
	// other validation
	if (typeof callback !== 'function') {
		throw 'Missing callback!';
	}
	throw 'Not implemented!';
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
	throw 'Not implemented!';
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
	throw 'Not implemented!';
};

