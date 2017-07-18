import { expect } from 'chai';
import nock from 'nock';
nock.disableNetConnect();

import VeritoneApi from '../index.js';
import { endpoints } from '../apis/config';

const noop = () => {};
const apiBaseUrl = 'http://fake.domain';

describe('API methods', function() {
	beforeEach(function() {
		this.api = VeritoneApi({
			token: 'api-token-abc',
			baseUrl: apiBaseUrl
		});
	});

	afterEach(function() {
		nock.cleanAll();
	});

	// xdescribe('DropboxWatcher');
	// xdescribe('Faces');
	// xdescribe('Mentions');
	// xdescribe('Widgets');
	// xdescribe('Folder');
	// xdescribe('Collection');
	// xdescribe('Ingestion');
});
