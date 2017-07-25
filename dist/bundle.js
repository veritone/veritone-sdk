'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var http = _interopDefault(require('http'));
var https = _interopDefault(require('https'));
var url = _interopDefault(require('url'));
var assert = _interopDefault(require('assert'));
var stream = _interopDefault(require('stream'));
var tty = _interopDefault(require('tty'));
var util = _interopDefault(require('util'));
var fs = _interopDefault(require('fs'));
var net = _interopDefault(require('net'));
var zlib = _interopDefault(require('zlib'));

var bind = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
var index$1 = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
};

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object' && !isArray(obj)) {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

var utils = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: index$1,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};

var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
var enhanceError = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
var createError = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
var settle = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
var buildURL = function buildURL(url$$1, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url$$1;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url$$1 += (url$$1.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url$$1;
};

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

var isURLSameOrigin = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url$$1) {
      var href = url$$1;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);

// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa$1(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

var btoa_1 = btoa$1;

var cookies = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);

var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || btoa_1;

var xhr = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies$$1 = cookies;

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies$$1.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var index$7 = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

var debug = createCommonjsModule(function (module, exports) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = index$7;

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}
});

var browser = createCommonjsModule(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
});

var node = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */




/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * The file descriptor to write the `debug()` calls to.
 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
 *
 *   $ DEBUG_FD=3 node script.js 3>debug.log
 */

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

if (1 !== fd && 2 !== fd) {
  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')();
}

var stream$$1 = 1 === fd ? process.stdout :
             2 === fd ? process.stderr :
             createWritableStdioStream(fd);

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .replace(/\s*\n\s*/g, ' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = new Date().toUTCString()
      + ' ' + name + ' ' + args[0];
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to `stream`.
 */

function log() {
  return stream$$1.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Copied from `node/src/node.js`.
 *
 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
 */

function createWritableStdioStream (fd) {
  var stream$$1;
  var tty_wrap = process.binding('tty_wrap');

  // Note stream._type is used for test-module-load-list.js

  switch (tty_wrap.guessHandleType(fd)) {
    case 'TTY':
      stream$$1 = new tty.WriteStream(fd);
      stream$$1._type = 'tty';

      // Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream$$1._handle && stream$$1._handle.unref) {
        stream$$1._handle.unref();
      }
      break;

    case 'FILE':
      var fs$$1 = fs;
      stream$$1 = new fs$$1.SyncWriteStream(fd, { autoClose: false });
      stream$$1._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      var net$$1 = net;
      stream$$1 = new net$$1.Socket({
        fd: fd,
        readable: false,
        writable: true
      });

      // FIXME Should probably have an option in net.Socket to create a
      // stream from an existing fd which is writable only. But for now
      // we'll just add this hack and set the `readable` member to false.
      // Test: ./node test/fixtures/echo.js < /etc/passwd
      stream$$1.readable = false;
      stream$$1.read = null;
      stream$$1._type = 'pipe';

      // FIXME Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream$$1._handle && stream$$1._handle.unref) {
        stream$$1._handle.unref();
      }
      break;

    default:
      // Probably an error on in uv_guess_handle()
      throw new Error('Implement me. Unknown stream file type!');
  }

  // For supporting legacy API we put the FD here.
  stream$$1.fd = fd;

  stream$$1._isStdio = true;

  return stream$$1;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug$$2) {
  debug$$2.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug$$2.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());
});

var index$5 = createCommonjsModule(function (module) {
/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  module.exports = browser;
} else {
  module.exports = node;
}
});

var index$3 = createCommonjsModule(function (module) {
'use strict';




var Writable = stream.Writable;
var debug = index$5('follow-redirects');

var nativeProtocols = {'http:': http, 'https:': https};
var schemes = {};
var exports = module.exports = {
	maxRedirects: 21
};
// RFC7231§4.2.1: Of the request methods defined by this specification,
// the GET, HEAD, OPTIONS, and TRACE methods are defined to be safe.
var safeMethods = {GET: true, HEAD: true, OPTIONS: true, TRACE: true};

// Create handlers that pass events from native requests
var eventHandlers = Object.create(null);
['abort', 'aborted', 'error', 'socket'].forEach(function (event) {
	eventHandlers[event] = function (arg) {
		this._redirectable.emit(event, arg);
	};
});

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
	// Initialize the request
	Writable.call(this);
	this._options = options;
	this._redirectCount = 0;
	this._bufferedWrites = [];

	// Attach a callback if passed
	if (responseCallback) {
		this.on('response', responseCallback);
	}

	// React to responses of native requests
	var self = this;
	this._onNativeResponse = function (response) {
		self._processResponse(response);
	};

	// Complete the URL object when necessary
	if (!options.pathname && options.path) {
		var searchPos = options.path.indexOf('?');
		if (searchPos < 0) {
			options.pathname = options.path;
		} else {
			options.pathname = options.path.substring(0, searchPos);
			options.search = options.path.substring(searchPos);
		}
	}

	// Perform the first request
	this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
	// If specified, use the agent corresponding to the protocol
	// (HTTP and HTTPS use different types of agents)
	var protocol = this._options.protocol;
	if (this._options.agents) {
		this._options.agent = this._options.agents[schemes[protocol]];
	}

	// Create the native request
	var nativeProtocol = nativeProtocols[protocol];
	var request = this._currentRequest =
				nativeProtocol.request(this._options, this._onNativeResponse);
	this._currentUrl = url.format(this._options);

	// Set up event handlers
	request._redirectable = this;
	for (var event in eventHandlers) {
		/* istanbul ignore else */
		if (event) {
			request.on(event, eventHandlers[event]);
		}
	}

	// End a redirected request
	// (The first request must be ended explicitly with RedirectableRequest#end)
	if (this._isRedirect) {
		// If the request doesn't have en entity, end directly.
		var bufferedWrites = this._bufferedWrites;
		if (bufferedWrites.length === 0) {
			request.end();
		// Otherwise, write the request entity and end afterwards.
		} else {
			var i = 0;
			(function writeNext() {
				if (i < bufferedWrites.length) {
					var bufferedWrite = bufferedWrites[i++];
					request.write(bufferedWrite.data, bufferedWrite.encoding, writeNext);
				} else {
					request.end();
				}
			})();
		}
	}
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
	// RFC7231§6.4: The 3xx (Redirection) class of status code indicates
	// that further action needs to be taken by the user agent in order to
	// fulfill the request. If a Location header field is provided,
	// the user agent MAY automatically redirect its request to the URI
	// referenced by the Location field value,
	// even if the specific status code is not understood.
	var location = response.headers.location;
	if (location && this._options.followRedirects !== false &&
			response.statusCode >= 300 && response.statusCode < 400) {
		// RFC7231§6.4: A client SHOULD detect and intervene
		// in cyclical redirections (i.e., "infinite" redirection loops).
		if (++this._redirectCount > this._options.maxRedirects) {
			return this.emit('error', new Error('Max redirects exceeded.'));
		}

		// RFC7231§6.4: Automatic redirection needs to done with
		// care for methods not known to be safe […],
		// since the user might not wish to redirect an unsafe request.
		// RFC7231§6.4.7: The 307 (Temporary Redirect) status code indicates
		// that the target resource resides temporarily under a different URI
		// and the user agent MUST NOT change the request method
		// if it performs an automatic redirection to that URI.
		var header;
		var headers = this._options.headers;
		if (response.statusCode !== 307 && !(this._options.method in safeMethods)) {
			this._options.method = 'GET';
			// Drop a possible entity and headers related to it
			this._bufferedWrites = [];
			for (header in headers) {
				if (/^content-/i.test(header)) {
					delete headers[header];
				}
			}
		}

		// Drop the Host header, as the redirect might lead to a different host
		if (!this._isRedirect) {
			for (header in headers) {
				if (/^host$/i.test(header)) {
					delete headers[header];
				}
			}
		}

		// Perform the redirected request
		var redirectUrl = url.resolve(this._currentUrl, location);
		debug('redirecting to', redirectUrl);
		Object.assign(this._options, url.parse(redirectUrl));
		this._isRedirect = true;
		this._performRequest();
	} else {
		// The response is not a redirect; return it as-is
		response.responseUrl = this._currentUrl;
		this.emit('response', response);

		// Clean up
		delete this._options;
		delete this._bufferedWrites;
	}
};

// Aborts the current native request
RedirectableRequest.prototype.abort = function () {
	this._currentRequest.abort();
};

// Flushes the headers of the current native request
RedirectableRequest.prototype.flushHeaders = function () {
	this._currentRequest.flushHeaders();
};

// Sets the noDelay option of the current native request
RedirectableRequest.prototype.setNoDelay = function (noDelay) {
	this._currentRequest.setNoDelay(noDelay);
};

// Sets the socketKeepAlive option of the current native request
RedirectableRequest.prototype.setSocketKeepAlive = function (enable, initialDelay) {
	this._currentRequest.setSocketKeepAlive(enable, initialDelay);
};

// Sets the timeout option of the current native request
RedirectableRequest.prototype.setTimeout = function (timeout, callback) {
	this._currentRequest.setTimeout(timeout, callback);
};

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
	this._currentRequest.write(data, encoding, callback);
	this._bufferedWrites.push({data: data, encoding: encoding});
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
	this._currentRequest.end(data, encoding, callback);
	if (data) {
		this._bufferedWrites.push({data: data, encoding: encoding});
	}
};

// Export a redirecting wrapper for each native protocol
Object.keys(nativeProtocols).forEach(function (protocol) {
	var scheme = schemes[protocol] = protocol.substr(0, protocol.length - 1);
	var nativeProtocol = nativeProtocols[protocol];
	var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

	// Executes an HTTP request, following redirects
	wrappedProtocol.request = function (options, callback) {
		if (typeof options === 'string') {
			options = url.parse(options);
			options.maxRedirects = exports.maxRedirects;
		} else {
			options = Object.assign({
				maxRedirects: exports.maxRedirects,
				protocol: protocol
			}, options);
		}
		assert.equal(options.protocol, protocol, 'protocol mismatch');
		debug('options', options);

		return new RedirectableRequest(options, callback);
	};

	// Executes a GET request, following redirects
	wrappedProtocol.get = function (options, callback) {
		var request = wrappedProtocol.request(options, callback);
		request.end();
		return request;
	};
});
});

var _args = [[{"raw":"axios@^0.16.2","scope":null,"escapedName":"axios","name":"axios","rawSpec":"^0.16.2","spec":">=0.16.2 <0.17.0","type":"range"},"/Users/mitchrobb/Dev/veritone/veritone-api"]];
var _from = "axios@>=0.16.2 <0.17.0";
var _id = "axios@0.16.2";
var _inCache = true;
var _location = "/axios";
var _nodeVersion = "6.10.1";
var _npmOperationalInternal = {"host":"s3://npm-registry-packages","tmp":"tmp/axios-0.16.2.tgz_1496518163672_0.8309127793181688"};
var _npmUser = {"name":"nickuraltsev","email":"nick.uraltsev@gmail.com"};
var _npmVersion = "3.10.10";
var _phantomChildren = {};
var _requested = {"raw":"axios@^0.16.2","scope":null,"escapedName":"axios","name":"axios","rawSpec":"^0.16.2","spec":">=0.16.2 <0.17.0","type":"range"};
var _requiredBy = ["/"];
var _resolved = "https://registry.npmjs.org/axios/-/axios-0.16.2.tgz";
var _shasum = "ba4f92f17167dfbab40983785454b9ac149c3c6d";
var _shrinkwrap = null;
var _spec = "axios@^0.16.2";
var _where = "/Users/mitchrobb/Dev/veritone/veritone-api";
var author = {"name":"Matt Zabriskie"};
var browser$2 = {"./lib/adapters/http.js":"./lib/adapters/xhr.js"};
var bugs = {"url":"https://github.com/mzabriskie/axios/issues"};
var dependencies = {"follow-redirects":"^1.2.3","is-buffer":"^1.1.5"};
var description = "Promise based HTTP client for the browser and node.js";
var devDependencies = {"coveralls":"^2.11.9","es6-promise":"^4.0.5","grunt":"^1.0.1","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.0.0","grunt-contrib-nodeunit":"^1.0.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^19.0.0","grunt-karma":"^2.0.0","grunt-ts":"^6.0.0-beta.3","grunt-webpack":"^1.0.18","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^1.3.0","karma-chrome-launcher":"^2.0.0","karma-coverage":"^1.0.0","karma-firefox-launcher":"^1.0.0","karma-jasmine":"^1.0.2","karma-jasmine-ajax":"^0.1.13","karma-opera-launcher":"^1.0.0","karma-phantomjs-launcher":"^1.0.0","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^1.1.0","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.7","karma-webpack":"^1.7.0","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","phantomjs-prebuilt":"^2.1.7","sinon":"^1.17.4","typescript":"^2.0.3","url-search-params":"^0.6.1","webpack":"^1.13.1","webpack-dev-server":"^1.14.1"};
var directories = {};
var dist = {"shasum":"ba4f92f17167dfbab40983785454b9ac149c3c6d","tarball":"https://registry.npmjs.org/axios/-/axios-0.16.2.tgz"};
var gitHead = "46e275c407f81c44dd9aad419b6e861d8a936580";
var homepage = "https://github.com/mzabriskie/axios";
var keywords = ["xhr","http","ajax","promise","node"];
var license = "MIT";
var main = "index.js";
var maintainers = [{"name":"mzabriskie","email":"mzabriskie@gmail.com"},{"name":"nickuraltsev","email":"nick.uraltsev@gmail.com"}];
var name = "axios";
var optionalDependencies = {};
var readme = "ERROR: No README data found!";
var repository = {"type":"git","url":"git+https://github.com/mzabriskie/axios.git"};
var scripts = {"build":"NODE_ENV=production grunt build","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","examples":"node ./examples/server.js","postversion":"git push && git push --tags","preversion":"npm test","start":"node ./sandbox/server.js","test":"grunt test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"};
var typings = "./index.d.ts";
var version = "0.16.2";
var _package = {
	_args: _args,
	_from: _from,
	_id: _id,
	_inCache: _inCache,
	_location: _location,
	_nodeVersion: _nodeVersion,
	_npmOperationalInternal: _npmOperationalInternal,
	_npmUser: _npmUser,
	_npmVersion: _npmVersion,
	_phantomChildren: _phantomChildren,
	_requested: _requested,
	_requiredBy: _requiredBy,
	_resolved: _resolved,
	_shasum: _shasum,
	_shrinkwrap: _shrinkwrap,
	_spec: _spec,
	_where: _where,
	author: author,
	browser: browser$2,
	bugs: bugs,
	dependencies: dependencies,
	description: description,
	devDependencies: devDependencies,
	directories: directories,
	dist: dist,
	gitHead: gitHead,
	homepage: homepage,
	keywords: keywords,
	license: license,
	main: main,
	maintainers: maintainers,
	name: name,
	optionalDependencies: optionalDependencies,
	readme: readme,
	repository: repository,
	scripts: scripts,
	typings: typings,
	version: version
};

