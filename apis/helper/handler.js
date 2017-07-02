// import { validate } from 'validate.js';
import Route from 'route-parser';

export function handler(method, path, options = {}) {
	const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];
	if (
		typeof method !== 'string' ||
		!validMethods.includes(method.toUpperCase())
	) {
		throw new Error(`${method} is not a valid request method.`);
	}

	if (typeof path !== 'string' || path.length === 0) {
		throw new Error(`expected path ${path} to be a string of length > 0.`);
	}

	if (options && typeof options !== 'object') {
		throw new Error(`expected ${options} to be undefined or an object.`);
	}

	return function request(params) {
		const route = new Route(path);

		const finalPath = route.reverse(params);

		return {
			method: method.toUpperCase(),
			path: finalPath.startsWith('/') ? finalPath : `/${finalPath}`
		};
	};
}
