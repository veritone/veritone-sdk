'use strict';

import veritoneApi from './apis/helper/ApiClient';
import apis from './apis';

export default function ApiClient(options) {
	return veritoneApi(options, apis);
}