var _package$1 = Object.freeze({
	_args: _args,
	_from: _from,
	_id: _id,
	_inCache: _inCache,
	_location: _location,
	_nodeVersion: _nodeVersion,
	_npmOperationalInternal: _npmOperationalInternal,
	_npmUser: _npmUser,
	_npmVersion: _npmVersion,
	_phantomChildren: _phantomChildren,
	_requested: _requested,
	_requiredBy: _requiredBy,
	_resolved: _resolved,
	_shasum: _shasum,
	_shrinkwrap: _shrinkwrap,
	_spec: _spec,
	_where: _where,
	author: author,
	browser: browser$2,
	bugs: bugs,
	dependencies: dependencies,
	description: description,
	devDependencies: devDependencies,
	directories: directories,
	dist: dist,
	gitHead: gitHead,
	homepage: homepage,
	keywords: keywords,
	license: license,
	main: main,
	maintainers: maintainers,
	name: name,
	optionalDependencies: optionalDependencies,
	readme: readme,
	repository: repository,
	scripts: scripts,
	typings: typings,
	version: version,
	default: _package
});

var pkg = ( _package$1 && _package ) || _package$1;

var httpFollow = index$3.http;
var httpsFollow = index$3.https;






/*eslint consistent-return:0*/
var http_1 = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolve, reject) {
    var data = config.data;
    var headers = config.headers;
    var timer;
    var aborted = false;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/mzabriskie/axios/issues/69
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = new Buffer(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = new Buffer(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var parsed = url.parse(config.url);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttps = protocol === 'https:';
    var agent = isHttps ? config.httpsAgent : config.httpAgent;

    var options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method,
      headers: headers,
      agent: agent,
      auth: auth
    };

    var proxy = config.proxy;
    if (!proxy) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        proxy = {
          host: parsedProxyUrl.hostname,
          port: parsedProxyUrl.port
        };

        if (parsedProxyUrl.auth) {
          var proxyUrlAuth = parsedProxyUrl.auth.split(':');
          proxy.auth = {
            username: proxyUrlAuth[0],
            password: proxyUrlAuth[1]
          };
        }
      }
    }

    if (proxy) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      options.port = proxy.port;
      options.path = protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path;

      // Basic proxy authorization
      if (proxy.auth) {
        var base64 = new Buffer(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }
    }

    var transport;
    if (config.maxRedirects === 0) {
      transport = isHttps ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttps ? httpsFollow : httpFollow;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (aborted) return;

      // Response has been received so kill timer that handles request timeout
      clearTimeout(timer);
      timer = null;

      // uncompress the response body transparently if required
      var stream$$1 = res;
      switch (res.headers['content-encoding']) {
      /*eslint default-case:0*/
      case 'gzip':
      case 'compress':
      case 'deflate':
        // add the unzipper to the body stream processing pipeline
        stream$$1 = stream$$1.pipe(zlib.createUnzip());

        // remove the content-encoding in order to not confuse downstream operations
        delete res.headers['content-encoding'];
        break;
      }

      // return the last request in case of redirects
      var lastRequest = res.req || req;

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream$$1;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        stream$$1.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream$$1.on('error', function handleStreamError(err) {
          if (aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream$$1.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString('utf8');
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (aborted) return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout && !timer) {
      timer = setTimeout(function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
        aborted = true;
      }, config.timeout);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (aborted) {
          return;
        }

        req.abort();
        reject(cancel);
        aborted = true;
      });
    }

    // Send the request
    if (utils.isStream(data)) {
      data.pipe(req);
    } else {
      req.end(data);
    }
  });
};

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = xhr;
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = http_1;
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

var defaults_1 = defaults;

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

var InterceptorManager_1 = InterceptorManager;

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
var transformData = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

var isCancel = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
var dispatchRequest = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults_1.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
var isAbsoluteURL = function isAbsoluteURL(url$$1) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url$$1);
};

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
var combineURLs = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager_1(),
    response: new InterceptorManager_1()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults_1, this.defaults, { method: 'get' }, config);
  config.method = config.method.toLowerCase();

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url$$1, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url$$1
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url$$1, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url$$1,
      data: data
    }));
  };
});

var Axios_1 = Axios;

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

var Cancel_1 = Cancel;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel_1(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

var CancelToken_1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
var spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios_1(defaultConfig);
  var instance = bind(Axios_1.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios_1.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios$1 = createInstance(defaults_1);

// Expose Axios class to allow class inheritance
axios$1.Axios = Axios_1;

// Factory for creating new instances
axios$1.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults_1, instanceConfig));
};

// Expose Cancel & CancelToken
axios$1.Cancel = Cancel_1;
axios$1.CancelToken = CancelToken_1;
axios$1.isCancel = isCancel;

// Expose all/spread
axios$1.all = function all(promises) {
  return Promise.all(promises);
};
axios$1.spread = spread;

var axios_1 = axios$1;

// Allow use of default import syntax in TypeScript
var default_1 = axios$1;

axios_1.default = default_1;

var index = axios_1;

