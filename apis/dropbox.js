import { endpoints } from './config';

export default {
	createDropboxWatcher(watcher) {
		this._retryRequest('POST', endpoints.dropboxWatcher, watcher, callback);
	},

	getDropboxWatchers(options = {}) {
		if (typeof options === 'string') {
			options = {
				watcherId: options
			};
		} else if (typeof options !== 'object') {
			throw new Error('Missing options!');
		}
		this._retryRequest('GET', endpoints.dropboxWatcher, options, callback);
	},

	getDropboxWatcher(watcherId) {
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

	updateDropboxWatcher(watcher) {
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

	deleteDropboxWatcher(watcherId) {
		if (typeof watcherId !== 'string' || watcherId === '') {
			throw new Error('Missing watcherId!');
		}
		this._retryRequest(
			'DELETE',
			endpoints.dropboxWatcher + watcherId,
			null,
			callback
		);
	}
}
