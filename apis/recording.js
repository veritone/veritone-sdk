import validate from './validations';
import { endpoints, headers } from './config';
const RetryHelper = require('./helper/RetryHelper');

const nonStandardHandlers = [
	'getRecordingMedia',
	'getAsset',
	'saveAssetToFile',
	'createAsset',
	'updateAsset'
];

// todo:
// const nodeOnlyHandlers = [
// 	'getRecordingMedia',
// 	'getAsset',
// 	'saveAssetToFile',
// 	'createAsset',
// 	'updateAsset'
// ];

const recordingApi = {
	createRecording(recording) {
		validate.recording(recording);

		return {
			method: 'post',
			path: endpoints.recording,
			data: recording
		};
	},

	getRecordings({ offset, limit }) {
		return {
			method: 'get',
			path: endpoints.recording,
			query: { offset, limit }
		};
	},

	getRecording(recordingId) {
		if (typeof recordingId !== 'string' && typeof recordingId !== 'number') {
			throw new Error('Missing recordingId!');
		}

		return {
			method: 'get',
			path: `${endpoints.recording}/${recordingId}`
		};
	},

	updateRecording(recording) {
		validate.recording(recording);

		return {
			method: 'put',
			path: `${endpoints.recording}/${recording.recordingId}`,
			data: recording
		};
	},

	updateRecordingFolder(folder) {
		if (typeof folder !== 'object') {
			throw new Error('Missing folder!');
		}
		if (typeof folder.folderId !== 'string' || folder.folderId === '') {
			throw new Error('Missing folder.folderId!');
		}

		return {
			method: 'put',
			path: `${endpoints.recordingFolders}/${folder.folderId}`,
			data: folder
		};
	},

	updateCms(recordingId) {
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}

		return {
			method: 'put',
			path: `${endpoints.recording}/${recordingId}/cms`
		};
	},

	deleteRecording(recordingId) {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}

		return {
			method: 'delete',
			path: `${endpoints.recording}/${recordingId}`
		};
	},

	getRecordingTranscript(recordingId) {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}

		return {
			method: 'get',
			path: `${endpoints.recording}/${recordingId}/transcript`
		};
	},

	getRecordingMedia(
		{ token, baseUrl, maxRetries, retryIntervalMs },
		recordingId,
		callback,
		progressCallback
	) {
		const request = require('request');
		const retryHelper = new RetryHelper({
			maxRetries,
			retryIntervalMs
		});

		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		function task(callback) {
			let progress = {
				total: 0,
				received: 0
			};

			const req = request({
				method: 'GET',
				uri: `${baseUrl}/${endpoints.recording}/${recordingId}/media`,
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
				.on('error', function onError(err) {
					callback(err);
				})
				.on('response', function onResponse(response) {
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode);
					}
					progress.total = parseInt(response.headers['content-length']);
					progress.received = 0;
					if (progressCallback) {
						progressCallback(progress);
					}
					const metadata =
						response.headers[headers.metadataHeader.toLowerCase()];
					callback(null, {
						contentType: response.headers['content-type'],
						metadata: metadata ? JSON.parse(metadata) : undefined,
						stream: req
					});
				})
				.on('data', function onData(data) {
					progress.received += data.length;
					if (progressCallback) {
						progressCallback(progress);
					}
				})
				.on('end', function onEnd() {
					progress.received = progress.total;
					if (progressCallback) {
						progressCallback(progress);
					}
				});
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	getRecordingAssets(recordingId) {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}

		return {
			method: 'get',
			path: `${endpoints.recording}/${recordingId}/asset`
		};
	},

	getAsset(
		{ token, baseUrl, maxRetries, retryIntervalMs },
		recordingId,
		assetId,
		callback,
		progressCallback
	) {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if (typeof assetId !== 'string' || assetId === '') {
			throw new Error('Missing assetId!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		const request = require('request');
		const retryHelper = new RetryHelper({
			maxRetries,
			retryIntervalMs
		});

		function task(callback) {
			var progress = {
				total: 0,
				received: 0
			};

			var req = request({
				method: 'GET',
				uri: `${baseUrl}/${endpoints.recording}/${recordingId}/asset/${assetId}`,
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
				.on('error', function onError(err) {
					callback(err);
				})
				.on('response', function onResponse(response) {
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode);
					}
					progress.total = parseInt(response.headers['content-length']);
					progress.received = 0;
					if (progressCallback) {
						progressCallback(progress);
					}
					var metadata = response.headers[headers.metadataHeader.toLowerCase()];
					callback(null, {
						contentType: response.headers['content-type'],
						metadata: metadata ? JSON.parse(metadata) : undefined,
						stream: req
					});
				})
				.on('data', function onData(data) {
					progress.received += data.length;
					if (progressCallback) {
						progressCallback(progress);
					}
				})
				.on('end', function onEnd() {
					progress.received = progress.total;
					if (progressCallback) {
						progressCallback(progress);
					}
				});
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	getAssetMetadata(recordingId, assetId) {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if (typeof assetId !== 'string' || assetId === '') {
			throw new Error('Missing assetId!');
		}

		return {
			method: 'get',
			path: `${endpoints.recording}/${recordingId}/asset/${assetId}/metadata`
		};
	},

	updateAssetMetadata(recordingId, asset) {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if (typeof asset !== 'object') {
			throw new Error('Missing asset!');
		}
		if (typeof asset.assetId !== 'string' || asset.assetId === '') {
			throw new Error('Missing asset.assetId!');
		}

		return {
			method: 'put',
			path: `${endpoints.recording}/${recordingId}/asset/${asset.assetId}/metadata`,
			data: asset.metadata || {}
		};
	},

	saveAssetToFile(
		{ token, baseUrl, maxRetries, retryIntervalMs },
		recordingId,
		assetId,
		fileName,
		callback,
		progressCallback
	) {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if (typeof assetId !== 'string' || assetId === '') {
			throw new Error('Missing assetId!');
		}
		if (typeof fileName !== 'string' || fileName === '') {
			throw new Error('Missing fileName!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		const fs = require('fs');

		recordingApi.getAsset(
			{ token, baseUrl, maxRetries, retryIntervalMs },
			recordingId,
			assetId,
			function getAssetCallback(err, result) {
				if (err) {
					return callback(err);
				}
				result.stream.on('end', function onEnd() {
					callback(null, result);
				});
				result.stream.pipe(fs.createWriteStream(fileName));
			},
			progressCallback
		);
	},

	createAsset(
		{ token, baseUrl, maxRetries, retryIntervalMs },
		recordingId,
		asset,
		callback
	) {
		const fs = require('fs');
		const path = require('path');
		const request = require('request');
		const retryHelper = new RetryHelper({
			maxRetries,
			retryIntervalMs
		});

		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if (typeof asset !== 'object') {
			throw new Error('Missing asset!');
		}
		if (
			typeof asset.fileName !== 'string' &&
			typeof asset.stream !== 'object'
		) {
			throw new Error('Missing asset.fileName or asset.stream!');
		}
		if (asset.fileName && asset.stream) {
			throw new Error('You can specify only asset.fileName or asset.stream!');
		}
		if (typeof asset.assetType !== 'string' || asset.assetType === '') {
			throw new Error('Missing asset.assetType!');
		}
		if (typeof asset.contentType !== 'string' || asset.contentType === '') {
			throw new Error('Missing asset.contentType!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}
		asset.metadata = asset.metadata || {};
		if (asset.fileName) {
			if (!fs.existsSync(asset.fileName)) {
				throw new Error('File "' + asset.fileName + '" does not exist!');
			}

			if (!asset.metadata.fileName) {
				asset.metadata.fileName = path.basename(asset.fileName);
			}
			var stat = fs.statSync(asset.fileName);
			asset.metadata.size = stat.size;
		}
		//console.log(asset);

		var headers = {
			Authorization: `Bearer ${token}`
		};
		headers['X-Veritone-Asset-Type'] = asset.assetType;
		headers['Content-Type'] = asset.contentType;
		//	This causes things to hang
		//	if (asset.metadata.size) {
		//		headers['Content-Length'] = asset.metadata.size;
		//	}

		var opts = {
			method: 'POST',
			uri: `${baseUrl}/${endpoints.recording}/${recordingId}/asset`,
			headers: headers,
			json: true
		};
		if (asset.metadata) {
			opts.headers[headers.metadataHeader] = JSON.stringify(asset.metadata);
		}
		if (asset.applicationId) {
			opts.headers[headers.applicationIdHeader] = asset.applicationId;
		}
		//console.log(opts);
		var stream = asset.stream || fs.createReadStream(asset.fileName);

		function task(callback) {
			stream.pipe(
				request(opts, function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null, body);
				})
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	updateAsset(
		{ token, baseUrl, maxRetries, retryIntervalMs },
		recordingId,
		asset,
		callback
	) {
		const fs = require('fs');
		const request = require('request');
		const retryHelper = new RetryHelper({
			maxRetries,
			retryIntervalMs
		});

		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if (typeof asset !== 'object') {
			throw new Error('Missing asset!');
		}
		if (asset.fileName && !asset.contentType) {
			throw new Error('Missing asset.contentType!');
		}
		if (asset.contentType && !asset.fileName) {
			throw new Error('Missing asset.fileName!');
		}
		if (typeof asset.assetType !== 'string' || asset.assetType === '') {
			throw new Error('Missing asset.assetType!');
		}
		if (!asset.contentType && !asset.fileName && !asset.metadata) {
			throw new Error('Nothing to do!');
		}
		if (!fs.existsSync(asset.fileName)) {
			throw new Error('File "' + asset.fileName + '" does not exist!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var opts = {
			method: 'PUT',
			uri: `${baseUrl}/${endpoints.recording}/${recordingId}/asset/${asset.assetId}`,
			headers: {
				Authorization: `Bearer ${token}`
			},
			json: true
		};
		if (asset.fileName) {
			if (!fs.existsSync(asset.fileName)) {
				throw new Error('File "' + asset.fileName + '" does not exist!');
			}
			opts.headers['Content-Type'] = asset.contentType;
			opts.headers['X-Veritone-Asset-Type'] = asset.assetType;
		}
		if (asset.metadata) {
			opts.headers[headers.metadataHeader] = JSON.stringify(asset.metadata);
		}
		if (asset.applicationId) {
			opts.headers[headers.applicationIdHeader] = asset.applicationId;
		}

		function task(callback) {
			var req = request(opts, function requestCallback(err, response, body) {
				if (err) {
					return callback(err, body);
				}
				if (response.statusCode !== 200) {
					return callback('Received status: ' + response.statusCode, body);
				}
				callback(null, body);
			});
			if (asset.fileName) {
				fs.createReadStream(asset.fileName).pipe(req);
			}
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},

	deleteAsset(recordingId, assetId) {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if (typeof assetId !== 'string' || assetId === '') {
			throw new Error('Missing assetId!');
		}

		return {
			method: 'delete',
			path: `${endpoints.recording}/${recordingId}/asset/${assetId}`,
			_requestOptions: {
				validateStatus: s => s === 204
			}
		};
	}
};

nonStandardHandlers.forEach(name => (recordingApi[name].isNonStandard = true));

export default recordingApi;
