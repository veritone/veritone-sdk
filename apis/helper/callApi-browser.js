const fetch = window.fetch;
import validate from 'validate.js';
import qs from 'qs';

import RetryHelper from './RetryHelper';
import { last, noop } from './util';

export default function callApi(
	// base options provided by API client
	{ token, baseUrl, maxRetries = 1, retryIntervalMs = 1000 } = {},
	// handler returning a request object
	handlerFn
) {
	validateAuthToken(token);
	validateBaseUrl(baseUrl);
	validateHandlerFn(handlerFn);

	if (handlerFn.isNonStandard) {
		// non-standard APIs don't use callApi()'s request wrapper, so
		// they handle their own request/response, retries, callbacks, etc.
		// used for streaming requests, requests that read/write from
		// the filesystem, etc.
		// all they need is the handler options.
		return handlerFn.bind(null, {
			token,
			baseUrl,
			maxRetries,
			retryIntervalMs
		});
	}

	return function apiRequest(...args) {
		// figure out arg signature; one of:
		// ...handlerFnArgs, requestOptionOverrides, cb
		// ...handlerFnArgs, cb
		// ...handlerFnArgs, requestOptionOverrides
		let requestOptionOverrides = {};
		let callback = noop;
		let matchedRequestArgs = 0;

		if (typeof last(args) === 'function') {
			matchedRequestArgs++;
			callback = last(args);
		}

		if (isRequestOptionsObj(last(args))) {
			requestOptionOverrides = last(args);
			matchedRequestArgs++;
		} else if (isRequestOptionsObj(args[args.length - 2])) {
			requestOptionOverrides = args[args.length - 2];
			matchedRequestArgs++;
		}

		const request = handlerFn(
			...args.slice(0, args.length - matchedRequestArgs)
		);
		validateRequestObject(request);

		const {
			method,
			path,
			data,
			query,
			headers,
			// default options for this request, if different from defaults
			_requestOptions = {}
		} = request;

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
					fetch(`${baseUrl}/${path}?${qs.stringify(query)}`, {
						method,
						body: data,
						headers: {
							Authorization: `Bearer ${token}`,
							...headers,
							...options.headers
						}
						// 		validateStatus: options.validateStatus
						// fixme:
						// 		timeout: options.timeoutMs,
					})
						.then(r => {
							if (!options.validateStatus(r.status)) {
								// todo: cleanup
								let e = new Error(`Request failed with status code ${r.status}`);
								e.status = r.status;
								return r.text().then(t => e.data = t).then(() => Promise.reject(e))
							}

							return r;
						})
						.then(r => r.json())
						.then(
							rawResponseData => {
								let response = {
									...options.transformResponseData
										? options.transformResponseData(rawResponseData)
										: rawResponseData
								};

								cb(null, response);
							},
							err => {
								cb(err);
							}
						);
				},
				(err, res) => {
					// provide dual promise/cb interface to callers
					if (err) {
						reject(err);
						return callback(err);
					}

					resolve(res);
					callback(null, res);
				}
			);
		});
	};
}

function validateAuthToken(token) {
	if (typeof token !== 'string') {
		throw new Error(`callApi requires an api token, which must be a string`);
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

function validateRequestObject(obj) {
	const validKeys = [
		'method',
		'path',
		'data',
		'query',
		'headers',
		'_requestOptions'
	];

	Object.keys(obj).forEach(key => {
		if (!validKeys.includes(key)) {
			throw new Error(
				`unexpected key in request object: ${key}. Supported keys are: ` +
					JSON.stringify(validKeys)
			);
		}
	});
}

const supportedOptions = [
	'maxRetries',
	'retryIntervalMs',
	'withCredentials',
	'timeoutMs',
	'headers',
	'transformResponseData',
	'validateStatus'
	// 'cancelToken',
	// onUploadProgress,
	// onDownloadProgress,
];

function isRequestOptionsObj(obj = {}) {
	return (
		Object.keys(obj).length &&
		Object.keys(obj).every(opt => supportedOptions.includes(opt))
	);
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
