import { expect } from 'chai';
import nock from 'nock';

nock.disableNetConnect();

// import { headers } from './config';
import { assertMatches } from '../apis/helper/test-util';
import searchHandlers from './search';

const apiBaseUrl = 'http://fake.domain';

describe('Search', function() {
	describe('fixme', function() {
		it('fixme');
	});
});