var validate = createCommonjsModule(function (module, exports) {
/*!
 * validate.js 0.10.0
 *
 * (c) 2013-2016 Nicklas Ansman, 2013 Wrapp
 * Validate.js may be freely distributed under the MIT license.
 * For all details and documentation:
 * http://validatejs.org/
 */

(function(exports, module, define) {
  "use strict";

  // The main function that calls the validators specified by the constraints.
  // The options are the following:
  //   - format (string) - An option that controls how the returned value is formatted
  //     * flat - Returns a flat array of just the error messages
  //     * grouped - Returns the messages grouped by attribute (default)
  //     * detailed - Returns an array of the raw validation data
  //   - fullMessages (boolean) - If `true` (default) the attribute name is prepended to the error.
  //
  // Please note that the options are also passed to each validator.
  var validate = function(attributes, constraints, options) {
    options = v.extend({}, v.options, options);

    var results = v.runValidations(attributes, constraints, options)
      , attr
      , validator;

    for (attr in results) {
      for (validator in results[attr]) {
        if (v.isPromise(results[attr][validator])) {
          throw new Error("Use validate.async if you want support for promises");
        }
      }
    }
    return validate.processValidationResults(results, options);
  };

  var v = validate;

  // Copies over attributes from one or more sources to a single destination.
  // Very much similar to underscore's extend.
  // The first argument is the target object and the remaining arguments will be
  // used as sources.
  v.extend = function(obj) {
    [].slice.call(arguments, 1).forEach(function(source) {
      for (var attr in source) {
        obj[attr] = source[attr];
      }
    });
    return obj;
  };

  v.extend(validate, {
    // This is the version of the library as a semver.
    // The toString function will allow it to be coerced into a string
    version: {
      major: 0,
      minor: 10,
      patch: 0,
      metadata: null,
      toString: function() {
        var version = v.format("%{major}.%{minor}.%{patch}", v.version);
        if (!v.isEmpty(v.version.metadata)) {
          version += "+" + v.version.metadata;
        }
        return version;
      }
    },

    // Below is the dependencies that are used in validate.js

    // The constructor of the Promise implementation.
    // If you are using Q.js, RSVP or any other A+ compatible implementation
    // override this attribute to be the constructor of that promise.
    // Since jQuery promises aren't A+ compatible they won't work.
    Promise: typeof Promise !== "undefined" ? Promise : /* istanbul ignore next */ null,

    EMPTY_STRING_REGEXP: /^\s*$/,

    // Runs the validators specified by the constraints object.
    // Will return an array of the format:
    //     [{attribute: "<attribute name>", error: "<validation result>"}, ...]
    runValidations: function(attributes, constraints, options) {
      var results = []
        , attr
        , validatorName
        , value
        , validators
        , validator
        , validatorOptions
        , error;

      if (v.isDomElement(attributes) || v.isJqueryElement(attributes)) {
        attributes = v.collectFormValues(attributes);
      }

      // Loops through each constraints, finds the correct validator and run it.
      for (attr in constraints) {
        value = v.getDeepObjectValue(attributes, attr);
        // This allows the constraints for an attribute to be a function.
        // The function will be called with the value, attribute name, the complete dict of
        // attributes as well as the options and constraints passed in.
        // This is useful when you want to have different
        // validations depending on the attribute value.
        validators = v.result(constraints[attr], value, attributes, attr, options, constraints);

        for (validatorName in validators) {
          validator = v.validators[validatorName];

          if (!validator) {
            error = v.format("Unknown validator %{name}", {name: validatorName});
            throw new Error(error);
          }

          validatorOptions = validators[validatorName];
          // This allows the options to be a function. The function will be
          // called with the value, attribute name, the complete dict of
          // attributes as well as the options and constraints passed in.
          // This is useful when you want to have different
          // validations depending on the attribute value.
          validatorOptions = v.result(validatorOptions, value, attributes, attr, options, constraints);
          if (!validatorOptions) {
            continue;
          }
          results.push({
            attribute: attr,
            value: value,
            validator: validatorName,
            globalOptions: options,
            attributes: attributes,
            options: validatorOptions,
            error: validator.call(validator,
                value,
                validatorOptions,
                attr,
                attributes,
                options)
          });
        }
      }

      return results;
    },

    // Takes the output from runValidations and converts it to the correct
    // output format.
    processValidationResults: function(errors, options) {
      var attr;

      errors = v.pruneEmptyErrors(errors, options);
      errors = v.expandMultipleErrors(errors, options);
      errors = v.convertErrorMessages(errors, options);

      switch (options.format || "grouped") {
        case "detailed":
          // Do nothing more to the errors
          break;

        case "flat":
          errors = v.flattenErrorsToArray(errors);
          break;

        case "grouped":
          errors = v.groupErrorsByAttribute(errors);
          for (attr in errors) {
            errors[attr] = v.flattenErrorsToArray(errors[attr]);
          }
          break;

        default:
          throw new Error(v.format("Unknown format %{format}", options));
      }

      return v.isEmpty(errors) ? undefined : errors;
    },

    // Runs the validations with support for promises.
    // This function will return a promise that is settled when all the
    // validation promises have been completed.
    // It can be called even if no validations returned a promise.
    async: function(attributes, constraints, options) {
      options = v.extend({}, v.async.options, options);

      var WrapErrors = options.wrapErrors || function(errors) {
        return errors;
      };

      // Removes unknown attributes
      if (options.cleanAttributes !== false) {
        attributes = v.cleanAttributes(attributes, constraints);
      }

      var results = v.runValidations(attributes, constraints, options);

      return new v.Promise(function(resolve, reject) {
        v.waitForResults(results).then(function() {
          var errors = v.processValidationResults(results, options);
          if (errors) {
            reject(new WrapErrors(errors, options, attributes, constraints));
          } else {
            resolve(attributes);
          }
        }, function(err) {
          reject(err);
        });
      });
    },

    single: function(value, constraints, options) {
      options = v.extend({}, v.single.options, options, {
        format: "flat",
        fullMessages: false
      });
      return v({single: value}, {single: constraints}, options);
    },

    // Returns a promise that is resolved when all promises in the results array
    // are settled. The promise returned from this function is always resolved,
    // never rejected.
    // This function modifies the input argument, it replaces the promises
    // with the value returned from the promise.
    waitForResults: function(results) {
      // Create a sequence of all the results starting with a resolved promise.
      return results.reduce(function(memo, result) {
        // If this result isn't a promise skip it in the sequence.
        if (!v.isPromise(result.error)) {
          return memo;
        }

        return memo.then(function() {
          return result.error.then(
            function(error) {
              result.error = error || null;
            },
            function(error) {
              if (error instanceof Error) {
                throw error;
              }
              v.error("Rejecting promises with the result is deprecated. Please use the resolve callback instead.");
              result.error = error;
            }
          );
        });
      }, new v.Promise(function(r) { r(); })); // A resolved promise
    },

    // If the given argument is a call: function the and: function return the value
    // otherwise just return the value. Additional arguments will be passed as
    // arguments to the function.
    // Example:
    // ```
    // result('foo') // 'foo'
    // result(Math.max, 1, 2) // 2
    // ```
    result: function(value) {
      var args = [].slice.call(arguments, 1);
      if (typeof value === 'function') {
        value = value.apply(null, args);
      }
      return value;
    },

    // Checks if the value is a number. This function does not consider NaN a
    // number like many other `isNumber` functions do.
    isNumber: function(value) {
      return typeof value === 'number' && !isNaN(value);
    },

    // Returns false if the object is not a function
    isFunction: function(value) {
      return typeof value === 'function';
    },

    // A simple check to verify that the value is an integer. Uses `isNumber`
    // and a simple modulo check.
    isInteger: function(value) {
      return v.isNumber(value) && value % 1 === 0;
    },

    // Checks if the value is a boolean
    isBoolean: function(value) {
      return typeof value === 'boolean';
    },

    // Uses the `Object` function to check if the given argument is an object.
    isObject: function(obj) {
      return obj === Object(obj);
    },

    // Simply checks if the object is an instance of a date
    isDate: function(obj) {
      return obj instanceof Date;
    },

    // Returns false if the object is `null` of `undefined`
    isDefined: function(obj) {
      return obj !== null && obj !== undefined;
    },

    // Checks if the given argument is a promise. Anything with a `then`
    // function is considered a promise.
    isPromise: function(p) {
      return !!p && v.isFunction(p.then);
    },

    isJqueryElement: function(o) {
      return o && v.isString(o.jquery);
    },

    isDomElement: function(o) {
      if (!o) {
        return false;
      }

      if (!o.querySelectorAll || !o.querySelector) {
        return false;
      }

      if (v.isObject(document) && o === document) {
        return true;
      }

      // http://stackoverflow.com/a/384380/699304
      /* istanbul ignore else */
      if (typeof HTMLElement === "object") {
        return o instanceof HTMLElement;
      } else {
        return o &&
          typeof o === "object" &&
          o !== null &&
          o.nodeType === 1 &&
          typeof o.nodeName === "string";
      }
    },

    isEmpty: function(value) {
      var attr;

      // Null and undefined are empty
      if (!v.isDefined(value)) {
        return true;
      }

      // functions are non empty
      if (v.isFunction(value)) {
        return false;
      }

      // Whitespace only strings are empty
      if (v.isString(value)) {
        return v.EMPTY_STRING_REGEXP.test(value);
      }

      // For arrays we use the length property
      if (v.isArray(value)) {
        return value.length === 0;
      }

      // Dates have no attributes but aren't empty
      if (v.isDate(value)) {
        return false;
      }

      // If we find at least one property we consider it non empty
      if (v.isObject(value)) {
        for (attr in value) {
          return false;
        }
        return true;
      }

      return false;
    },

    // Formats the specified strings with the given values like so:
    // ```
    // format("Foo: %{foo}", {foo: "bar"}) // "Foo bar"
    // ```
    // If you want to write %{...} without having it replaced simply
    // prefix it with % like this `Foo: %%{foo}` and it will be returned
    // as `"Foo: %{foo}"`
    format: v.extend(function(str, vals) {
      if (!v.isString(str)) {
        return str;
      }
      return str.replace(v.format.FORMAT_REGEXP, function(m0, m1, m2) {
        if (m1 === '%') {
          return "%{" + m2 + "}";
        } else {
          return String(vals[m2]);
        }
      });
    }, {
      // Finds %{key} style patterns in the given string
      FORMAT_REGEXP: /(%?)%\{([^\}]+)\}/g
    }),

    // "Prettifies" the given string.
    // Prettifying means replacing [.\_-] with spaces as well as splitting
    // camel case words.
    prettify: function(str) {
      if (v.isNumber(str)) {
        // If there are more than 2 decimals round it to two
        if ((str * 100) % 1 === 0) {
          return "" + str;
        } else {
          return parseFloat(Math.round(str * 100) / 100).toFixed(2);
        }
      }

      if (v.isArray(str)) {
        return str.map(function(s) { return v.prettify(s); }).join(", ");
      }

      if (v.isObject(str)) {
        return str.toString();
      }

      // Ensure the string is actually a string
      str = "" + str;

      return str
        // Splits keys separated by periods
        .replace(/([^\s])\.([^\s])/g, '$1 $2')
        // Removes backslashes
        .replace(/\\+/g, '')
        // Replaces - and - with space
        .replace(/[_-]/g, ' ')
        // Splits camel cased words
        .replace(/([a-z])([A-Z])/g, function(m0, m1, m2) {
          return "" + m1 + " " + m2.toLowerCase();
        })
        .toLowerCase();
    },

    stringifyValue: function(value) {
      return v.prettify(value);
    },

    isString: function(value) {
      return typeof value === 'string';
    },

    isArray: function(value) {
      return {}.toString.call(value) === '[object Array]';
    },

    // Checks if the object is a hash, which is equivalent to an object that
    // is neither an array nor a function.
    isHash: function(value) {
      return v.isObject(value) && !v.isArray(value) && !v.isFunction(value);
    },

    contains: function(obj, value) {
      if (!v.isDefined(obj)) {
        return false;
      }
      if (v.isArray(obj)) {
        return obj.indexOf(value) !== -1;
      }
      return value in obj;
    },

    unique: function(array) {
      if (!v.isArray(array)) {
        return array;
      }
      return array.filter(function(el, index, array) {
        return array.indexOf(el) == index;
      });
    },

    forEachKeyInKeypath: function(object, keypath, callback) {
      if (!v.isString(keypath)) {
        return undefined;
      }

      var key = ""
        , i
        , escape = false;

      for (i = 0; i < keypath.length; ++i) {
        switch (keypath[i]) {
          case '.':
            if (escape) {
              escape = false;
              key += '.';
            } else {
              object = callback(object, key, false);
              key = "";
            }
            break;

          case '\\':
            if (escape) {
              escape = false;
              key += '\\';
            } else {
              escape = true;
            }
            break;

          default:
            escape = false;
            key += keypath[i];
            break;
        }
      }

      return callback(object, key, true);
    },

    getDeepObjectValue: function(obj, keypath) {
      if (!v.isObject(obj)) {
        return undefined;
      }

      return v.forEachKeyInKeypath(obj, keypath, function(obj, key) {
        if (v.isObject(obj)) {
          return obj[key];
        }
      });
    },

    // This returns an object with all the values of the form.
    // It uses the input name as key and the value as value
    // So for example this:
    // <input type="text" name="email" value="foo@bar.com" />
    // would return:
    // {email: "foo@bar.com"}
    collectFormValues: function(form, options) {
      var values = {}
        , i
        , input
        , inputs
        , value;

      if (v.isJqueryElement(form)) {
        form = form[0];
      }

      if (!form) {
        return values;
      }

      options = options || {};

      inputs = form.querySelectorAll("input[name], textarea[name]");
      for (i = 0; i < inputs.length; ++i) {
        input = inputs.item(i);

        if (v.isDefined(input.getAttribute("data-ignored"))) {
          continue;
        }

        value = v.sanitizeFormValue(input.value, options);
        if (input.type === "number") {
          value = value ? +value : null;
        } else if (input.type === "checkbox") {
          if (input.attributes.value) {
            if (!input.checked) {
              value = values[input.name] || null;
            }
          } else {
            value = input.checked;
          }
        } else if (input.type === "radio") {
          if (!input.checked) {
            value = values[input.name] || null;
          }
        }
        values[input.name] = value;
      }

      inputs = form.querySelectorAll("select[name]");
      for (i = 0; i < inputs.length; ++i) {
        input = inputs.item(i);
        value = v.sanitizeFormValue(input.options[input.selectedIndex].value, options);
        values[input.name] = value;
      }

      return values;
    },

    sanitizeFormValue: function(value, options) {
      if (options.trim && v.isString(value)) {
        value = value.trim();
      }

      if (options.nullify !== false && value === "") {
        return null;
      }
      return value;
    },

    capitalize: function(str) {
      if (!v.isString(str)) {
        return str;
      }
      return str[0].toUpperCase() + str.slice(1);
    },

    // Remove all errors who's error attribute is empty (null or undefined)
    pruneEmptyErrors: function(errors) {
      return errors.filter(function(error) {
        return !v.isEmpty(error.error);
      });
    },

    // In
    // [{error: ["err1", "err2"], ...}]
    // Out
    // [{error: "err1", ...}, {error: "err2", ...}]
    //
    // All attributes in an error with multiple messages are duplicated
    // when expanding the errors.
    expandMultipleErrors: function(errors) {
      var ret = [];
      errors.forEach(function(error) {
        // Removes errors without a message
        if (v.isArray(error.error)) {
          error.error.forEach(function(msg) {
            ret.push(v.extend({}, error, {error: msg}));
          });
        } else {
          ret.push(error);
        }
      });
      return ret;
    },

    // Converts the error mesages by prepending the attribute name unless the
    // message is prefixed by ^
    convertErrorMessages: function(errors, options) {
      options = options || {};

      var ret = [];
      errors.forEach(function(errorInfo) {
        var error = v.result(errorInfo.error,
            errorInfo.value,
            errorInfo.attribute,
            errorInfo.options,
            errorInfo.attributes,
            errorInfo.globalOptions);

        if (!v.isString(error)) {
          ret.push(errorInfo);
          return;
        }

        if (error[0] === '^') {
          error = error.slice(1);
        } else if (options.fullMessages !== false) {
          error = v.capitalize(v.prettify(errorInfo.attribute)) + " " + error;
        }
        error = error.replace(/\\\^/g, "^");
        error = v.format(error, {value: v.stringifyValue(errorInfo.value)});
        ret.push(v.extend({}, errorInfo, {error: error}));
      });
      return ret;
    },

    // In:
    // [{attribute: "<attributeName>", ...}]
    // Out:
    // {"<attributeName>": [{attribute: "<attributeName>", ...}]}
    groupErrorsByAttribute: function(errors) {
      var ret = {};
      errors.forEach(function(error) {
        var list = ret[error.attribute];
        if (list) {
          list.push(error);
        } else {
          ret[error.attribute] = [error];
        }
      });
      return ret;
    },

    // In:
    // [{error: "<message 1>", ...}, {error: "<message 2>", ...}]
    // Out:
    // ["<message 1>", "<message 2>"]
    flattenErrorsToArray: function(errors) {
      return errors.map(function(error) { return error.error; });
    },

    cleanAttributes: function(attributes, whitelist) {
      function whitelistCreator(obj, key, last) {
        if (v.isObject(obj[key])) {
          return obj[key];
        }
        return (obj[key] = last ? true : {});
      }

      function buildObjectWhitelist(whitelist) {
        var ow = {}
          , lastObject
          , attr;
        for (attr in whitelist) {
          if (!whitelist[attr]) {
            continue;
          }
          v.forEachKeyInKeypath(ow, attr, whitelistCreator);
        }
        return ow;
      }

      function cleanRecursive(attributes, whitelist) {
        if (!v.isObject(attributes)) {
          return attributes;
        }

        var ret = v.extend({}, attributes)
          , w
          , attribute;

        for (attribute in attributes) {
          w = whitelist[attribute];

          if (v.isObject(w)) {
            ret[attribute] = cleanRecursive(ret[attribute], w);
          } else if (!w) {
            delete ret[attribute];
          }
        }
        return ret;
      }

      if (!v.isObject(whitelist) || !v.isObject(attributes)) {
        return {};
      }

      whitelist = buildObjectWhitelist(whitelist);
      return cleanRecursive(attributes, whitelist);
    },

    exposeModule: function(validate, root, exports, module, define) {
      if (exports) {
        if (module && module.exports) {
          exports = module.exports = validate;
        }
        exports.validate = validate;
      } else {
        root.validate = validate;
        if (validate.isFunction(define) && define.amd) {
          define([], function () { return validate; });
        }
      }
    },

    warn: function(msg) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("[validate.js] " + msg);
      }
    },

    error: function(msg) {
      if (typeof console !== "undefined" && console.error) {
        console.error("[validate.js] " + msg);
      }
    }
  });

  validate.validators = {
    // Presence validates that the value isn't empty
    presence: function(value, options) {
      options = v.extend({}, this.options, options);
      if (v.isEmpty(value)) {
        return options.message || this.message || "can't be blank";
      }
    },
    length: function(value, options, attribute) {
      // Empty values are allowed
      if (v.isEmpty(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var is = options.is
        , maximum = options.maximum
        , minimum = options.minimum
        , tokenizer = options.tokenizer || function(val) { return val; }
        , err
        , errors = [];

      value = tokenizer(value);
      var length = value.length;
      if(!v.isNumber(length)) {
        v.error(v.format("Attribute %{attr} has a non numeric value for `length`", {attr: attribute}));
        return options.message || this.notValid || "has an incorrect length";
      }

      // Is checks
      if (v.isNumber(is) && length !== is) {
        err = options.wrongLength ||
          this.wrongLength ||
          "is the wrong length (should be %{count} characters)";
        errors.push(v.format(err, {count: is}));
      }

      if (v.isNumber(minimum) && length < minimum) {
        err = options.tooShort ||
          this.tooShort ||
          "is too short (minimum is %{count} characters)";
        errors.push(v.format(err, {count: minimum}));
      }

      if (v.isNumber(maximum) && length > maximum) {
        err = options.tooLong ||
          this.tooLong ||
          "is too long (maximum is %{count} characters)";
        errors.push(v.format(err, {count: maximum}));
      }

      if (errors.length > 0) {
        return options.message || errors;
      }
    },
    numericality: function(value, options) {
      // Empty values are fine
      if (v.isEmpty(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var errors = []
        , name
        , count
        , checks = {
            greaterThan:          function(v, c) { return v > c; },
            greaterThanOrEqualTo: function(v, c) { return v >= c; },
            equalTo:              function(v, c) { return v === c; },
            lessThan:             function(v, c) { return v < c; },
            lessThanOrEqualTo:    function(v, c) { return v <= c; },
            divisibleBy:          function(v, c) { return v % c === 0; }
          };

      // Strict will check that it is a valid looking number
      if (v.isString(value) && options.strict) {
        var pattern = "^(0|[1-9]\\d*)";
        if (!options.onlyInteger) {
          pattern += "(\\.\\d+)?";
        }
        pattern += "$";

        if (!(new RegExp(pattern).test(value))) {
          return options.message || options.notValid || this.notValid || "must be a valid number";
        }
      }

      // Coerce the value to a number unless we're being strict.
      if (options.noStrings !== true && v.isString(value)) {
        value = +value;
      }

      // If it's not a number we shouldn't continue since it will compare it.
      if (!v.isNumber(value)) {
        return options.message || options.notValid || this.notValid || "is not a number";
      }

      // Same logic as above, sort of. Don't bother with comparisons if this
      // doesn't pass.
      if (options.onlyInteger && !v.isInteger(value)) {
        return options.message || options.notInteger || this.notInteger  || "must be an integer";
      }

      for (name in checks) {
        count = options[name];
        if (v.isNumber(count) && !checks[name](value, count)) {
          // This picks the default message if specified
          // For example the greaterThan check uses the message from
          // this.notGreaterThan so we capitalize the name and prepend "not"
          var key = "not" + v.capitalize(name);
          var msg = options[key] || this[key] || "must be %{type} %{count}";

          errors.push(v.format(msg, {
            count: count,
            type: v.prettify(name)
          }));
        }
      }

      if (options.odd && value % 2 !== 1) {
        errors.push(options.notOdd || this.notOdd || "must be odd");
      }
      if (options.even && value % 2 !== 0) {
        errors.push(options.notEven || this.notEven || "must be even");
      }

      if (errors.length) {
        return options.message || errors;
      }
    },
    datetime: v.extend(function(value, options) {
      if (!v.isFunction(this.parse) || !v.isFunction(this.format)) {
        throw new Error("Both the parse and format functions needs to be set to use the datetime/date validator");
      }

      // Empty values are fine
      if (v.isEmpty(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var err
        , errors = []
        , earliest = options.earliest ? this.parse(options.earliest, options) : NaN
        , latest = options.latest ? this.parse(options.latest, options) : NaN;

      value = this.parse(value, options);

      // 86400000 is the number of seconds in a day, this is used to remove
      // the time from the date
      if (isNaN(value) || options.dateOnly && value % 86400000 !== 0) {
        err = options.notValid ||
          options.message ||
          this.notValid ||
          "must be a valid date";
        return v.format(err, {value: arguments[0]});
      }

      if (!isNaN(earliest) && value < earliest) {
        err = options.tooEarly ||
          options.message ||
          this.tooEarly ||
          "must be no earlier than %{date}";
        err = v.format(err, {
          value: this.format(value, options),
          date: this.format(earliest, options)
        });
        errors.push(err);
      }

      if (!isNaN(latest) && value > latest) {
        err = options.tooLate ||
          options.message ||
          this.tooLate ||
          "must be no later than %{date}";
        err = v.format(err, {
          date: this.format(latest, options),
          value: this.format(value, options)
        });
        errors.push(err);
      }

      if (errors.length) {
        return v.unique(errors);
      }
    }, {
      parse: null,
      format: null
    }),
    date: function(value, options) {
      options = v.extend({}, options, {dateOnly: true});
      return v.validators.datetime.call(v.validators.datetime, value, options);
    },
    format: function(value, options) {
      if (v.isString(options) || (options instanceof RegExp)) {
        options = {pattern: options};
      }

      options = v.extend({}, this.options, options);

      var message = options.message || this.message || "is invalid"
        , pattern = options.pattern
        , match;

      // Empty values are allowed
      if (v.isEmpty(value)) {
        return;
      }
      if (!v.isString(value)) {
        return message;
      }

      if (v.isString(pattern)) {
        pattern = new RegExp(options.pattern, options.flags);
      }
      match = pattern.exec(value);
      if (!match || match[0].length != value.length) {
        return message;
      }
    },
    inclusion: function(value, options) {
      // Empty values are fine
      if (v.isEmpty(value)) {
        return;
      }
      if (v.isArray(options)) {
        options = {within: options};
      }
      options = v.extend({}, this.options, options);
      if (v.contains(options.within, value)) {
        return;
      }
      var message = options.message ||
        this.message ||
        "^%{value} is not included in the list";
      return v.format(message, {value: value});
    },
    exclusion: function(value, options) {
      // Empty values are fine
      if (v.isEmpty(value)) {
        return;
      }
      if (v.isArray(options)) {
        options = {within: options};
      }
      options = v.extend({}, this.options, options);
      if (!v.contains(options.within, value)) {
        return;
      }
      var message = options.message || this.message || "^%{value} is restricted";
      return v.format(message, {value: value});
    },
    email: v.extend(function(value, options) {
      options = v.extend({}, this.options, options);
      var message = options.message || this.message || "is not a valid email";
      // Empty values are fine
      if (v.isEmpty(value)) {
        return;
      }
      if (!v.isString(value)) {
        return message;
      }
      if (!this.PATTERN.exec(value)) {
        return message;
      }
    }, {
      PATTERN: /^[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i
    }),
    equality: function(value, options, attribute, attributes) {
      if (v.isEmpty(value)) {
        return;
      }

      if (v.isString(options)) {
        options = {attribute: options};
      }
      options = v.extend({}, this.options, options);
      var message = options.message ||
        this.message ||
        "is not equal to %{attribute}";

      if (v.isEmpty(options.attribute) || !v.isString(options.attribute)) {
        throw new Error("The attribute must be a non empty string");
      }

      var otherValue = v.getDeepObjectValue(attributes, options.attribute)
        , comparator = options.comparator || function(v1, v2) {
          return v1 === v2;
        };

      if (!comparator(value, otherValue, options, attribute, attributes)) {
        return v.format(message, {attribute: v.prettify(options.attribute)});
      }
    },

    // A URL validator that is used to validate URLs with the ability to
    // restrict schemes and some domains.
    url: function(value, options) {
      if (v.isEmpty(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var message = options.message || this.message || "is not a valid url"
        , schemes = options.schemes || this.schemes || ['http', 'https']
        , allowLocal = options.allowLocal || this.allowLocal || false;

      if (!v.isString(value)) {
        return message;
      }

      // https://gist.github.com/dperini/729294
      var regex =
        "^" +
          // schemes
          "(?:(?:" + schemes.join("|") + "):\\/\\/)" +
          // credentials
          "(?:\\S+(?::\\S*)?@)?";

      regex += "(?:";

      var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";

      // This ia a special case for the localhost hostname
      if (allowLocal) {
        tld += "?";
      } else {
        // private & local addresses
        regex +=
          "(?!10(?:\\.\\d{1,3}){3})" +
          "(?!127(?:\\.\\d{1,3}){3})" +
          "(?!169\\.254(?:\\.\\d{1,3}){2})" +
          "(?!192\\.168(?:\\.\\d{1,3}){2})" +
          "(?!172" +
          "\\.(?:1[6-9]|2\\d|3[0-1])" +
          "(?:\\.\\d{1,3})" +
          "{2})";
      }

      var hostname =
          "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
          "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
          tld + ")";

      // reserved addresses
      regex +=
          "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
          "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
          "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
          hostname +
          // port number
          "(?::\\d{2,5})?" +
          // path
          "(?:\\/[^\\s]*)?" +
        "$";

      var PATTERN = new RegExp(regex, 'i');
      if (!PATTERN.exec(value)) {
        return message;
      }
    }
  };

  validate.exposeModule(validate, this, exports, module, define);
}).call(commonjsGlobal,
        exports,
        module,
        typeof undefined !== 'undefined' ? /* istanbul ignore next */ undefined : null);
});

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

var noop_1 = noop;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject$1;

var slice_1 = createCommonjsModule(function (module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = slice;
function slice(arrayLike, start) {
    start = start | 0;
    var newLen = Math.max(arrayLike.length - start, 0);
    var newArr = Array(newLen);
    for (var idx = 0; idx < newLen; idx++) {
        newArr[idx] = arrayLike[start + idx];
    }
    return newArr;
}
module.exports = exports["default"];
});

var initialParams = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (fn) {
    return function () /*...args, callback*/{
        var args = (0, _slice2.default)(arguments);
        var callback = args.pop();
        fn.call(this, args, callback);
    };
};



var _slice2 = _interopRequireDefault(slice_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
});

var setImmediate_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasNextTick = exports.hasSetImmediate = undefined;
exports.fallback = fallback;
exports.wrap = wrap;



var _slice2 = _interopRequireDefault(slice_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasSetImmediate = exports.hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
var hasNextTick = exports.hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

function fallback(fn) {
    setTimeout(fn, 0);
}

function wrap(defer) {
    return function (fn /*, ...args*/) {
        var args = (0, _slice2.default)(arguments, 1);
        defer(function () {
            fn.apply(null, args);
        });
    };
}

var _defer;

if (hasSetImmediate) {
    _defer = setImmediate;
} else if (hasNextTick) {
    _defer = process.nextTick;
} else {
    _defer = fallback;
}

exports.default = wrap(_defer);
});

var asyncify_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = asyncify;



var _isObject2 = _interopRequireDefault(isObject_1);



var _initialParams2 = _interopRequireDefault(initialParams);



var _setImmediate2 = _interopRequireDefault(setImmediate_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Take a sync function and make it async, passing its return value to a
 * callback. This is useful for plugging sync functions into a waterfall,
 * series, or other async functions. Any arguments passed to the generated
 * function will be passed to the wrapped function (except for the final
 * callback argument). Errors thrown will be passed to the callback.
 *
 * If the function passed to `asyncify` returns a Promise, that promises's
 * resolved/rejected state will be used to call the callback, rather than simply
 * the synchronous return value.
 *
 * This also means you can asyncify ES2017 `async` functions.
 *
 * @name asyncify
 * @static
 * @memberOf module:Utils
 * @method
 * @alias wrapSync
 * @category Util
 * @param {Function} func - The synchronous function, or Promise-returning
 * function to convert to an {@link AsyncFunction}.
 * @returns {AsyncFunction} An asynchronous wrapper of the `func`. To be
 * invoked with `(args..., callback)`.
 * @example
 *
 * // passing a regular synchronous function
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(JSON.parse),
 *     function (data, next) {
 *         // data is the result of parsing the text.
 *         // If there was a parsing error, it would have been caught.
 *     }
 * ], callback);
 *
 * // passing a function returning a promise
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(function (contents) {
 *         return db.model.create(contents);
 *     }),
 *     function (model, next) {
 *         // `model` is the instantiated model object.
 *         // If there was an error, this function would be skipped.
 *     }
 * ], callback);
 *
 * // es2017 example, though `asyncify` is not needed if your JS environment
 * // supports async functions out of the box
 * var q = async.queue(async.asyncify(async function(file) {
 *     var intermediateStep = await processFile(file);
 *     return await somePromise(intermediateStep)
 * }));
 *
 * q.push(files);
 */
function asyncify(func) {
    return (0, _initialParams2.default)(function (args, callback) {
        var result;
        try {
            result = func.apply(this, args);
        } catch (e) {
            return callback(e);
        }
        // if result is Promise object
        if ((0, _isObject2.default)(result) && typeof result.then === 'function') {
            result.then(function (value) {
                invokeCallback(callback, null, value);
            }, function (err) {
                invokeCallback(callback, err.message ? err : new Error(err));
            });
        } else {
            callback(null, result);
        }
    });
}

function invokeCallback(callback, error, value) {
    try {
        callback(error, value);
    } catch (e) {
        (0, _setImmediate2.default)(rethrow, e);
    }
}

function rethrow(error) {
    throw error;
}
module.exports = exports['default'];
});

