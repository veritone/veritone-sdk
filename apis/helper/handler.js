// import { validate } from 'validate.js';
import Route from 'route-parser';

// import qs from 'qs';
export const REQUIRED = '@@required';
export function handler(method, path, options = {}) {
	validateMethod(method);
	validatePath(path);
	validateOptions(options);

	const route = new Route(path);

	const allQueryNames = (options.query || []).map(getConfigParamName);
	const allHeaderNames = (options.headers || []).map(getConfigParamName);

	// const pathHasParams = !!(path.split(':').length - 1);
	// const hasRequestBody = ['PUT', 'POST', 'PATCH'].includes(method.toUpperCase());

	return function request(params = {}, data) {
		// if (hasRequestBody && !pathHasParams) {
		// 	// fixme -- this should happen only when we have post/put/patch,
		// 	// but no headers, query, or addtl options are provided
		// 	data = params;
		// 	params = undefined;
		// }
		validateQuery(params, options.query);
		validateHeaders(params, options.headers);

		const pathWithParams = route.reverse(params);

		if (!pathWithParams) {
			const requiredRouteParams = Object.keys(route.match(path));
			throw new Error(
				'all path parameters are required to make a request; ' +
					`required: ${requiredRouteParams}. ` +
					`got: ${Object.keys(params)}.`
			);
		}

		const paramsWithDefaults = mergeDefaultParams(
			params,
			options.headers,
			options.query
		);

		return {
			method: method.toUpperCase(),

			path: pathWithParams.startsWith('/')
				? pathWithParams
				: `/${pathWithParams}`,

			data: ['PUT', 'POST', 'PATCH'].includes(method.toUpperCase())
				? data
				: undefined,

			query: options.query
				? filterObject(paramsWithDefaults, (_, k) => allQueryNames.includes(k))
				: undefined,

			headers: options.headers
				? filterObject(paramsWithDefaults, (_, k) => allHeaderNames.includes(k))
				: undefined
		};
	};
}

function mergeDefaultParams(base, ...params) {
	const allDefaults = flatten(params)
		.filter(param => typeof param === 'object')
		.map(configObject => {
			if (process.env.NODE_ENV !== 'production') {
				validateConfigObject(configObject);
			}

			const paramName = Object.keys(configObject)[0];
			const paramValue = configObject[paramName];
			return {
				[paramName]: paramValue === REQUIRED ? undefined : paramValue
			};
		});

	const mergedDefaults = Object.assign({}, ...allDefaults);
	return Object.assign({}, mergedDefaults, base);
}

function getConfigParamName(q) {
	// given a string name, return the string
	// given a config object, return the param name it configures
	return typeof q === 'object' ? Object.keys(q)[0] : q;
}

function validateMethod(method) {
	const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];
	if (
		typeof method !== 'string' ||
		!validMethods.includes(method.toUpperCase())
	) {
		throw new Error(`${method} is not a valid request method.`);
	}
}

function validatePath(path) {
	if (typeof path !== 'string' || path.length === 0) {
		throw new Error(`expected path ${path} to be a string of length > 0.`);
	}
}

function validateOptions(options) {
	if (options === null || (options && typeof options !== 'object')) {
		throw new Error(`expected ${options} to be undefined or an object.`);
	}

	if (options.query && !Array.isArray(options.query)) {
		throw new Error(`expected ${options.query} to be undefined or an array.`);
	}

	if (options.headers && !Array.isArray(options.headers)) {
		throw new Error(`expected ${options.headers} to be undefined or an array.`);
	}
}

function validateQuery(params, schema = []) {
	const requiredParams = schema
		.filter(p => Object.values(p)[0] === REQUIRED)
		.map(p => Object.keys(p)[0]);

	requiredParams.forEach(p => {
		if (params[p] === undefined) {
			throw new Error(
				`param ${p} is required. expected ${JSON.stringify(
					params
				)} to match ${JSON.stringify(schema)}`
			);
		}
	});
}

function validateHeaders(params, schema = []) {
	const requiredHeaders = schema
		.filter(p => Object.values(p)[0] === REQUIRED)
		.map(p => Object.keys(p)[0]);

	requiredHeaders.forEach(p => {
		if (params[p] === undefined) {
			throw new Error(
				`header ${p} is required. expected ${JSON.stringify(
					params
				)} to match ${JSON.stringify(schema)}`
			);
		}
	});
}

function validateConfigObject(configObject) {
	if (typeof configObject !== 'object' || configObject === null) {
		throw new Error(`expected an object. got: ${configObject}`);
	}

	if (Object.keys(configObject).length > 1) {
		throw new Error(
			'malformed config object found.' +
				`got: ${JSON.stringify(configObject)}. ` +
				'expected an object with one key, the value of which is either a default, or the REQUIRED symbol ' +
				"like { query: [{ paramWithDefault: 5 }, 'paramWithoutDefault'] }, " +
				'or { query: [{ requiredParam: handler.REQUIRED }, ...] }'
		);
	}
}

function filterObject(obj, pred) {
	let result = {};

	Object.keys(obj).forEach(k => {
		let v = obj[k];
		if (pred(v, k, obj)) {
			result[k] = v;
		}
	});

	return result;
}

function flatten(arrs) {
	return arrs.reduce((r, a) => r.concat(a), []);
}
