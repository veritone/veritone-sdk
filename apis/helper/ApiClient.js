// const RetryHelper = require('./RetryHelper');
import veritoneApis from '../index';
import callApi from './callApi';
import { mapObject } from './util';

export default function veritoneApi(
	{
		token,
		baseUrl = 'https://api.veritone.com',
		version = 1,
		maxRetries = 1, // todo
		retryIntervalMs = 1000
	},
	apis = veritoneApis
) {
	if (!token) {
		throw new Error('Token is required');
	}

	return mapObject(apis, ns =>
		mapObject(ns, handler =>
			callApi({ token, baseUrl: `${baseUrl}/v${version}` }, handler)
			// fixme -- handler's request options?
		)
	);

	// this._token = token;
	// this._baseUrl = `${baseUrl}/v${version}`;
	// this._retryHelper = new RetryHelper({ maxRetries, retryIntervalMs });
	//

	// Object.assign(this, apis);
}