var wrapAsync_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isAsync = undefined;



var _asyncify2 = _interopRequireDefault(asyncify_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var supportsSymbol = typeof Symbol === 'function';

function isAsync(fn) {
    return supportsSymbol && fn[Symbol.toStringTag] === 'AsyncFunction';
}

function wrapAsync(asyncFn) {
    return isAsync(asyncFn) ? (0, _asyncify2.default)(asyncFn) : asyncFn;
}

exports.default = wrapAsync;
exports.isAsync = isAsync;
});

var retry_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = retry;



var _noop2 = _interopRequireDefault(noop_1);



var _constant2 = _interopRequireDefault(constant_1);



var _wrapAsync2 = _interopRequireDefault(wrapAsync_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Attempts to get a successful response from `task` no more than `times` times
 * before returning an error. If the task is successful, the `callback` will be
 * passed the result of the successful task. If all attempts fail, the callback
 * will be passed the error and result (if any) of the final attempt.
 *
 * @name retry
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @see [async.retryable]{@link module:ControlFlow.retryable}
 * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
 * object with `times` and `interval` or a number.
 * * `times` - The number of attempts to make before giving up.  The default
 *   is `5`.
 * * `interval` - The time to wait between retries, in milliseconds.  The
 *   default is `0`. The interval may also be specified as a function of the
 *   retry count (see example).
 * * `errorFilter` - An optional synchronous function that is invoked on
 *   erroneous result. If it returns `true` the retry attempts will continue;
 *   if the function returns `false` the retry flow is aborted with the current
 *   attempt's error and result being returned to the final callback.
 *   Invoked with (err).
 * * If `opts` is a number, the number specifies the number of times to retry,
 *   with the default interval of `0`.
 * @param {AsyncFunction} task - An async function to retry.
 * Invoked with (callback).
 * @param {Function} [callback] - An optional callback which is called when the
 * task has succeeded, or after the final failed attempt. It receives the `err`
 * and `result` arguments of the last attempt at completing the `task`. Invoked
 * with (err, results).
 *
 * @example
 *
 * // The `retry` function can be used as a stand-alone control flow by passing
 * // a callback, as shown below:
 *
 * // try calling apiMethod 3 times
 * async.retry(3, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod 3 times, waiting 200 ms between each retry
 * async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod 10 times with exponential backoff
 * // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
 * async.retry({
 *   times: 10,
 *   interval: function(retryCount) {
 *     return 50 * Math.pow(2, retryCount);
 *   }
 * }, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod the default 5 times no delay between each retry
 * async.retry(apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod only when error condition satisfies, all other
 * // errors will abort the retry control flow and return to final callback
 * async.retry({
 *   errorFilter: function(err) {
 *     return err.message === 'Temporary error'; // only retry on a specific error
 *   }
 * }, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // It can also be embedded within other control flow functions to retry
 * // individual methods that are not as reliable, like this:
 * async.auto({
 *     users: api.getUsers.bind(api),
 *     payments: async.retryable(3, api.getPayments.bind(api))
 * }, function(err, results) {
 *     // do something with the results
 * });
 *
 */
function retry(opts, task, callback) {
    var DEFAULT_TIMES = 5;
    var DEFAULT_INTERVAL = 0;

    var options = {
        times: DEFAULT_TIMES,
        intervalFunc: (0, _constant2.default)(DEFAULT_INTERVAL)
    };

    function parseTimes(acc, t) {
        if (typeof t === 'object') {
            acc.times = +t.times || DEFAULT_TIMES;

            acc.intervalFunc = typeof t.interval === 'function' ? t.interval : (0, _constant2.default)(+t.interval || DEFAULT_INTERVAL);

            acc.errorFilter = t.errorFilter;
        } else if (typeof t === 'number' || typeof t === 'string') {
            acc.times = +t || DEFAULT_TIMES;
        } else {
            throw new Error("Invalid arguments for async.retry");
        }
    }

    if (arguments.length < 3 && typeof opts === 'function') {
        callback = task || _noop2.default;
        task = opts;
    } else {
        parseTimes(options, opts);
        callback = callback || _noop2.default;
    }

    if (typeof task !== 'function') {
        throw new Error("Invalid arguments for async.retry");
    }

    var _task = (0, _wrapAsync2.default)(task);

    var attempt = 1;
    function retryAttempt() {
        _task(function (err) {
            if (err && attempt++ < options.times && (typeof options.errorFilter != 'function' || options.errorFilter(err))) {
                setTimeout(retryAttempt, options.intervalFunc(attempt));
            } else {
                callback.apply(null, arguments);
            }
        });
    }

    retryAttempt();
}
module.exports = exports['default'];
});

var asyncRetry = unwrapExports(retry_1);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function RetryHelper() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var finalOptions = _extends({
		maxRetries: 1,
		retryIntervalMs: 50
	}, options);

	var constraints = {
		maxRetries: {
			numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
		},
		retryIntervalMs: {
			numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
		}
	};

	var errors = validate(finalOptions, constraints);
	if (errors) {
		throw new Error(Object.values(errors)[0]);
	}

	this._maxRetries = finalOptions.maxRetries;
	this._retryIntervalMs = finalOptions.retryIntervalMs;
}

RetryHelper.prototype.retry = function retry(task, callback) {
	if (typeof task !== 'function') {
		throw new Error('task is required!');
	}
	if (typeof callback !== 'function') {
		throw new Error('callback is required!');
	}

	asyncRetry({ times: this._maxRetries, interval: this._retryIntervalMs }, task, callback);
};

function mapObject(obj, fn) {
	var result = {};

	Object.keys(obj).forEach(function (k) {
		result[k] = fn(obj[k], k, obj);
	});

	return result;
}

function last() {
	var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	return array[array.length - 1];
}

function noop$1() {}

function callApi(
// base options provided by API client
_ref,
// handler returning a request object
handlerFn) {
	var token = _ref.token,
	    baseUrl = _ref.baseUrl,
	    _ref$maxRetries = _ref.maxRetries,
	    maxRetries = _ref$maxRetries === undefined ? 1 : _ref$maxRetries,
	    _ref$retryIntervalMs = _ref.retryIntervalMs,
	    retryIntervalMs = _ref$retryIntervalMs === undefined ? 1000 : _ref$retryIntervalMs;

	validateAuthToken(token);
	validateBaseUrl(baseUrl);
	validateHandlerFn(handlerFn);

	if (handlerFn.isNonStandard) {
		// non-standard APIs don't use callApi()'s request wrapper, so
		// they handle their own request/response, retries, callbacks, etc.
		// used for streaming requests, requests that read/write from
		// the filesystem, etc.
		// all they need is the handler options.
		return handlerFn.bind(null, {
			token: token,
			baseUrl: baseUrl,
			maxRetries: maxRetries,
			retryIntervalMs: retryIntervalMs
		});
	}

	return function apiRequest() {
		// figure out arg signature; one of:
		// ...handlerFnArgs, requestOptionOverrides, cb
		// ...handlerFnArgs, cb
		// ...handlerFnArgs, requestOptionOverrides
		var requestOptionOverrides = {};
		var callback = noop$1;
		var matchedRequestArgs = 0;

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

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

		var request = handlerFn.apply(undefined, toConsumableArray(args.slice(0, args.length - matchedRequestArgs)));
		validateRequestObject(request);

		var method = request.method,
		    path = request.path,
		    data = request.data,
		    query = request.query,
		    headers = request.headers,
		    _request$_requestOpti = request._requestOptions,
		    _requestOptions = _request$_requestOpti === undefined ? {} : _request$_requestOpti;

		validateRequestOptions(_requestOptions);

		var options = _extends({
			validateStatus: function validateStatus(status) {
				return status >= 200 && status < 300;
			},
			withCredentials: true,
			maxRetries: maxRetries,
			retryIntervalMs: retryIntervalMs
		}, _requestOptions, requestOptionOverrides);

		var retryHelper = new RetryHelper({
			maxRetries: options.maxRetries,
			retryIntervalMs: options.retryIntervalMs
		});

		return new Promise(function (resolve, reject) {
			retryHelper.retry(function (cb) {
				index.request({
					method: method,
					data: data,
					url: path,
					params: query,
					headers: _extends({
						Authorization: 'Bearer ' + token
					}, headers, options.headers),
					baseURL: baseUrl,
					timeout: options.timeoutMs,
					validateStatus: options.validateStatus
				}).then(function (rawResponse) {
					var response = _extends({}, rawResponse, {
						data: options.transformResponseData ? options.transformResponseData(rawResponse.data) : rawResponse.data
					});

					cb(null, response);
				}, function (err) {
					cb(err);
				});
			}, function (err, res) {
				// provide dual promise/cb interface to callers
				if (err) {
					reject(err);
					return callback(err);
				}

				resolve(res.data); // todo: a way to give the promise raw res?
				callback(null, res.data, res);
			});
		});
	};
}

function validateAuthToken(token) {
	if (typeof token !== 'string') {
		throw new Error('callApi requires an api token');
	}
}

function validateBaseUrl(url$$1) {
	if (!(url$$1.startsWith('http://') || url$$1.startsWith('https://'))) {
		throw new Error('expected ' + url$$1 + ' to include http(s) protocol');
	}
}

function validateHandlerFn(fn) {
	if (typeof fn !== 'function') {
		throw new Error('expected ' + fn + ' to be a handler function');
	}
}

function validateRequestObject(obj) {
	var validKeys = ['method', 'path', 'data', 'query', 'headers', '_requestOptions'];

	Object.keys(obj).forEach(function (key) {
		if (!validKeys.includes(key)) {
			throw new Error('unexpected key in request object: ' + key + '. Supported keys are: ' + JSON.stringify(validKeys));
		}
	});
}

var supportedOptions = ['maxRetries', 'retryIntervalMs', 'withCredentials', 'timeoutMs', 'headers', 'transformResponseData', 'validateStatus'
// 'cancelToken',
// onUploadProgress,
// onDownloadProgress,
];

function isRequestOptionsObj() {
	var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	return Object.keys(obj).length && Object.keys(obj).every(function (opt) {
		return supportedOptions.includes(opt);
	});
}

function validateRequestOptions(options) {
	Object.keys(options).forEach(function (opt) {
		if (!supportedOptions.includes(opt)) {
			throw new Error('unexpected requestOption: ' + opt + '. Supported options are: ' + JSON.stringify(supportedOptions));
		}
	});

	var constraints = {
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
		}
	};

	var errors = validate(options, constraints);
	if (errors) {
		throw new Error(Object.values(errors)[0]);
	}

	if (options.headers !== undefined && options.headers !== null && _typeof(options.headers) !== 'object') {
		throw new Error('requestOptions.headers should be an object. got: ' + options.headers + '.');
	}

	if (options.transformResponseData && typeof options.transformResponseData !== 'function') {
		throw new Error('requestOptions.transformResponseData should be a function. got: ' + options.transformResponseData);
	}
}

function veritoneApi(_ref) {
	var token = _ref.token,
	    _ref$baseUrl = _ref.baseUrl,
	    baseUrl = _ref$baseUrl === undefined ? 'https://api.veritone.com' : _ref$baseUrl,
	    _ref$version = _ref.version,
	    version = _ref$version === undefined ? 1 : _ref$version,
	    _ref$maxRetries = _ref.maxRetries,
	    maxRetries = _ref$maxRetries === undefined ? 1 : _ref$maxRetries,
	    _ref$retryIntervalMs = _ref.retryIntervalMs,
	    retryIntervalMs = _ref$retryIntervalMs === undefined ? 1000 : _ref$retryIntervalMs;
	var apis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	if (!token) {
		throw new Error('Token is required');
	}

	return mapObject(apis, function (ns) {
		return mapObject(ns, function (handler) {
			return callApi({
				token: token,
				baseUrl: baseUrl + '/v' + version,
				maxRetries: maxRetries,
				retryIntervalMs: retryIntervalMs
			}, handler);
		});
	});
}

var endpoints = {
	application: '/application',
	collection: '/collection',
	collectionFolders: '/folder',
	metrics: '/metrics',
	mention: '/mention',
	widget: '/widget',
	dropboxWatcher: '/watcher/dropbox',
	recording: '/recording',
	faceset: '/face-recognition/faceset',
	tasksByRecording: '/recording/tasks',
	recordingFolders: '/recording/folder',
	taskTypeByJob: '/job/task_type',
	job: '/job',
	engine: '/engine',
	search: '/search',
	//reports:  '/report',
	batch: '/batch',
	//transcript:  '/transcript',
	ingestion: '/ingestion',
	libraries: '/media'
};

var headers = {
	metadataHeader: 'X-Veritone-Metadata',
	applicationIdHeader: 'X-Veritone-Application-Id'
};

var batch = {
	batch: function batch(requests) {
		return {
			method: 'post',
			path: endpoints.batch,
			data: requests
		};
	}
};

var collection = {
	createCollection: function createCollection(collection) {
		return {
			method: 'post',
			path: endpoints.collection,
			data: collection
		};
	},
	getCollections: function getCollections() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		return {
			method: 'get',
			path: endpoints.collection,
			query: options
		};
	},
	getCollection: function getCollection(collectionId) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		if (typeof collectionId !== 'string' || collectionId === '') {
			throw new Error('Missing collectionId');
		}

		return {
			method: 'get',
			path: endpoints.collection + '/' + collectionId,
			query: options
		};
	},
	updateCollection: function updateCollection(collectionId, patch) {
		if (typeof collectionId !== 'string' || collectionId === '') {
			throw new Error('Missing collectionId');
		}

		return {
			method: 'put',
			path: endpoints.collection + '/' + collectionId,
			data: patch
		};
	},
	deleteCollection: function deleteCollection(collectionId) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		var ids = Array.isArray(collectionId) ? collectionId.join(',') : collectionId;

		if (typeof ids !== 'string' || ids === '') {
			throw new Error('Missing collectionId');
		}

		options.collectionId = ids;

		return {
			method: 'delete',
			path: endpoints.collection,
			query: options
		};
	},
	shareCollection: function shareCollection(collectionId, share) {
		if (typeof collectionId !== 'string' || collectionId === '') {
			throw new Error('Missing collectionId');
		}

		return {
			method: 'post',
			path: endpoints.collection + '/' + collectionId + '/share',
			data: share
		};
	},
	shareMentionFromCollection: function shareMentionFromCollection(collectionId, mentionId, share) {
		if (typeof collectionId !== 'string' || collectionId === '') {
			throw new Error('Missing collectionId');
		}

		if (typeof mentionId !== 'string' || mentionId === '') {
			throw new Error('Missing mentionId');
		}

		return {
			method: 'post',
			path: endpoints.collection + '/' + collectionId + '/mention/' + mentionId + '/share',
			data: share
		};
	},
	getShare: function getShare(shareId) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		if (typeof shareId !== 'string' || shareId === '') {
			throw new Error('Missing shareId');
		}

		return {
			method: 'get',
			path: endpoints.collection + '/share/' + shareId,
			query: options
		};
	},
	deleteCollectionMention: function deleteCollectionMention(collectionId, mentionId, options) {
		if (typeof collectionId !== 'string' || collectionId === '') {
			throw new Error('Missing collectionId');
		}

		if (typeof mentionId !== 'string' || mentionId === '') {
			throw new Error('Missing mentionId');
		}

		return {
			method: 'delete',
			path: endpoints.collection + '/' + collectionId + '/mention/' + mentionId,
			query: options
		};
	},
	getMetricsForAllCollections: function getMetricsForAllCollections() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		return {
			method: 'get',
			path: endpoints.metrics,
			query: options
		};
	}
};

