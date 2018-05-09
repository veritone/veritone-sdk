import qs from 'qs';

import ApiError from './ApiError';
import callApiFactory from './callApi-base';

export default callApiFactory(async function callApiBrowser(
  {
    path,
    method,
    data,
    query,
    headers,
    options: {
      validateStatus,
      withCredentials,
      transformResponseData,
      jsonStringifyRequestData
    }
  },
  callback
) {
  let url = path;
  if (query && Object.keys(query).length) {
    url = `${url}?${qs.stringify(query)}`;
  }

  try {
    callback(
      null,
      await doFetch(
        url,
        {
          method,
          body: jsonStringifyRequestData ? JSON.stringify(data) : data,
          headers: {
            'content-type': 'application/json',
            ...headers
          },
          withCredentials: withCredentials
        },
        {
          validateStatus: validateStatus,
          transformResponseData: transformResponseData
        }
      )
    );
  } catch (e) {
    callback(e);
  }
});

async function doFetch(url, fetchOptions, clientOptions) {
  let result;
  try {
    result = await fetch(url, fetchOptions);
  } catch (e) {
    // fetch failure -- offline, cors, etc
    throw new ApiError(e.message);
  }

  if (!clientOptions.validateStatus(result.status)) {
    // failure from bad http status
    throw new ApiError(
      `Request failed with status code ${result.status}`,
      result.status,
      tryJson(await result.text())
    );
  }

  let rawResponseBody, responseBodyData;
  try {
    rawResponseBody = await result.text();
  } catch (e) {
    // no body
  }

  responseBodyData = tryJson(rawResponseBody);

  return clientOptions.transformResponseData
    ? clientOptions.transformResponseData(responseBodyData)
    : responseBodyData;
}

function tryJson(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}
