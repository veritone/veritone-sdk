import axios from 'axios';

const noop = () => {};

export function callApi({ token, baseUri }, handlerFn, requestOptions = {}) {
	validateAuthToken(token);
	validateBaseUri(baseUri);
	validateHandlerFn(handlerFn);

	return function apiRequest(
		params,
		reqData,
		callback = noop,
		requestOptionOverrides
	) {
		const { method, path, data, query, headers } = handlerFn(params, reqData);

		// don't return axios' promise directly, so we can support both promise and cb styles
		return new Promise((resolve, reject) => {
			axios
				.request({
					method,
					url: path,
					headers: {
						Authorization: `Bearer ${token}`
					},
					baseURL: baseUri
				})
				.then(res => {
					resolve(res);
					callback(null, res);
				})
				.catch(err => {
					reject(err);
					callback(err);
				});
		});
	};
}

function validateAuthToken(token) {
	if (typeof token !== 'string') {
		throw new Error(`callApi requires an api token`);
	}
}
function validateBaseUri(uri) {
	if (!(uri.startsWith('http://') || uri.startsWith('https://'))) {
		throw new Error(`expected ${uri} to include http(s) protocol`);
	}
}

function validateHandlerFn(fn) {
	if (typeof fn !== 'function') {
		throw new Error(`expected ${fn} to be a handler function`);
	}
}