var dropbox = {
	createDropboxWatcher: function createDropboxWatcher(watcher) {
		return {
			method: 'post',
			path: endpoints.dropboxWatcher,
			data: watcher
		};
	},
	getDropboxWatchers: function getDropboxWatchers(options) {
		if (typeof options === 'string') {
			options = {
				watcherId: options
			};
		} else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
			throw new Error('Missing options!');
		}

		return {
			method: 'get',
			path: endpoints.dropboxWatcher,
			query: options
		};
	},
	getDropboxWatcher: function getDropboxWatcher(watcherId) {
		if (typeof watcherId !== 'string' || watcherId === '') {
			throw new Error('Missing watcherId!');
		}
		return {
			method: 'get',
			path: endpoints.dropboxWatcher + '/' + watcherId
		};
	},
	updateDropboxWatcher: function updateDropboxWatcher(watcher) {
		if ((typeof watcher === 'undefined' ? 'undefined' : _typeof(watcher)) !== 'object') {
			throw new Error('Missing watcher!');
		}
		return {
			method: 'put',
			path: endpoints.dropboxWatcher + '/' + watcher.watcherId,
			data: watcher
		};
	},
	deleteDropboxWatcher: function deleteDropboxWatcher(watcherId) {
		if (typeof watcherId !== 'string' || watcherId === '') {
			throw new Error('Missing watcherId!');
		}

		return {
			method: 'delete',
			path: endpoints.dropboxWatcher + '/' + watcherId
		};
	}
};

var enginePageLimit = 99999; // fixme?

var engine = {
	getEngines: function getEngines() {
		return {
			method: 'get',
			path: endpoints.engine,
			query: {
				limit: enginePageLimit
			}
		};
	},
	getEngineCategories: function getEngineCategories() {
		return {
			method: 'get',
			path: endpoints.engine + '/category',
			query: {
				limit: enginePageLimit
			}
		};
	},
	getEngineUsingRightsFiltered: function getEngineUsingRightsFiltered(engineId) {
		return {
			method: 'get',
			path: endpoints.taskTypeByJob + '/' + engineId
		};
	},
	getEngineCategoriesWithEngines: function getEngineCategoriesWithEngines() {
		return {
			method: 'get',
			path: endpoints.job + '/task_type'
		};
	}
};

var faceset = {
	queryFaceset: function queryFaceset(q) {
		if (typeof q !== 'string' || q === '') {
			throw new Error('Missing query!');
		}

		return {
			method: 'get',
			path: endpoints.faceset + '/autocomplete/' + encodeURIComponent(q)
		};
	},
	createFaceset: function createFaceset(faceset) {
		if ((typeof faceset === 'undefined' ? 'undefined' : _typeof(faceset)) !== 'object') {
			throw new Error('Missing faceset!');
		}
		if (typeof faceset.faceSetId !== 'string') {
			throw new Error('Missing faceSetId!');
		}

		return {
			method: 'post',
			path: endpoints.faceset + '/' + encodeURIComponent(faceset.faceSetId),
			data: faceset
		};
	},
	updateFaceset: function updateFaceset(faceset) {
		if ((typeof faceset === 'undefined' ? 'undefined' : _typeof(faceset)) !== 'object') {
			throw new Error('Missing faceset!');
		}
		if (typeof faceset.faceSetId !== 'string') {
			throw new Error('Missing faceSetId!');
		}

		return {
			method: 'put',
			path: endpoints.faceset + '/' + encodeURIComponent(faceset.faceSetId),
			data: faceset
		};
	}
};

var folder = {
	getRootTreeFolder: function getRootTreeFolder(organizationId, userId, rootFolderType) {
		var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

		if (typeof organizationId !== 'string' || organizationId === '') {
			throw new Error('Missing organizationId');
		}
		if (typeof userId !== 'string' || userId === '') {
			throw new Error('Missing userId');
		}
		if (typeof rootFolderType !== 'string' || rootFolderType === '') {
			throw new Error('Missing rootFolderType');
		}

		return {
			method: 'get',
			path: endpoints.collectionFolders + '/' + organizationId + '/' + userId + '/type/' + rootFolderType,
			query: options
		};
	},
	getTreeObject: function getTreeObject(treeObjectId) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		if (typeof treeObjectId !== 'string' || treeObjectId === '') {
			throw new Error('Missing organizationId');
		}

		return {
			method: 'get',
			path: endpoints.collectionFolders + '/' + treeObjectId,
			query: options
		};
	},
	createTreeFolder: function createTreeFolder(treeFolder) {
		if ((typeof treeFolder === 'undefined' ? 'undefined' : _typeof(treeFolder)) !== 'object') {
			throw new Error('Missing tree folder!');
		}

		return {
			method: 'post',
			path: endpoints.collectionFolders,
			data: treeFolder
		};
	},
	createTreeObject: function createTreeObject(treeObject) {
		if ((typeof treeObject === 'undefined' ? 'undefined' : _typeof(treeObject)) !== 'object') {
			throw new Error('Missing tree object!');
		}

		return {
			method: 'post',
			path: endpoints.collectionFolders + '/object',
			data: treeObject
		};
	},
	moveTreeFolder: function moveTreeFolder(treeObjectId, treeFolderMoveObj) {
		if (typeof treeObjectId !== 'string') {
			throw new Error('Missing tree object id!');
		}
		if ((typeof treeFolderMoveObj === 'undefined' ? 'undefined' : _typeof(treeFolderMoveObj)) !== 'object') {
			throw new Error('Missing tree folder move information!');
		}

		return {
			method: 'put',
			path: endpoints.collectionFolders + '/move/' + treeObjectId,
			data: treeFolderMoveObj
		};
	},
	updateTreeFolder: function updateTreeFolder(treeObjectId, treeFolderObj) {
		if (typeof treeObjectId !== 'string') {
			throw new Error('Missing tree object id!');
		}
		if ((typeof treeFolderObj === 'undefined' ? 'undefined' : _typeof(treeFolderObj)) !== 'object') {
			throw new Error('Missing tree folder information!');
		}

		return {
			method: 'put',
			path: endpoints.collectionFolders + '/' + treeObjectId,
			data: treeFolderObj
		};
	},
	deleteTreeFolder: function deleteTreeFolder(treeObjectId, options) {
		if (typeof treeObjectId !== 'string') {
			throw new Error('Missing tree folder!');
		}

		return {
			method: 'delete',
			path: endpoints.collectionFolders + '/' + treeObjectId,
			query: options
		};
	},
	deleteTreeObject: function deleteTreeObject(treeObjectId, options) {
		if (typeof treeObjectId !== 'string') {
			throw new Error('Missing tree folder!');
		}

		return {
			method: 'delete',
			path: endpoints.collectionFolders + '/object/' + treeObjectId,
			query: options
		};
	},
	searchTreeFolder: function searchTreeFolder(queryTerms) {
		if ((typeof queryTerms === 'undefined' ? 'undefined' : _typeof(queryTerms)) !== 'object') {
			throw new Error('Missing query terms!');
		}

		return {
			method: 'post',
			path: endpoints.collectionFolders + '/search',
			data: queryTerms
		};
	},
	folderSummary: function folderSummary(queryTerms) {
		if ((typeof queryTerms === 'undefined' ? 'undefined' : _typeof(queryTerms)) !== 'object') {
			throw new Error('Missing folder summary terms!');
		}

		return {
			method: 'post',
			path: endpoints.collectionFolders + '/summary',
			data: queryTerms
		};
	}
};

