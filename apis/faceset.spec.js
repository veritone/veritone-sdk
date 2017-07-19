import { expect } from 'chai';

import { assertMatches } from '../apis/helper/test-util';
import facesetHandlers from './faceset';

const apiBaseUrl = 'http://fake.domain';

describe('Faceset', function() {
	describe('queryFaceset', function() {
		it('validates q', function() {
			expect(() => this.api.queryFaceset()).to.throw(/query/);
		});

		it('makes the correct request to the api', function(done) {
			const scope = nock(apiBaseUrl)
				.get(/autocomplete\/my-face/)
				.reply(200, 'ok');

			this.api.queryFaceset('my-face', () => {
				scope.done();
				done();
			});
		});
	});

	describe('createFaceset', function() {
		it('validates faceSet', function() {
			expect(() => this.api.createFaceset()).to.throw(/faceset/);
			expect(() => this.api.createFaceset({})).to.throw(/faceSetId/);
		});

		it('makes the correct request to the api', function(done) {
			const data = {
				faceSetId: 'my-face'
			};

			const scope = nock(apiBaseUrl).post(/my-face/, data).reply(200, 'ok');

			this.api.createFaceset(data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('updateFaceset', function() {
		it('validates faceSet', function() {
			expect(() => this.api.updateFaceset()).to.throw(/faceset/);
			expect(() => this.api.updateFaceset({})).to.throw(/faceSetId/);
		});

		it('makes the correct request to the api', function(done) {
			const data = {
				faceSetId: 'my-face'
			};

			const scope = nock(apiBaseUrl).put(/my-face/, data).reply(200, 'ok');

			this.api.updateFaceset(data, () => {
				scope.done();
				done();
			});
		});
	});
});
