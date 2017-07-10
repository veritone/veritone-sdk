import Route from 'route-parser';

export function path(path, params = {}) {
	validatePath(path);
	validateParams(params);

	const route = new Route(path);
	const pathWithParams = route.reverse(params);

	if (!pathWithParams) {
		const requiredRouteParams = Object.keys(route.match(path));
		throw new Error(
			'all path parameters are required to make a request; ' +
			`required: ${requiredRouteParams}. ` +
			`got: ${Object.keys(params)}.`
		);
	}

	return pathWithParams.startsWith('/')
		? pathWithParams
		: `/${pathWithParams}`
}

function validatePath(path) {
	if (typeof path !== 'string' || path.length === 0) {
		throw new Error(`expected path ${path} to be a string of length > 0.`);
	}
}

function validateParams(params) {
	if (params && typeof params !== 'object') {
		throw new Error(`expected ${params} to be an object.`);
	}
}

export function last(array = []) {
	return array[array.length - 1]
}

export function noop() {}