var ingestion = {
	createIngestion: function createIngestion(ingestion) {
		return {
			method: 'post',
			path: endpoints.ingestion,
			data: ingestion
		};
	},
	getIngestions: function getIngestions() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		return {
			method: 'get',
			path: endpoints.ingestion,
			query: options
		};
	},
	getIngestion: function getIngestion(ingestionId) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		if (typeof ingestionId !== 'string' || ingestionId === '') {
			throw new Error('Missing ingestionId');
		}

		return {
			method: 'get',
			path: endpoints.ingestion + '/' + ingestionId,
			query: options
		};
	},
	updateIngestion: function updateIngestion(ingestionId, patch) {
		if (typeof ingestionId !== 'string' || ingestionId === '') {
			throw new Error('Missing ingestionId');
		}

		return {
			method: 'put',
			path: endpoints.ingestion + '/' + ingestionId,
			data: patch
		};
	},
	deleteIngestion: function deleteIngestion(ingestionId, options) {
		if (typeof ingestionId !== 'string' || ingestionId === '') {
			throw new Error('Missing ingestionId');
		}

		return {
			method: 'delete',
			path: endpoints.ingestion + '/' + ingestionId,
			query: options
		};
	},
	ingestionConnect: function ingestionConnect(connectOptions) {
		if (typeof connectOptions === 'undefined') {
			throw new Error('Missing Connect Options');
		}

		return {
			method: 'post',
			path: endpoints.ingestion + '/connect',
			data: connectOptions
		};
	},
	verifyEmailIngestion: function verifyEmailIngestion(emailOptions) {
		if (typeof emailOptions === 'undefined' || (typeof emailOptions === 'undefined' ? 'undefined' : _typeof(emailOptions)) === 'object' && !emailOptions.emailAddress) {
			throw new Error('Missing email address');
		}

		return {
			method: 'post',
			path: endpoints.ingestion + '/verifyEmailIngestion',
			data: emailOptions
		};
	}
};

var job = {
	createJob: function createJob(job) {
		if ((typeof job === 'undefined' ? 'undefined' : _typeof(job)) !== 'object') {
			throw new Error('Missing job!');
		}

		var validation = {
			tasks: {
				presence: true
			}
		};
		var validationErrors = validate(job, validation);
		if (validationErrors) {
			throw new Error('Invalid job object!');
		}

		return {
			method: 'post',
			path: endpoints.job,
			data: job
		};
	},
	getJobs: function getJobs() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    limit = _ref.limit,
		    offset = _ref.offset;

		return {
			method: 'get',
			path: endpoints.job,
			query: { limit: limit, offset: offset }
		};
	},
	getJobsForRecording: function getJobsForRecording(options) {
		if (typeof options === 'string') {
			options = {
				recordingId: options
			};
		} else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
			throw new Error('Missing options!');
		}

		if (typeof options.recordingId !== 'string' || options.recordingId === '') {
			throw new Error('Missing options.recordingId!');
		}

		return {
			method: 'get',
			path: endpoints.job + '/recording/' + options.recordingId,
			query: { offset: options.offset, limit: options.limit }
		};
	},
	getJob: function getJob(jobId) {
		if (typeof jobId !== 'string' || jobId === '') {
			throw new Error('Missing jobId!');
		}

		return {
			method: 'get',
			path: endpoints.job + '/' + jobId
		};
	},
	restartJob: function restartJob(jobId) {
		if (typeof jobId !== 'string' || jobId === '') {
			throw new Error('Missing jobId!');
		}

		return {
			method: 'put',
			path: endpoints.job + '/' + jobId + '/restart'
		};
	},
	retryJob: function retryJob(jobId) {
		if (typeof jobId !== 'string' || jobId === '') {
			throw new Error('Missing jobId!');
		}

		return {
			method: 'put',
			path: endpoints.job + '/' + jobId + '/retry'
		};
	},
	cancelJob: function cancelJob(jobId) {
		if (typeof jobId !== 'string' || jobId === '') {
			throw new Error('Missing jobId!');
		}

		return {
			method: 'delete',
			path: endpoints.job + '/' + jobId
		};
	}
};

var Route = require('route-parser');

