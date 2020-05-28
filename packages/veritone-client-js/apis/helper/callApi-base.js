import validate from 'validate.js';

import RetryHelper from './RetryHelper';
import { last, noop } from './util';

export default function callApiFactory(doRequest) {
  return function callApiBase(
    // base options provided by API client
    {
      token,
      apiToken,
      oauthToken,
      baseUrl,
      extraHeaders = {},
      maxRetries = 1,
      retryIntervalMs = 1000
    } = {},
    // handler returning a request object
    handlerFn
  ) {
    validateTokens({ token, apiToken, oauthToken });
    validateBaseUrl(baseUrl);
    validateHandlerFn(handlerFn);

    if (handlerFn.isNonStandard) {
      // non-standard APIs don't use callApi()'s request wrapper, so
      // they handle their own request/response, retries, callbacks, etc.
      // used for streaming requests, requests that read/write from
      // the filesystem, etc.
      // all they need is the handler options.
      return handlerFn.bind(null, {
        token,
        apiToken,
        oauthToken,
        baseUrl,
        maxRetries,
        retryIntervalMs
      });
    }

    return function apiRequest(...args) {
      // figure out arg signature; one of:
      // ...handlerFnArgs, requestOptionOverrides, cb
      // ...handlerFnArgs, cb
      // ...handlerFnArgs, requestOptionOverrides
      let requestOptionOverrides = {};
      let callback = noop;
      let matchedRequestArgs = 0;

      if (typeof last(args) === 'function') {
        matchedRequestArgs++;
        callback = last(args);
      }

      if (isRequestOptionsObj(last(args))) {
        requestOptionOverrides = last(args);
        matchedRequestArgs++;
      } else if (isRequestOptionsObj(args[args.length - 2])) {
        requestOptionOverrides = args[args.length - 2];
        matchedRequestArgs++;
      }

      const request = handlerFn(
        ...args.slice(0, args.length - matchedRequestArgs)
      );
      validateRequestObject(request);

      const {
        method,
        path,
        data,
        query,
        headers,
        _requestOptions = {}
      } = request;

      validateRequestOptions(_requestOptions);

      const options = {
        // todo: timeout interval on constructor/overrides
        validateStatus: status => status >= 200 && status < 300,
        withCredentials: true,
        jsonStringifyRequestData: true,
        maxRetries,
        retryIntervalMs,
        version: 1,
        // options defined on handler:
        ..._requestOptions,
        // options provided by consumer at call-time:
        ...requestOptionOverrides
      };

      const retryHelper = new RetryHelper({
        maxRetries: options.maxRetries,
        retryIntervalMs: options.retryIntervalMs
      });

      // oauth token always used if provided.
      // use api token if specified by handler,
      // otherwise default to session token
      const neededToken = oauthToken
        ? oauthToken
        : options.tokenType === 'api'
          ? apiToken
          : token;

      return new Promise((resolve, reject) => {
        retryHelper.retry(
          cb => {
            doRequest(
              {
                path: `${baseUrl}/v${options.version}/${path}`,
                method,
                data,
                query,
                headers: Object.assign(
                  neededToken
                    ? {
                        Authorization: `Bearer ${neededToken}`,
                    ...extraHeaders
                      }
                    : {},
                  headers,
                  options.headers
                ),
                options
              },
              cb
            );
          },
          (err, res) => {
            // provide dual promise/cb interface to callers
            if (err) {
              reject(err);
              return callback(err);
            }

            resolve(res);
            callback(null, res);
          }
        );
      });
    };
  };
}

function validateTokens({ token, apiToken, oauthToken }) {
  // require both token and apiToken, or oauthToken
  if (oauthToken) {
    if (typeof oauthToken === 'string') {
      return;
    } else {
      throw new Error(`oauthToken must be a string`);
    }
  }

  if (token) {
    if (typeof token !== 'string') {
      throw new Error(`token must be a string`);
    }
  }

  if (apiToken) {
    if (typeof apiToken !== 'string') {
      throw new Error(`apiToken must be a string`);
    }
  }
}

function validateBaseUrl(url) {
  if (!(url.startsWith('http://') || url.startsWith('https://'))) {
    throw new Error(`expected ${url} to include http(s) protocol`);
  }
}

function validateHandlerFn(fn) {
  if (typeof fn !== 'function') {
    throw new Error(`expected ${fn} to be a handler function`);
  }
}

function validateRequestObject(obj) {
  const validKeys = [
    'method',
    'path',
    'data',
    'query',
    'headers',
    '_requestOptions'
  ];

  Object.keys(obj).forEach(key => {
    if (!validKeys.includes(key)) {
      throw new Error(
        `unexpected key in request object: ${key}. Supported keys are: ` +
          JSON.stringify(validKeys)
      );
    }
  });
}

const supportedOptions = [
  'maxRetries',
  'retryIntervalMs',
  'withCredentials',
  'timeoutMs',
  'headers',
  'transformResponseData',
  'validateStatus',
  'jsonStringifyRequestData',
  'tokenType',
  'version'
  // 'cancelToken',
  // onUploadProgress,
  // onDownloadProgress,
];

function isRequestOptionsObj(obj = {}) {
  return (
    Object.keys(obj).length &&
    Object.keys(obj).every(opt => supportedOptions.includes(opt))
  );
}

function validateRequestOptions(options) {
  Object.keys(options).forEach(opt => {
    if (!supportedOptions.includes(opt)) {
      throw new Error(
        `unexpected requestOption: ${opt}. Supported options are: ` +
          JSON.stringify(supportedOptions)
      );
    }
  });

  const constraints = {
    maxRetries: {
      numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
    },
    retryIntervalMs: {
      numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
    },
    timeoutMs: {
      numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
    },
    withCredentials: {
      inclusion: { within: [true, false], message: 'should be a boolean' }
    },
    tokenType: {
      inclusion: {
        within: ['api', 'session'],
        message: 'should be either "api" or "session"'
      }
    }
  };

  const errors = validate(options, constraints);
  if (errors) {
    throw new Error(Object.values(errors)[0]);
  }

  if (
    options.headers !== undefined &&
    options.headers !== null &&
    typeof options.headers !== 'object'
  ) {
    throw new Error(
      `requestOptions.headers should be an object. got: ${options.headers}.`
    );
  }

  if (
    options.transformResponseData &&
    typeof options.transformResponseData !== 'function'
  ) {
    throw new Error(
      `requestOptions.transformResponseData should be a function. got: ${
        options.transformResponseData
      }`
    );
  }
}
