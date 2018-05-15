import { endpoints } from './config';

export default {
  createToken(tokenLabel, rights) {
    if (typeof tokenLabel !== 'string' || tokenLabel === '') {
      throw new Error('Missing label!');
    }

    if (!rights || !rights.length) {
      throw new Error('Missing rights!');
    }

    return {
      method: 'post',
      path: `${endpoints.application}/token`,
      data: { tokenLabel, rights },
      _requestOptions: {
        validateStatus: s => s === 200
      }
    };
  },

  revokeToken(token) {
    if (typeof token !== 'string' || token === '') {
      throw new Error('Missing token!');
    }

    return {
      method: 'delete',
      path: `${endpoints.application}/token/${token}`,
      _requestOptions: {
        validateStatus: s => s === 200 || s === 204
      }
    };
  }
};
// createToken: function createToken(label, rights, callback) {
// 	if (typeof label !== 'string' || label === '') {
// 		throw new Error('Missing label!');
// 	}
// 	if (!rights || !rights.length) {
// 		throw new Error('Missing rights!');
// 	}
// 	if (typeof callback !== 'function') {
// 		throw new Error('Missing callback!');
// 	}
//
// 	var self = this;
//
// 	function task(callback) {
// 		request(
// 			{
// 				method: 'POST',
// 				url: self._baseUri + endpoints.application + 'token/',
// 				headers: generateHeaders(self._token),
// 				json: {
// 					tokenLabel: label,
// 					rights: rights
// 				}
// 			},
// 			function requestCallback(err, response, body) {
// 				if (err) {
// 					return callback(err, body);
// 				}
// 				if (response.statusCode !== 200) {
// 					return callback('Received status: ' + response.statusCode, body);
// 				}
// 				callback(null, body);
// 			}
// 		);
// 	}
//
// 	self._retryHelper.retry(task, function retryCallback(err, body) {
// 		if (err) {
// 			return callback(err, body);
// 		}
// 		callback(null, body);
// 	});
// },

// revokeToken: function revokeToken(token, callback) {
// 	if (typeof token !== 'string' || token === '') {
// 		throw new Error('Missing token!');
// 	}
// 	if (typeof callback !== 'function') {
// 		throw new Error('Missing callback!');
// 	}
//
// 	var self = this;
//
// 	function task(callback) {
// 		request(
// 			{
// 				method: 'DELETE',
// 				url: self._baseUri + endpoints.application + 'token/' + token,
// 				headers: generateHeaders(self._token),
// 				json: true
// 			},
// 			function requestCallback(err, response, body) {
// 				if (err) {
// 					return callback(err, body);
// 				}
// 				if (response.statusCode !== 200 && response.statusCode !== 204) {
// 					return callback('Received status: ' + response.statusCode, body);
// 				}
// 				callback(null, body);
// 			}
// 		);
// 	}
//
// 	self._retryHelper.retry(task, function retryCallback(err, body) {
// 		if (err) {
// 			return callback(err, body);
// 		}
// 		callback(null, body);
// 	});
// }
// ,
