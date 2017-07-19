import { expect } from 'chai';
import nock from 'nock';

nock.disableNetConnect();

import { assertMatches } from '../apis/helper/test-util';
import mentionHandlers from './mention';

const apiBaseUrl = 'http://fake.domain';

describe('Mentions', function() {
	describe('searchMentions', function() {
		it('posts to the search api with the body', function(done) {
			const data = {
				option: 'my-option'
			};

			const scope = nock(apiBaseUrl).post(/search/, data).reply(200, 'ok');

			this.api.searchMentions(data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('getMentions', function() {
		it('gets the mentionId with filter in the query', function(done) {
			const filter = {
				filter: 'my-filter'
			};

			const scope = nock(apiBaseUrl)
				.get(/my-mention/)
				.query(filter)
				.reply(200, 'ok');

			this.api.getMentions('my-mention', filter, () => {
				scope.done();
				done();
			});
		});
	});

	describe('updateMentionSelectively', function() {
		it('puts to the mentionId with the body', function(done) {
			const data = {
				mention: 'my-mention'
			};

			const scope = nock(apiBaseUrl).put(/my-mention/, data).reply(200, 'ok');

			this.api.updateMentionSelectively('my-mention', data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('createMentionComment', function() {
		it('puts to the mentionId with the comment', function(done) {
			const data = {
				comment: 'my-comment'
			};

			const scope = nock(apiBaseUrl)
				.post(/my-mention\/comment/, data)
				.reply(200, 'ok');

			this.api.createMentionComment('my-mention', data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('updateMentionComment', function() {
		it('puts to the mentionId/commentId with the comment', function(done) {
			const data = {
				comment: 'my-comment'
			};

			const scope = nock(apiBaseUrl)
				.put(/my-mention\/comment\/my-comment/, data)
				.reply(200, 'ok');

			this.api.updateMentionComment('my-mention', 'my-comment', data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('deleteMentionComment', function() {
		it('deletes to the mentionId/commentId with the comment', function(done) {
			const data = {
				comment: 'my-comment'
			};

			const scope = nock(apiBaseUrl)
				.delete(/my-mention\/comment\/my-comment/)
				.query(data)
				.reply(200, 'ok');

			this.api.deleteMentionComment('my-mention', 'my-comment', data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('createMentionRating', function() {
		it('posts to the mentionId rating with the rating', function(done) {
			const data = {
				rating: 'my-rating'
			};

			const scope = nock(apiBaseUrl)
				.post(/my-mention\/rating/, data)
				.reply(200, 'ok');

			this.api.createMentionRating('my-mention', data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('updateMentionRating', function() {
		it('puts to the mentionId rating with the rating', function(done) {
			const data = {
				rating: 'my-rating'
			};

			const scope = nock(apiBaseUrl)
				.put(/my-mention\/comment\/my-rating/, data)
				.reply(200, 'ok');

			this.api.updateMentionRating('my-mention', 'my-rating', data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('deleteMentionRating', function() {
		it('deletes to the mentionId/commentId with the comment', function(done) {
			const data = {
				rating: 'my-rating'
			};

			const scope = nock(apiBaseUrl)
				.delete(/my-mention\/comment\/my-rating/)
				.query(data)
				.reply(200, 'ok');

			this.api.deleteMentionRating('my-mention', 'my-rating', data, () => {
				scope.done();
				done();
			});
		});
	});
});
