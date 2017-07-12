import axios from 'axios';
import validate from 'validate.js';

const RetryHelper = require('./RetryHelper');
import { last, noop } from './util';

export default function callApi(
	// base options provided by API client
	{ token, baseUrl, maxRetries = 1, retryIntervalMs = 1000 },
	// handler returning a request object
	handlerFn
) {
	validateAuthToken(token);
	validateBaseUrl(baseUrl);
	validateHandlerFn(handlerFn);

	return function apiRequest(...args) {
		// figure out arg signature; one of:
		// ...handlerFnArgs, requestOptionOverrides, cb
		// ...handlerFnArgs, cb
		// ...handlerFnArgs, requestOptionOverrides
		let requestOptionOverrides = {};
		let callback = noop;

		if (typeof last(args) === 'function') {
			callback = last(args);
		}

		if (isRequestOptionsObj(last(args))) {
			requestOptionOverrides = last(args);
		} else if (isRequestOptionsObj(args[args.length - 2])) {
			requestOptionOverrides = args[args.length - 2];
		}

		const {
			method,
			path,
			data,
			query,
			headers,
			// default options for this request, if different from defaults
			_requestOptions = {}
		} = handlerFn(...args);

		validateRequestOptions(_requestOptions);

		const options = {
			validateStatus: status => status >= 200 && status < 300,
			withCredentials: true,
			maxRetries,
			retryIntervalMs,
			..._requestOptions,
			...requestOptionOverrides
		};

		const retryHelper = new RetryHelper({
			maxRetries: options.maxRetries,
			retryIntervalMs: options.retryIntervalMs
		});

		return new Promise((resolve, reject) => {
			retryHelper.retry(
				cb => {
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
							baseURL: baseUrl,
							timeout: options.timeoutMs,
							validateStatus: options.validateStatus
						})
						.then(rawResponse => {
							let response = {
								...rawResponse,
								data: options.transformResponseData
									? options.transformResponseData(rawResponse.data)
									: rawResponse.data
							};

							cb(null, response);
						})
						.catch(err => {
							cb(err);
						});
				},
				(err, res) => {
					// provide dual promise/cb interface to callers
					if (err) {
						callback(err);
						return reject(err);
					}

					callback(null, res);
					resolve(res);
				}
			);
		});
	};
}

function validateAuthToken(token) {
	if (typeof token !== 'string') {
		throw new Error(`callApi requires an api token`);
	}
}

function validateBaseUrl(url) {
	if (!(url.startsWith('http://') || url.startsWith('https://'))) {
		throw new Error(`expected ${url} to include http(s) protocol`);
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
	'transformResponseData',
	'validateStatus',
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
