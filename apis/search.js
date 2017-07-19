import { endpoints } from './config';

export default {
	search: function search(searchRequest) {
		if (typeof searchRequest !== 'object') {
			throw new Error('Missing search request!');
		}

		var self = this;

		function task(callback) {
			request(
				{
					method: 'POST',
					url: baseUri + endpoints.search,
					headers: generateHeaders(self._token),
					json: searchRequest
				},
				function requestCallback(err, response, body) {
					if (err) {
						return callback(err, body);
					}
					if (response.statusCode !== 200) {
						return callback('Received status: ' + response.statusCode, body);
					}
					callback(null, body);
				}
			);
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	}
}
