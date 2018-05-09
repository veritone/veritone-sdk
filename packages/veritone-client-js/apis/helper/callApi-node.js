import axios from 'axios';

import ApiError from './ApiError';
import callApiFactory from './callApi-base';

export default callApiFactory(function callApiNode(
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
      timeoutMs,
      jsonStringifyRequestData
    }
  },
  callback
) {
  axios
    .request({
      method,
      data: jsonStringifyRequestData ? JSON.stringify(data) : data,
      url: path,
      params: query,
      headers,
      withCredentials: withCredentials,
      timeout: timeoutMs,
      validateStatus
    })
    .then(
      rawResponse => {
        let response = {
          ...rawResponse,
          data: transformResponseData
            ? transformResponseData(rawResponse.data)
            : rawResponse.data
        };

        callback(null, response.data);
      },
      err => {
        callback(
          new ApiError(
            err.message,
            err.response ? err.response.status : null,
            err.response ? err.response.data : null
          )
        );
      }
    );
});
