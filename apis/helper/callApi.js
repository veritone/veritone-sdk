import axios from 'axios';
import validate from 'validate.js';

import { last, noop } from './util';

export function callApi({ token, baseUri }, handlerFn, requestOptions = {}) {
	validateAuthToken(token);
	validateBaseUri(baseUri);
	validateHandlerFn(handlerFn);
	validateRequestOptions(requestOptions);

	// ...handler args, opts?, cb?
	return function apiRequest(
		...args
	) {
		// figure out arg signature; one of:
		// ...handlerArgs, requestOptionOverrides, cb
		// ...handlerArgs, cb
		// ...handlerArgs, requestOptionOverrides
		let requestOptionOverrides, callback;

		callback = typeof last(args) === 'function'
			? last(args)
			: noop;

		if (isRequestOptionsObj(last(args))) {
			requestOptionOverrides = last(args)
		} else if (isRequestOptionsObj(args[args.length - 2])) {
			requestOptionOverrides = args[args.length - 2]
		}

		const { method, path, data, query, headers } = handlerFn(...args);
		const options = {
			withCredentials: true,
			maxRetries: 3,
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
					timeout: options.timeoutMs
				})
				.then(rawResponse => {
					let response = {
						...rawResponse,
						data: options.transformResponseData
							? options.transformResponseData(rawResponse.data)
							: rawResponse.data
					};

					resolve(response);
					callback(null, response);
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

const supportedOptions = [
	'maxRetries',
	'retryIntervalMs',
	'withCredentials',
	'timeoutMs',
	'headers',
	'transformResponseData'
	// 'cancelToken',
	// onUploadProgress,
	// onDownloadProgress,
];

function isRequestOptionsObj(obj = {}) {
	Object.keys(obj).every(opt => supportedOptions.includes(opt));
}

function validateRequestOptions(options) {
	Object.keys(options).forEach(opt => {
		if (!supportedOptions.includes(opt)) {
			throw new Error(
				`unexpected requestOption: ${opt}. Supported options are: ` +
					JSON.stringify(supportedOptions)
			);
		}
	});

	const constraints = {
		maxRetries: {
			numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
		},
		retryIntervalMs: {
			numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
		},
		timeoutMs: {
			numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
		},
		withCredentials: {
			inclusion: { within: [true, false], message: 'should be a boolean' }
		}
	};

	const errors = validate(options, constraints);
	if (errors) {
		throw new Error(Object.values(errors)[0]);
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

	if (
		options.transformResponseData &&
		typeof options.transformResponseData !== 'function'
	) {
		throw new Error(
			`requestOptions.transformResponseData should be a function. got: ${options.transformResponseData}`
		);
	}
}
