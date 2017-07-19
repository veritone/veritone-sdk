import { endpoints} from './config'

export default {
	batch(requests) {
		var self = this;

		function task(callback) {
			request(
				{
					method: 'POST',
					url: baseUri + endpoints.batch,
					headers: generateHeaders(self._token),
					json: requests
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
