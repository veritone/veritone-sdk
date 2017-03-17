'use strict';

var querystring = require('querystring');
var request = require('request');
var Route = require('route-parser');

module.exports = function init(client, baseUri) {
	if (!client) {
		throw new Error('client is required');
	}

	if (!baseUri) {
		throw new Error('baseUri is required');
	}

	return function generateHandler(method, path, availableHeaders) {
		if (!method) {
			throw new Error('method is required');
		}

		if (!path) {
			throw new Error('path is required');
		}

		var route = new Route(path);
		availableHeaders = availableHeaders || [];

		if (['POST', 'PUT', 'PATCH'].indexOf(method.toUpperCase()) >= 0) {
			return function handler(params, payload, callback) {
				params = params || {};

				if (arguments.length < 3) {
					callback = payload;
					payload = params;
					params = {};
				}

				var req = generateRequest(params, payload);
				performRequest(req, callback);
			};
		}

		return function handler(params, callback) {
			if (arguments.length < 2) {
				callback = params;
				params = {};
			}

			var req = generateRequest(params || {});
			performRequest(req, callback);
		};

		function generateRequest(params, payload) {
			var requiredRouteParams = route.match(path);
			var headers = client.generateHeaders();
			var routeParams = {};
			var queryParams = {};
			var key;

			// assign params to route and headers and the rest to the query string
			for (key in requiredRouteParams) {
				if (!params[key]) {
					throw new Error('"' + key + '" param is required');
				}

				routeParams[key] = params[key];
			}

			for (key in params) {
				if (availableHeaders.indexOf(key) >= 0) {
					headers[key] = params[key];
				} else if (!routeParams.hasOwnProperty(key)) {
					queryParams[key] = params[key];
				}
			}

			var req = {
				method: method,
				headers: headers,
				body: payload
			};

			req.url = baseUri + route.reverse(routeParams);

			var qs = querystring.stringify(queryParams);
			if (qs) {
				req.url += '?' + qs;
			}

			// TODO handle case variants
			if (!headers['Content-Type']) {
				// assume application/json
				req.json = true;
			}

			return req;
		}
	};

	function performRequest(options, callback) {
		if (typeof options != 'object') {
			throw new Error('Expected options to be an object');
		}

		if (typeof callback != 'function') {
			throw new Error('Missing callback!');
		}

		client._retryHelper.retry(function task(callback) {
			request(options, callback);
		}, callback);
	}
};