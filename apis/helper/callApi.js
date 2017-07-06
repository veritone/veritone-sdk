import axios from 'axios';
import validate from 'validate.js';

const noop = () => {};

export function callApi({ token, baseUri }, handlerFn, requestOptions = {}) {
	validateAuthToken(token);
	validateBaseUri(baseUri);
	validateHandlerFn(handlerFn);
	validateRequestOptions(requestOptions);

	return function apiRequest(
		params,
		reqData,
		callback = noop,
		requestOptionOverrides
	) {
		const { method, path, data, query, headers } = handlerFn(params, reqData);
		const options = {
			...requestOptions,
			...requestOptionOverrides
		};

		// don't return axios' promise directly, so we can support both
		// promise and cb styles:
		return new Promise((resolve, reject) => {
			axios
				.request({
					method,
					data,
					url: path,
					params: query,
					headers: {
						Authorization: `Bearer ${token}`,
						...headers,
						...options.headers
					},
					baseURL: baseUri,
					timeout: options.timeoutMs,

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

function validateRequestOptions(options) {
	const supportedOptions = [
		'maxRetries',
		'withCredentials',
		'timeoutMs',
		'headers'
		// 'cancelToken',
		// onUploadProgress,
		// onDownloadProgress,
	];

	const constraints = {
		maxRetries: {
			numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
		},
		timeoutMs: {
			numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
		},
		withCredentials: {
			inclusion: { within: [true, false], message: 'should be a boolean' }
		}
	};

	Object.keys(options).forEach(opt => {
		if (!supportedOptions.includes(opt)) {
			throw new Error(
				`unexpected requestOption: ${opt}. Supported options are: ` +
					JSON.stringify(supportedOptions)
			);
		}
	});

	const errors = validate(options, constraints);

	if (errors) {
		throw new Error(Object.values(errors)[0])
	}

	if (
		options.headers !== undefined &&
		options.headers !== null &&
		typeof options.headers !== 'object'
	) {
		throw new Error(
			`requestOptions.headers should be an object. got: ${options.headers}.`
		);
	}
}
