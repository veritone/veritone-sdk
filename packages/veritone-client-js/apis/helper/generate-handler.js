'use strict';

const Route = require('route-parser');

export default function generateHandler(method, path, availableHeaders = []) {
  if (!method) {
    throw new Error('method is required');
  }

  if (!path) {
    throw new Error('path is required');
  }

  const route = new Route(path);

  if (['post', 'put', 'patch'].includes(method.toLowerCase())) {
    return function handler(params, payload) {
      if (arguments.length < 2) {
        payload = params;
        params = {};
      }

      return generateRequest(params, payload);
    };
  }

  return function handler(params) {
    return generateRequest(params);
  };

  function generateRequest(params = {}, payload) {
    const requiredRouteParams = route.match(path);
    let headers = {};
    let routeParams = {};
    let queryParams = {};

    // assign params to route and headers and the rest to the query string
    Object.keys(requiredRouteParams).forEach(key => {
      if (!params[key]) {
        throw new Error('"' + key + '" param is required');
      }

      routeParams[key] = params[key];
    });

    Object.keys(params).forEach(key => {
      if (availableHeaders.indexOf(key) >= 0) {
        headers[key] = params[key];
      } else if (!routeParams.hasOwnProperty(key)) {
        queryParams[key] = params[key];
      }
    });

    return {
      method: method.toLowerCase(),
      path: route.reverse(routeParams),
      data: payload,
      headers: headers,
      query: queryParams
    };
  }
}
