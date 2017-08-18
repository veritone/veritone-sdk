'use strict';

import veritoneApi from './apis/helper/ApiClient';
import apis from './apis';
// import './polyfill';
console.log('worked')
export default function ApiClient(options) {
	return veritoneApi(options, apis);
}

// window.ApiClient = ApiClient;
