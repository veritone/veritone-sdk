import { endpoints } from './config'

export default {
	createIngestion(ingestion) {
		this._retryRequest('POST', endpoints.ingestion, ingestion, callback);
	},

	getIngestions(options = {}) {
		this._retryRequest('GET', endpoints.ingestion, options, callback);
	},

	getIngestion(ingestionId, options = {}) {
		if (typeof ingestionId !== 'string' || ingestionId === '') {
			throw new Error('Missing ingestionId');
		}

		this._retryRequest(
			'GET',
			endpoints.ingestion + ingestionId,
			options,
			callback
		);
	},

	updateIngestion(ingestionId, patch) {
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

	deleteIngestion(ingestionId, options) {
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

	ingestionConnect(connectOptions) {
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

	verifyEmailIngestion(emailOptions) {
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
}
