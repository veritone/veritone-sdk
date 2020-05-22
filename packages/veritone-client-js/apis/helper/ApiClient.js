const callApi = __BROWSER__
  ? require('./callApi-browser').default
  : require('./callApi-node').default;

import { mapObject } from './util';

export default function veritoneApi(
  {
    token,
    apiToken,
    oauthToken,
    extraHeaders = {},
    baseUrl = 'https://api.veritone.com',
    maxRetries = 1,
    retryIntervalMs = 1000
  },
  apis = {}
) {
  return mapObject(apis, ns =>
    mapObject(ns, handler =>
      callApi(
        {
          token,
          apiToken,
          oauthToken,
          extraHeaders,
          baseUrl,
          maxRetries,
          retryIntervalMs
        },
        handler
      )
    )
  );
}
