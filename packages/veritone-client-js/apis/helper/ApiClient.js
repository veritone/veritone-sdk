const callApi = __BROWSER__
	? require('./callApi-browser').default
	: require('./callApi-node').default;

import { mapObject } from './util';

export default function veritoneApi(
	{
		token,
		apiToken,
		oauthToken,
		baseUrl = 'https://api.veritone.com',
		maxRetries = 1,
		retryIntervalMs = 1000
	},
	apis = {}
) {
	if (!token) {
		throw new Error('Token is required');
	}

	return mapObject(apis, ns =>
		mapObject(ns, handler =>
			callApi(
				{
					token,
					apiToken,
					oauthToken,
					baseUrl,
					maxRetries,
					retryIntervalMs
				},
				handler
			)
		)
	);
}
