import { expect } from 'chai';
import { endpoints } from './config';

import { assertMatches } from '../apis/helper/test-util';
import ingestionHandlers from './ingestion';

const apiBaseUrl = 'http://fake.domain';

describe('Ingestion', function() {
	describe('createIngestion', function() {
		it('posts to the ingestion endpoint with the data', function(done) {
			const data = {
				data: 'ok'
			};

			const scope = nock(apiBaseUrl)
				.post(endpoints.ingestion, data)
				.reply(200, 'ok');

			this.api.createIngestion(data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('getIngestions', function() {
		it('gets to the ingestion endpoint with additional data in the query', function(done) {
			const query = {
				query: 'ok'
			};

			const scope = nock(apiBaseUrl)
				.get(endpoints.ingestion)
				.query(query)
				.reply(200, 'ok');

			this.api.getIngestions(query, () => {
				scope.done();
				done();
			});
		});
	});

	describe('getIngestion', function() {
		it('validates ingestionId', function() {
			expect(() => this.api.getIngestion()).to.throw(/ingestionId/);
		});

		it('gets to the ingestion id with additional data in the query', function(done) {
			const query = {
				query: 'ok'
			};

			const scope = nock(apiBaseUrl)
				.get(/ingestion-id/)
				.query(query)
				.reply(200, 'ok');

			this.api.getIngestion('ingestion-id', query, () => {
				scope.done();
				done();
			});
		});
	});

	describe('updateIngestion', function() {
		it('validates ingestionId', function() {
			expect(() => this.api.updateIngestion()).to.throw(/ingestionId/);
		});

		it('puts to the ingestion id with additional data in the query', function(done) {
			const data = {
				data: 'ok'
			};

			const scope = nock(apiBaseUrl)
				.put(/ingestion-id/, data)
				.reply(200, 'ok');

			this.api.updateIngestion('ingestion-id', data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('deleteIngestion', function() {
		it('validates ingestionId', function() {
			expect(() => this.api.deleteIngestion()).to.throw(/ingestionId/);
		});

		it('gets to the ingestion id with additional data in the query', function(done) {
			const query = {
				query: 'ok'
			};

			const scope = nock(apiBaseUrl)
				.delete(/ingestion-id/)
				.query(query)
				.reply(200, 'ok');

			this.api.deleteIngestion('ingestion-id', query, () => {
				scope.done();
				done();
			});
		});
	});

	describe('ingestionConnect', function() {
		it('validates connectOptions', function() {
			expect(() => this.api.ingestionConnect()).to.throw(/options/i);
		});

		it('posts to the ingestion connect endpoint with data', function(done) {
			const data = {
				data: 'ok'
			};

			const scope = nock(apiBaseUrl)
				.post(/connect/, data)
				.reply(200, 'ok');

			this.api.ingestionConnect(data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('verifyEmailIngestion', function() {
		it('validates emailOptions', function() {
			expect(() => this.api.verifyEmailIngestion({})).to.throw(/email/i);
		});

		it('posts to the ingestion connect endpoint with data', function(done) {
			const data = {
				emailAddress: 'ok'
			};

			const scope = nock(apiBaseUrl)
				.post(/verifyEmailIngestion/, data)
				.reply(200, 'ok');

			this.api.verifyEmailIngestion(data, () => {
				scope.done();
				done();
			});
		});
	});
});