function generateHandler(method, path) {
	var availableHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

	if (!method) {
		throw new Error('method is required');
	}

	if (!path) {
		throw new Error('path is required');
	}

	var route = new Route(path);

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

	function generateRequest() {
		var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var payload = arguments[1];

		var requiredRouteParams = route.match(path);
		var headers = {};
		var routeParams = {};
		var queryParams = {};

		// assign params to route and headers and the rest to the query string
		Object.keys(requiredRouteParams).forEach(function (key) {
			if (!params[key]) {
				throw new Error('"' + key + '" param is required');
			}

			routeParams[key] = params[key];
		});

		Object.keys(params).forEach(function (key) {
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

var library = {
	getLibraryTypes: generateHandler('GET', endpoints.libraries + '/library-type'),
	getLibraryType: generateHandler('GET', endpoints.libraries + '/library-type/:libraryTypeId'),
	createLibraryType: generateHandler('POST', endpoints.libraries + '/library-type'),
	updateLibraryType: generateHandler('PUT', endpoints.libraries + '/library-type/:libraryTypeId'),

	getLibraries: generateHandler('GET', endpoints.libraries + '/library'),
	getLibrary: generateHandler('GET', endpoints.libraries + '/library/:libraryId'),
	createLibrary: generateHandler('POST', endpoints.libraries + '/library'),
	updateLibrary: generateHandler('PUT', endpoints.libraries + '/library/:libraryId'),
	deleteLibrary: generateHandler('DELETE', endpoints.libraries + '/library/:libraryId'),
	publishLibraryChanges: generateHandler('POST', endpoints.libraries + '/library/:libraryId/version'),

	getLibraryEngineModels: generateHandler('GET', endpoints.libraries + '/library/:libraryId/engine-model'),
	getLibraryEngineModel: generateHandler('GET', endpoints.libraries + '/library/:libraryId/engine-model/:libraryEngineModelId'),
	createLibraryEngineModel: generateHandler('POST', endpoints.libraries + '/library/:libraryId/engine-model'),
	updateLibraryEngineModel: generateHandler('PUT', endpoints.libraries + '/library/:libraryId/engine-model/:libraryEngineModelId'),
	deleteLibraryEngineModel: generateHandler('DELETE', endpoints.libraries + '/library/:libraryId/engine-model/:libraryEngineModelId'),

	getLibraryCollaborators: generateHandler('GET', endpoints.libraries + '/library/:libraryId/collaborator'),
	getLibraryCollaborator: generateHandler('GET', endpoints.libraries + '/library/:libraryId/collaborator/:collaboratorOrgId'),
	createLibraryCollaborator: generateHandler('POST', endpoints.libraries + '/library/:libraryId/collaborator'),
	updateLibraryCollaborator: generateHandler('PUT', endpoints.libraries + '/library/:libraryId/collaborator/:collaboratorOrgId'),
	deleteLibraryCollaborator: generateHandler('DELETE', endpoints.libraries + '/library/:libraryId/collaborator/:collaboratorOrgId'),

	getEntityIdentifierTypes: generateHandler('GET', endpoints.libraries + '/entity-identifier-type'),
	getEntityIdentifierType: generateHandler('GET', endpoints.libraries + '/entity-identifier-type/:entityIdentifierTypeId'),
	createEntityIdentifierType: generateHandler('POST', endpoints.libraries + '/entity-identifier-type'),
	updateEntityIdentifierType: generateHandler('PUT', endpoints.libraries + '/entity-identifier-type/:entityIdentifierTypeId'),

	getEntities: generateHandler('GET', endpoints.libraries + '/library/:libraryId/entity'),
	getEntity: generateHandler('GET', endpoints.libraries + '/library/:libraryId/entity/:entityId'),
	createEntity: generateHandler('POST', endpoints.libraries + '/library/:libraryId/entity'),
	updateEntity: generateHandler('PUT', endpoints.libraries + '/library/:libraryId/entity/:entityId'),
	uploadEntityProfileImage: generateHandler('POST', '\'' + endpoints.libraries + '/library/:libraryId/entity/:entityId/profile-image', ['Content-Type']),
	deleteEntity: generateHandler('DELETE', endpoints.libraries + '/library/:libraryId/entity/:entityId'),
	entityLookup: generateHandler('POST', endpoints.libraries + '/entity-lookup'),

	getEntityIdentifiers: generateHandler('GET', endpoints.libraries + '/library/:libraryId/entity/:entityId/identifier'),
	getEntityIdentifier: generateHandler('GET', endpoints.libraries + '/library/:libraryId/entity/:entityId/identifier/:entityIdentifierId'),
	createEntityIdentifier: generateHandler('POST', endpoints.libraries + '/library/:libraryId/entity/:entityId/identifier'),
	updateEntityIdentifier: generateHandler('PUT', endpoints.libraries + '/library/:libraryId/entity/:entityId/identifier/:entityIdentifierId'),
	uploadEntityIdentifier: generateHandler('POST', '\'' + endpoints.libraries + '/library/:libraryId/entity/:entityId/identifier/:entityIdentifierTypeId', ['Content-Type']),
	deleteEntityIdentifier: generateHandler('DELETE', '\'' + endpoints.libraries + '/library/:libraryId/entity/:entityId/identifier/:entityIdentifierId')
};

var mention = {
	searchMentions: function searchMentions(options) {
		return {
			method: 'post',
			path: endpoints.mention + '/search',
			data: options
		};
	},
	getMention: function getMention(mentionId, filter) {
		return {
			method: 'get',
			path: endpoints.mention + '/' + mentionId,
			query: filter
		};
	},
	updateMentionSelectively: function updateMentionSelectively(mentionId, mention) {
		return {
			method: 'put',
			path: endpoints.mention + '/' + mentionId,
			data: mention
		};
	},
	createMentionComment: function createMentionComment(mentionId, comment) {
		return {
			method: 'post',
			path: endpoints.mention + '/' + mentionId + '/comment',
			data: comment
		};
	},
	updateMentionComment: function updateMentionComment(mentionId, commentId, comment) {
		return {
			method: 'put',
			path: endpoints.mention + '/' + mentionId + '/comment/' + commentId,
			data: comment
		};
	},
	deleteMentionComment: function deleteMentionComment(mentionId, commentId, comment) {
		return {
			method: 'delete',
			path: endpoints.mention + '/' + mentionId + '/comment/' + commentId,
			query: comment
		};
	},
	createMentionRating: function createMentionRating(mentionId, rating) {
		return {
			method: 'post',
			path: endpoints.mention + '/' + mentionId + '/rating',
			data: rating
		};
	},
	updateMentionRating: function updateMentionRating(mentionId, ratingId, rating) {
		return {
			method: 'put',
			path: endpoints.mention + '/' + mentionId + '/comment/' + ratingId,
			data: rating
		};
	},
	deleteMentionRating: function deleteMentionRating(mentionId, ratingId, rating) {
		return {
			method: 'delete',
			path: endpoints.mention + '/' + mentionId + '/comment/' + ratingId,
			query: rating
		};
	}
};

function validateRecording(recording) {
	if ((typeof recording === 'undefined' ? 'undefined' : _typeof(recording)) !== 'object') {
		throw new Error('Missing recording!');
	}

	var validation = {
		startDateTime: {
			presence: true,
			numericality: {
				onlyInteger: true
			}
		},
		stopDateTime: {
			presence: true,
			numericality: {
				onlyInteger: true,
				greaterThan: recording.startDateTime
			}
		}
	};
	var validationErrors = validate(recording, validation);
	if (validationErrors) {
		throw new Error('Invalid recording object: ' + JSON.stringify(validationErrors));
	}
}

var validate$1 = {
	recording: validateRecording
};

var nonStandardHandlers = ['getRecordingMedia', 'getAsset', 'saveAssetToFile', 'createAsset', 'updateAsset'];

// todo:
// const nodeOnlyHandlers = [
// 	'getRecordingMedia',
// 	'getAsset',
// 	'saveAssetToFile',
// 	'createAsset',
// 	'updateAsset'
// ];

var recordingApi = {
	createRecording: function createRecording(recording) {
		validate$1.recording(recording);

		return {
			method: 'post',
			path: endpoints.recording,
			data: recording
		};
	},
	getRecordings: function getRecordings() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    offset = _ref.offset,
		    limit = _ref.limit;

		return {
			method: 'get',
			path: endpoints.recording,
			query: { offset: offset, limit: limit }
		};
	},
	getRecording: function getRecording(recordingId) {
		if (typeof recordingId !== 'string' && typeof recordingId !== 'number') {
			throw new Error('Missing recordingId!');
		}

		return {
			method: 'get',
			path: endpoints.recording + '/' + recordingId
		};
	},
	updateRecording: function updateRecording(recording) {
		validate$1.recording(recording);

		return {
			method: 'put',
			path: endpoints.recording + '/' + recording.recordingId,
			data: recording
		};
	},
	updateRecordingFolder: function updateRecordingFolder(folder) {
		if ((typeof folder === 'undefined' ? 'undefined' : _typeof(folder)) !== 'object') {
			throw new Error('Missing folder!');
		}
		if (typeof folder.folderId !== 'string' || folder.folderId === '') {
			throw new Error('Missing folder.folderId!');
		}

		return {
			method: 'put',
			path: endpoints.recordingFolders + '/' + folder.folderId,
			data: folder
		};
	},
	updateCms: function updateCms(recordingId) {
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}

		return {
			method: 'put',
			path: endpoints.recording + '/' + recordingId + '/cms'
		};
	},
	deleteRecording: function deleteRecording(recordingId) {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}

		return {
			method: 'delete',
			path: endpoints.recording + '/' + recordingId
		};
	},
	getRecordingTranscript: function getRecordingTranscript(recordingId) {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}

		return {
			method: 'get',
			path: endpoints.recording + '/' + recordingId + '/transcript'
		};
	},
	getRecordingMedia: function getRecordingMedia(_ref2, recordingId, callback, progressCallback) {
		var token = _ref2.token,
		    baseUrl = _ref2.baseUrl,
		    maxRetries = _ref2.maxRetries,
		    retryIntervalMs = _ref2.retryIntervalMs;

		var request = require('request');
		var retryHelper = new RetryHelper({
			maxRetries: maxRetries,
			retryIntervalMs: retryIntervalMs
		});

		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		function task(callback) {
			var progress = {
				total: 0,
				received: 0
			};

			var req = request({
				method: 'GET',
				uri: baseUrl + '/' + endpoints.recording + '/' + recordingId + '/media',
				headers: {
					Authorization: 'Bearer ' + token
				}
			}).on('error', function onError(err) {
				callback(err);
			}).on('response', function onResponse(response) {
				if (response.statusCode !== 200) {
					return callback('Received status: ' + response.statusCode);
				}
				progress.total = parseInt(response.headers['content-length']);
				progress.received = 0;
				if (progressCallback) {
					progressCallback(progress);
				}
				var metadata = response.headers[headers.metadataHeader.toLowerCase()];
				callback(null, {
					contentType: response.headers['content-type'],
					metadata: metadata ? JSON.parse(metadata) : undefined,
					stream: req
				});
			}).on('data', function onData(data) {
				progress.received += data.length;
				if (progressCallback) {
					progressCallback(progress);
				}
			}).on('end', function onEnd() {
				progress.received = progress.total;
				if (progressCallback) {
					progressCallback(progress);
				}
			});
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},
	getRecordingAssets: function getRecordingAssets(recordingId) {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}

		return {
			method: 'get',
			path: endpoints.recording + '/' + recordingId + '/asset'
		};
	},
	getAsset: function getAsset(_ref3, recordingId, assetId, callback, progressCallback) {
		var token = _ref3.token,
		    baseUrl = _ref3.baseUrl,
		    maxRetries = _ref3.maxRetries,
		    retryIntervalMs = _ref3.retryIntervalMs;

		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if (typeof assetId !== 'string' || assetId === '') {
			throw new Error('Missing assetId!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var request = require('request');
		var retryHelper = new RetryHelper({
			maxRetries: maxRetries,
			retryIntervalMs: retryIntervalMs
		});

		function task(callback) {
			var progress = {
				total: 0,
				received: 0
			};

			var req = request({
				method: 'GET',
				uri: baseUrl + '/' + endpoints.recording + '/' + recordingId + '/asset/' + assetId,
				headers: {
					Authorization: 'Bearer ' + token
				}
			}).on('error', function onError(err) {
				callback(err);
			}).on('response', function onResponse(response) {
				if (response.statusCode !== 200) {
					return callback('Received status: ' + response.statusCode);
				}
				progress.total = parseInt(response.headers['content-length']);
				progress.received = 0;
				if (progressCallback) {
					progressCallback(progress);
				}
				var metadata = response.headers[headers.metadataHeader.toLowerCase()];
				callback(null, {
					contentType: response.headers['content-type'],
					metadata: metadata ? JSON.parse(metadata) : undefined,
					stream: req
				});
			}).on('data', function onData(data) {
				progress.received += data.length;
				if (progressCallback) {
					progressCallback(progress);
				}
			}).on('end', function onEnd() {
				progress.received = progress.total;
				if (progressCallback) {
					progressCallback(progress);
				}
			});
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},
	getAssetMetadata: function getAssetMetadata(recordingId, assetId) {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if (typeof assetId !== 'string' || assetId === '') {
			throw new Error('Missing assetId!');
		}

		return {
			method: 'get',
			path: endpoints.recording + '/' + recordingId + '/asset/' + assetId + '/metadata'
		};
	},
	updateAssetMetadata: function updateAssetMetadata(recordingId, asset) {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if ((typeof asset === 'undefined' ? 'undefined' : _typeof(asset)) !== 'object') {
			throw new Error('Missing asset!');
		}
		if (typeof asset.assetId !== 'string' || asset.assetId === '') {
			throw new Error('Missing asset.assetId!');
		}

		return {
			method: 'put',
			path: endpoints.recording + '/' + recordingId + '/asset/' + asset.assetId + '/metadata',
			data: asset.metadata || {}
		};
	},
	saveAssetToFile: function saveAssetToFile(_ref4, recordingId, assetId, fileName, callback, progressCallback) {
		var token = _ref4.token,
		    baseUrl = _ref4.baseUrl,
		    maxRetries = _ref4.maxRetries,
		    retryIntervalMs = _ref4.retryIntervalMs;

		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if (typeof assetId !== 'string' || assetId === '') {
			throw new Error('Missing assetId!');
		}
		if (typeof fileName !== 'string' || fileName === '') {
			throw new Error('Missing fileName!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var fs$$1 = require('fs');

		recordingApi.getAsset({ token: token, baseUrl: baseUrl, maxRetries: maxRetries, retryIntervalMs: retryIntervalMs }, recordingId, assetId, function getAssetCallback(err, result) {
			if (err) {
				return callback(err);
			}
			result.stream.on('end', function onEnd() {
				callback(null, result);
			});
			result.stream.pipe(fs$$1.createWriteStream(fileName));
		}, progressCallback);
	},
	createAsset: function createAsset(_ref5, recordingId, asset, callback) {
		var token = _ref5.token,
		    baseUrl = _ref5.baseUrl,
		    maxRetries = _ref5.maxRetries,
		    retryIntervalMs = _ref5.retryIntervalMs;

		var fs$$1 = require('fs');
		var path = require('path');
		var request = require('request');
		var retryHelper = new RetryHelper({
			maxRetries: maxRetries,
			retryIntervalMs: retryIntervalMs
		});

		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if ((typeof asset === 'undefined' ? 'undefined' : _typeof(asset)) !== 'object') {
			throw new Error('Missing asset!');
		}
		if (typeof asset.fileName !== 'string' && _typeof(asset.stream) !== 'object') {
			throw new Error('Missing asset.fileName or asset.stream!');
		}
		if (asset.fileName && asset.stream) {
			throw new Error('You can specify only asset.fileName or asset.stream!');
		}
		if (typeof asset.assetType !== 'string' || asset.assetType === '') {
			throw new Error('Missing asset.assetType!');
		}
		if (typeof asset.contentType !== 'string' || asset.contentType === '') {
			throw new Error('Missing asset.contentType!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}
		asset.metadata = asset.metadata || {};
		if (asset.fileName) {
			if (!fs$$1.existsSync(asset.fileName)) {
				throw new Error('File "' + asset.fileName + '" does not exist!');
			}

			if (!asset.metadata.fileName) {
				asset.metadata.fileName = path.basename(asset.fileName);
			}
			var stat = fs$$1.statSync(asset.fileName);
			asset.metadata.size = stat.size;
		}
		//console.log(asset);

		var headers$$1 = {
			Authorization: 'Bearer ' + token
		};
		headers$$1['X-Veritone-Asset-Type'] = asset.assetType;
		headers$$1['Content-Type'] = asset.contentType;
		//	This causes things to hang
		//	if (asset.metadata.size) {
		//		headers['Content-Length'] = asset.metadata.size;
		//	}

		var opts = {
			method: 'POST',
			uri: baseUrl + '/' + endpoints.recording + '/' + recordingId + '/asset',
			headers: headers$$1,
			json: true
		};
		if (asset.metadata) {
			opts.headers[headers$$1.metadataHeader] = JSON.stringify(asset.metadata);
		}
		if (asset.applicationId) {
			opts.headers[headers$$1.applicationIdHeader] = asset.applicationId;
		}
		//console.log(opts);
		var stream$$1 = asset.stream || fs$$1.createReadStream(asset.fileName);

		function task(callback) {
			stream$$1.pipe(request(opts, function requestCallback(err, response, body) {
				if (err) {
					return callback(err, body);
				}
				if (response.statusCode !== 200) {
					return callback('Received status: ' + response.statusCode, body);
				}
				callback(null, body);
			}));
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},
	updateAsset: function updateAsset(_ref6, recordingId, asset, callback) {
		var token = _ref6.token,
		    baseUrl = _ref6.baseUrl,
		    maxRetries = _ref6.maxRetries,
		    retryIntervalMs = _ref6.retryIntervalMs;

		var fs$$1 = require('fs');
		var request = require('request');
		var retryHelper = new RetryHelper({
			maxRetries: maxRetries,
			retryIntervalMs: retryIntervalMs
		});

		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if ((typeof asset === 'undefined' ? 'undefined' : _typeof(asset)) !== 'object') {
			throw new Error('Missing asset!');
		}
		if (asset.fileName && !asset.contentType) {
			throw new Error('Missing asset.contentType!');
		}
		if (asset.contentType && !asset.fileName) {
			throw new Error('Missing asset.fileName!');
		}
		if (typeof asset.assetType !== 'string' || asset.assetType === '') {
			throw new Error('Missing asset.assetType!');
		}
		if (!asset.contentType && !asset.fileName && !asset.metadata) {
			throw new Error('Nothing to do!');
		}
		if (!fs$$1.existsSync(asset.fileName)) {
			throw new Error('File "' + asset.fileName + '" does not exist!');
		}
		if (typeof callback !== 'function') {
			throw new Error('Missing callback!');
		}

		var opts = {
			method: 'PUT',
			uri: baseUrl + '/' + endpoints.recording + '/' + recordingId + '/asset/' + asset.assetId,
			headers: {
				Authorization: 'Bearer ' + token
			},
			json: true
		};
		if (asset.fileName) {
			if (!fs$$1.existsSync(asset.fileName)) {
				throw new Error('File "' + asset.fileName + '" does not exist!');
			}
			opts.headers['Content-Type'] = asset.contentType;
			opts.headers['X-Veritone-Asset-Type'] = asset.assetType;
		}
		if (asset.metadata) {
			opts.headers[headers.metadataHeader] = JSON.stringify(asset.metadata);
		}
		if (asset.applicationId) {
			opts.headers[headers.applicationIdHeader] = asset.applicationId;
		}

		function task(callback) {
			var req = request(opts, function requestCallback(err, response, body) {
				if (err) {
					return callback(err, body);
				}
				if (response.statusCode !== 200) {
					return callback('Received status: ' + response.statusCode, body);
				}
				callback(null, body);
			});
			if (asset.fileName) {
				fs$$1.createReadStream(asset.fileName).pipe(req);
			}
		}

		retryHelper.retry(task, function retryCallback(err, body) {
			if (err) {
				return callback(err, body);
			}
			callback(null, body);
		});
	},
	deleteAsset: function deleteAsset(recordingId, assetId) {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}
		if (typeof assetId !== 'string' || assetId === '') {
			throw new Error('Missing assetId!');
		}

		return {
			method: 'delete',
			path: endpoints.recording + '/' + recordingId + '/asset/' + assetId,
			_requestOptions: {
				validateStatus: function validateStatus(s) {
					return s === 204;
				}
			}
		};
	}
};

nonStandardHandlers.forEach(function (name) {
	return recordingApi[name].isNonStandard = true;
});

var search = {
	search: function search(searchRequest) {
		if ((typeof searchRequest === 'undefined' ? 'undefined' : _typeof(searchRequest)) !== 'object') {
			throw new Error('Missing search request!');
		}

		return {
			method: 'post',
			path: endpoints.search,
			data: searchRequest
		};
	}
};

var tasks = {
	updateTask: function updateTask(jobId, taskId, result) {
		if (typeof jobId !== 'string' || jobId === '') {
			throw new Error('Missing jobId!');
		}
		if (typeof taskId !== 'string' || taskId === '') {
			throw new Error('Missing taskId!');
		}
		if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) !== 'object') {
			throw new Error('Missing result!');
		}
		if (typeof result.taskStatus !== 'string' || result.taskStatus === '') {
			throw new Error('Missing result.taskStatus!');
		}
		if (result.taskStatus !== 'running' && result.taskStatus !== 'complete' && result.taskStatus !== 'failed') {
			throw new Error('Invalid task status: ' + result.taskStatus);
		}

		return {
			method: 'put',
			path: endpoints.job + '/' + jobId + '/task/' + taskId,
			data: result
		};
	},
	pollTask: function pollTask(jobId, taskId) {
		var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		if (typeof jobId !== 'string' || jobId === '') {
			throw new Error('Missing jobId!');
		}
		if (typeof taskId !== 'string' || taskId === '') {
			throw new Error('Missing taskId!');
		}

		return {
			method: 'post',
			path: endpoints.job + '/' + jobId + '/task/' + taskId + '/poll',
			data: data
		};
	},
	getTaskSummaryByRecording: function getTaskSummaryByRecording(options) {
		if (typeof options === 'string') {
			options = {
				recordingId: options
			};
		} else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
			throw new Error('Missing options!');
		}

		return {
			method: 'get',
			path: endpoints.tasksByRecording,
			query: options
		};
	}
};

var token = {
	createToken: function createToken(tokenLabel, rights) {
		if (typeof tokenLabel !== 'string' || tokenLabel === '') {
			throw new Error('Missing label!');
		}

		if (!rights || !rights.length) {
			throw new Error('Missing rights!');
		}

		return {
			method: 'post',
			path: endpoints.application + '/token',
			data: { tokenLabel: tokenLabel, rights: rights },
			_requestOptions: {
				validateStatus: function validateStatus(s) {
					return s === 200;
				}
			}
		};
	},
	revokeToken: function revokeToken(token) {
		if (typeof token !== 'string' || token === '') {
			throw new Error('Missing token!');
		}

		return {
			method: 'delete',
			path: endpoints.application + '/token/' + token,
			_requestOptions: {
				validateStatus: function validateStatus(s) {
					return s === 200 || s === 204;
				}
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

var widget = {
	createWidget: function createWidget(collectionId, widget) {
		return {
			method: 'post',
			path: endpoints.collection + '/' + collectionId + '/widget',
			data: widget
		};
	},
	getWidgets: function getWidgets(collectionId) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		if (typeof collectionId !== 'string' || collectionId === '') {
			throw new Error('Missing collectionId');
		}

		return {
			method: 'get',
			path: endpoints.collection + '/' + collectionId + '/widget',
			query: options
		};
	},
	getWidget: function getWidget(widgetId, options) {
		if (typeof widgetId !== 'string' || widgetId === '') {
			throw new Error('Missing widgetId');
		}

		return {
			method: 'get',
			path: endpoints.widget + '/' + widgetId,
			query: options
		};
	},
	updateWidget: function updateWidget(widget) {
		return {
			method: 'put',
			path: endpoints.widget,
			data: widget
		};
	}
};

var apis = {
	batch: batch,
	collection: collection,
	dropbox: dropbox,
	engine: engine,
	faceset: faceset,
	folder: folder,
	ingestion: ingestion,
	job: job,
	library: library,
	mention: mention,
	recording: recordingApi,
	search: search,
	tasks: tasks,
	token: token,
	widget: widget
};

var toStr$2 = Object.prototype.toString;

var isArguments = function isArguments(value) {
	var str = toStr$2.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr$2.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr$1 = Object.prototype.toString;
var slice$1 = Array.prototype.slice;

var isEnumerable = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr$1.call(object) === '[object Function]';
	var isArguments$$1 = isArguments(object);
	var isString = isObject && toStr$1.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments$$1) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments$$1 && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArguments(object)) {
					return originalKeys(slice$1.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

var index$13 = keysShim;

var hasOwn = Object.prototype.hasOwnProperty;
var toString$1 = Object.prototype.toString;

var index$15 = function forEach (obj, fn, ctx) {
    if (toString$1.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};

var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

var toStr = Object.prototype.toString;

var isFunction$1 = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
        /* eslint-disable no-unused-vars, no-restricted-syntax */
        for (var _ in obj) { return false; }
        /* eslint-enable no-unused-vars, no-restricted-syntax */
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty$1 = function (object, name, value, predicate) {
	if (name in object && (!isFunction$1(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = index$13(map);
	if (hasSymbols) {
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	index$15(props, function (name) {
		defineProperty$1(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

var index$11 = defineProperties;

var _isNaN = Number.isNaN || function isNaN(a) {
	return a !== a;
};

var $isNaN = Number.isNaN || function (a) { return a !== a; };

var _isFinite = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };

var has$1 = Object.prototype.hasOwnProperty;
var assign = Object.assign || function assign(target, source) {
	for (var key in source) {
		if (has$1.call(source, key)) {
			target[key] = source[key];
		}
	}
	return target;
};

var sign = function sign(number) {
	return number >= 0 ? 1 : -1;
};

var mod = function mod(number, modulo) {
	var remain = number % modulo;
	return Math.floor(remain >= 0 ? remain : remain + modulo);
};

var isPrimitive = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};

var isPrimitive$2 = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};

var fnToStr = Function.prototype.toString;

var constructorRegex = /^\s*class /;
var isES6ClassFn = function isES6ClassFn(value) {
	try {
		var fnStr = fnToStr.call(value);
		var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
		var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
		var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
		return constructorRegex.test(spaceStripped);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionObject(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr$4 = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

var index$17 = function isCallable(value) {
	if (!value) { return false; }
	if (typeof value !== 'function' && typeof value !== 'object') { return false; }
	if (hasToStringTag) { return tryFunctionObject(value); }
	if (isES6ClassFn(value)) { return false; }
	var strClass = toStr$4.call(value);
	return strClass === fnClass || strClass === genClass;
};

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateObject(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr$5 = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag$1 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

var index$19 = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) { return false; }
	return hasToStringTag$1 ? tryDateObject(value) : toStr$5.call(value) === dateClass;
};

var index$21 = createCommonjsModule(function (module) {
'use strict';

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') { return false; }
		return symStringRegex.test(symToStr.call(value));
	};
	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') { return true; }
		if (toStr.call(value) !== '[object Symbol]') { return false; }
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {
	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return false;
	};
}
});

var hasSymbols$2 = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';






var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
	if (typeof O === 'undefined' || O === null) {
		throw new TypeError('Cannot call method on ' + O);
	}
	if (typeof hint !== 'string' || (hint !== 'number' && hint !== 'string')) {
		throw new TypeError('hint must be "string" or "number"');
	}
	var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
	var method, result, i;
	for (i = 0; i < methodNames.length; ++i) {
		method = O[methodNames[i]];
		if (index$17(method)) {
			result = method.call(O);
			if (isPrimitive$2(result)) {
				return result;
			}
		}
	}
	throw new TypeError('No default value');
};

var GetMethod = function GetMethod(O, P) {
	var func = O[P];
	if (func !== null && typeof func !== 'undefined') {
		if (!index$17(func)) {
			throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
		}
		return func;
	}
};

// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
var es6$2 = function ToPrimitive(input, PreferredType) {
	if (isPrimitive$2(input)) {
		return input;
	}
	var hint = 'default';
	if (arguments.length > 1) {
		if (PreferredType === String) {
			hint = 'string';
		} else if (PreferredType === Number) {
			hint = 'number';
		}
	}

	var exoticToPrim;
	if (hasSymbols$2) {
		if (Symbol.toPrimitive) {
			exoticToPrim = GetMethod(input, Symbol.toPrimitive);
		} else if (index$21(input)) {
			exoticToPrim = Symbol.prototype.valueOf;
		}
	}
	if (typeof exoticToPrim !== 'undefined') {
		var result = exoticToPrim.call(input, hint);
		if (isPrimitive$2(result)) {
			return result;
		}
		throw new TypeError('unable to convert exotic object to primitive');
	}
	if (hint === 'default' && (index$19(input) || index$21(input))) {
		hint = 'string';
	}
	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
};

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice$2 = Array.prototype.slice;
var toStr$6 = Object.prototype.toString;
var funcType = '[object Function]';

var implementation$2 = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr$6.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice$2.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice$2.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice$2.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

var index$23 = Function.prototype.bind || implementation$2;

var toStr$7 = Object.prototype.toString;





// https://es5.github.io/#x8.12
var ES5internalSlots = {
	'[[DefaultValue]]': function (O, hint) {
		var actualHint = hint || (toStr$7.call(O) === '[object Date]' ? String : Number);

		if (actualHint === String || actualHint === Number) {
			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (index$17(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive$2(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// https://es5.github.io/#x9
var es5$2 = function ToPrimitive(input, PreferredType) {
	if (isPrimitive$2(input)) {
		return input;
	}
	return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
};

// https://es5.github.io/#x9
var ES5 = {
	ToPrimitive: es5$2,

	ToBoolean: function ToBoolean(value) {
		return Boolean(value);
	},
	ToNumber: function ToNumber(value) {
		return Number(value);
	},
	ToInteger: function ToInteger(value) {
		var number = this.ToNumber(value);
		if (_isNaN(number)) { return 0; }
		if (number === 0 || !_isFinite(number)) { return number; }
		return sign(number) * Math.floor(Math.abs(number));
	},
	ToInt32: function ToInt32(x) {
		return this.ToNumber(x) >> 0;
	},
	ToUint32: function ToUint32(x) {
		return this.ToNumber(x) >>> 0;
	},
	ToUint16: function ToUint16(value) {
		var number = this.ToNumber(value);
		if (_isNaN(number) || number === 0 || !_isFinite(number)) { return 0; }
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x10000);
	},
	ToString: function ToString(value) {
		return String(value);
	},
	ToObject: function ToObject(value) {
		this.CheckObjectCoercible(value);
		return Object(value);
	},
	CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
		/* jshint eqnull:true */
		if (value == null) {
			throw new TypeError(optMessage || 'Cannot call method on ' + value);
		}
		return value;
	},
	IsCallable: index$17,
	SameValue: function SameValue(x, y) {
		if (x === y) { // 0 === -0, but they are not identical.
			if (x === 0) { return 1 / x === 1 / y; }
			return true;
		}
		return _isNaN(x) && _isNaN(y);
	},

	// http://www.ecma-international.org/ecma-262/5.1/#sec-8
	Type: function Type(x) {
		if (x === null) {
			return 'Null';
		}
		if (typeof x === 'undefined') {
			return 'Undefined';
		}
		if (typeof x === 'function' || typeof x === 'object') {
			return 'Object';
		}
		if (typeof x === 'number') {
			return 'Number';
		}
		if (typeof x === 'boolean') {
			return 'Boolean';
		}
		if (typeof x === 'string') {
			return 'String';
		}
	}
};

var es5 = ES5;

var index$27 = index$23.call(Function.call, Object.prototype.hasOwnProperty);

var regexExec = RegExp.prototype.exec;
var gOPD = Object.getOwnPropertyDescriptor;

var tryRegexExecCall = function tryRegexExec(value) {
	try {
		var lastIndex = value.lastIndex;
		value.lastIndex = 0;

		regexExec.call(value);
		return true;
	} catch (e) {
		return false;
	} finally {
		value.lastIndex = lastIndex;
	}
};
var toStr$8 = Object.prototype.toString;
var regexClass = '[object RegExp]';
var hasToStringTag$2 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

var index$25 = function isRegex(value) {
	if (!value || typeof value !== 'object') {
		return false;
	}
	if (!hasToStringTag$2) {
		return toStr$8.call(value) === regexClass;
	}

	var descriptor = gOPD(value, 'lastIndex');
	var hasLastIndexDataProperty = descriptor && index$27(descriptor, 'value');
	if (!hasLastIndexDataProperty) {
		return false;
	}

	return tryRegexExecCall(value);
};

var toStr$3 = Object.prototype.toString;
var hasSymbols$1 = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';
var symbolToStr = hasSymbols$1 ? Symbol.prototype.toString : toStr$3;



var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;






var parseInteger = parseInt;

var strSlice = index$23.call(Function.call, String.prototype.slice);
var isBinary = index$23.call(Function.call, RegExp.prototype.test, /^0b[01]+$/i);
var isOctal = index$23.call(Function.call, RegExp.prototype.test, /^0o[0-7]+$/i);
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
var hasNonWS = index$23.call(Function.call, RegExp.prototype.test, nonWSregex);
var invalidHexLiteral = /^[-+]0x[0-9a-f]+$/i;
var isInvalidHexLiteral = index$23.call(Function.call, RegExp.prototype.test, invalidHexLiteral);

// whitespace from: http://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = [
	'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
	'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
	'\u2029\uFEFF'
].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var replace = index$23.call(Function.call, String.prototype.replace);
var trim$1 = function (value) {
	return replace(value, trimRegex, '');
};





// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
var ES6 = assign(assign({}, es5), {

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
	Call: function Call(F, V) {
		var args = arguments.length > 2 ? arguments[2] : [];
		if (!this.IsCallable(F)) {
			throw new TypeError(F + ' is not a function');
		}
		return F.apply(V, args);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
	ToPrimitive: es6$2,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toboolean
	// ToBoolean: ES5.ToBoolean,

	// http://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
	ToNumber: function ToNumber(argument) {
		var value = isPrimitive(argument) ? argument : es6$2(argument, 'number');
		if (typeof value === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a number');
		}
		if (typeof value === 'string') {
			if (isBinary(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 2));
			} else if (isOctal(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 8));
			} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
				return NaN;
			} else {
				var trimmed = trim$1(value);
				if (trimmed !== value) {
					return this.ToNumber(trimmed);
				}
			}
		}
		return Number(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tointeger
	// ToInteger: ES5.ToNumber,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint32
	// ToInt32: ES5.ToInt32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint32
	// ToUint32: ES5.ToUint32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint16
	ToInt16: function ToInt16(argument) {
		var int16bit = this.ToUint16(argument);
		return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint16
	// ToUint16: ES5.ToUint16,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint8
	ToInt8: function ToInt8(argument) {
		var int8bit = this.ToUint8(argument);
		return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8
	ToUint8: function ToUint8(argument) {
		var number = this.ToNumber(argument);
		if (_isNaN(number) || number === 0 || !_isFinite(number)) { return 0; }
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x100);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8clamp
	ToUint8Clamp: function ToUint8Clamp(argument) {
		var number = this.ToNumber(argument);
		if (_isNaN(number) || number <= 0) { return 0; }
		if (number >= 0xFF) { return 0xFF; }
		var f = Math.floor(argument);
		if (f + 0.5 < number) { return f + 1; }
		if (number < f + 0.5) { return f; }
		if (f % 2 !== 0) { return f + 1; }
		return f;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
	ToString: function ToString(argument) {
		if (typeof argument === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a string');
		}
		return String(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toobject
	ToObject: function ToObject(value) {
		this.RequireObjectCoercible(value);
		return Object(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
	ToPropertyKey: function ToPropertyKey(argument) {
		var key = this.ToPrimitive(argument, String);
		return typeof key === 'symbol' ? symbolToStr.call(key) : this.ToString(key);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	ToLength: function ToLength(argument) {
		var len = this.ToInteger(argument);
		if (len <= 0) { return 0; } // includes converting -0 to +0
		if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
		return len;
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring
	CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
		if (toStr$3.call(argument) !== '[object String]') {
			throw new TypeError('must be a string');
		}
		if (argument === '-0') { return -0; }
		var n = this.ToNumber(argument);
		if (this.SameValue(this.ToString(n), argument)) { return n; }
		return void 0;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-requireobjectcoercible
	RequireObjectCoercible: es5.CheckObjectCoercible,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
	IsArray: Array.isArray || function IsArray(argument) {
		return toStr$3.call(argument) === '[object Array]';
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iscallable
	// IsCallable: ES5.IsCallable,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
	IsConstructor: function IsConstructor(argument) {
		return typeof argument === 'function' && !!argument.prototype; // unfortunately there's no way to truly check this without try/catch `new argument`
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isextensible-o
	IsExtensible: function IsExtensible(obj) {
		if (!Object.preventExtensions) { return true; }
		if (isPrimitive(obj)) {
			return false;
		}
		return Object.isExtensible(obj);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isinteger
	IsInteger: function IsInteger(argument) {
		if (typeof argument !== 'number' || _isNaN(argument) || !_isFinite(argument)) {
			return false;
		}
		var abs = Math.abs(argument);
		return Math.floor(abs) === abs;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ispropertykey
	IsPropertyKey: function IsPropertyKey(argument) {
		return typeof argument === 'string' || typeof argument === 'symbol';
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-isregexp
	IsRegExp: function IsRegExp(argument) {
		if (!argument || typeof argument !== 'object') {
			return false;
		}
		if (hasSymbols$1) {
			var isRegExp = argument[Symbol.match];
			if (typeof isRegExp !== 'undefined') {
				return es5.ToBoolean(isRegExp);
			}
		}
		return index$25(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue
	// SameValue: ES5.SameValue,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
	SameValueZero: function SameValueZero(x, y) {
		return (x === y) || (_isNaN(x) && _isNaN(y));
	},

	/**
	 * 7.3.2 GetV (V, P)
	 * 1. Assert: IsPropertyKey(P) is true.
	 * 2. Let O be ToObject(V).
	 * 3. ReturnIfAbrupt(O).
	 * 4. Return O.[[Get]](P, V).
	 */
	GetV: function GetV(V, P) {
		// 7.3.2.1
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		// 7.3.2.2-3
		var O = this.ToObject(V);

		// 7.3.2.4
		return O[P];
	},

	/**
	 * 7.3.9 - http://www.ecma-international.org/ecma-262/6.0/#sec-getmethod
	 * 1. Assert: IsPropertyKey(P) is true.
	 * 2. Let func be GetV(O, P).
	 * 3. ReturnIfAbrupt(func).
	 * 4. If func is either undefined or null, return undefined.
	 * 5. If IsCallable(func) is false, throw a TypeError exception.
	 * 6. Return func.
	 */
	GetMethod: function GetMethod(O, P) {
		// 7.3.9.1
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		// 7.3.9.2
		var func = this.GetV(O, P);

		// 7.3.9.4
		if (func == null) {
			return undefined;
		}

		// 7.3.9.5
		if (!this.IsCallable(func)) {
			throw new TypeError(P + 'is not a function');
		}

		// 7.3.9.6
		return func;
	},

	/**
	 * 7.3.1 Get (O, P) - http://www.ecma-international.org/ecma-262/6.0/#sec-get-o-p
	 * 1. Assert: Type(O) is Object.
	 * 2. Assert: IsPropertyKey(P) is true.
	 * 3. Return O.[[Get]](P, O).
	 */
	Get: function Get(O, P) {
		// 7.3.1.1
		if (this.Type(O) !== 'Object') {
			throw new TypeError('Assertion failed: Type(O) is not Object');
		}
		// 7.3.1.2
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}
		// 7.3.1.3
		return O[P];
	},

	Type: function Type(x) {
		if (typeof x === 'symbol') {
			return 'Symbol';
		}
		return es5.Type(x);
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-speciesconstructor
	SpeciesConstructor: function SpeciesConstructor(O, defaultConstructor) {
		if (this.Type(O) !== 'Object') {
			throw new TypeError('Assertion failed: Type(O) is not Object');
		}
		var C = O.constructor;
		if (typeof C === 'undefined') {
			return defaultConstructor;
		}
		if (this.Type(C) !== 'Object') {
			throw new TypeError('O.constructor is not an Object');
		}
		var S = hasSymbols$1 && Symbol.species ? C[Symbol.species] : undefined;
		if (S == null) {
			return defaultConstructor;
		}
		if (this.IsConstructor(S)) {
			return S;
		}
		throw new TypeError('no constructor found');
	}
});

delete ES6.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible

var es6 = ES6;

var ES7 = assign(es6, {
	// https://github.com/tc39/ecma262/pull/60
	SameValueNonNumber: function SameValueNonNumber(x, y) {
		if (typeof x === 'number' || typeof x !== typeof y) {
			throw new TypeError('SameValueNonNumber requires two non-number values of the same type.');
		}
		return this.SameValue(x, y);
	}
});

var es7 = ES7;

var isEnumerable$1 = index$23.call(Function.call, Object.prototype.propertyIsEnumerable);

var implementation = function values(O) {
	var obj = es7.RequireObjectCoercible(O);
	var vals = [];
	for (var key in obj) {
		if (index$27(obj, key) && isEnumerable$1(obj, key)) {
			vals.push(obj[key]);
		}
	}
	return vals;
};

var polyfill$3 = function getPolyfill() {
	return typeof Object.values === 'function' ? Object.values : implementation;
};

var shim = function shimValues() {
	var polyfill = polyfill$3();
	index$11(Object, { values: polyfill }, {
		values: function testValues() {
			return Object.values !== polyfill;
		}
	});
	return polyfill;
};

var polyfill$2 = polyfill$3();

index$11(polyfill$2, {
	getPolyfill: polyfill$3,
	implementation: implementation,
	shim: shim
});

var index$9 = polyfill$2;

if (!Object.values) {
	index$9.shim();
}

function ApiClient(options) {
	return veritoneApi(options, apis);
}

module.exports = ApiClient;
