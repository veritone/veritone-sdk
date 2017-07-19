import { endpoints } from './config';

export default {
	searchMentions(options) {
		this._retryRequest('POST', endpoints.mention + 'search', options, callback);
	},

	getMention(mentionId, filter, callback) {
		this._retryRequest('GET', endpoints.mention + mentionId, filter, callback);
	},

	updateMentionSelectively(mentionId, mention) {
		this._retryRequest('PUT', endpoints.mention + mentionId, mention, callback);
	},

	createMentionComment(mentionId, comment) {
		this._retryRequest(
			'POST',
			endpoints.mention + mentionId + '/comment',
			comment,
			callback
		);
	},

	updateMentionComment(mentionId, commentId, comment) {
		this._retryRequest(
			'PUT',
			endpoints.mention + mentionId + '/comment/' + commentId,
			comment,
			callback
		);
	},

	deleteMentionComment(mentionId, commentId, comment) {
		this._retryRequest(
			'DELETE',
			endpoints.mention + mentionId + '/comment/' + commentId,
			comment,
			callback
		);
	},

	createMentionRating(mentionId, rating) {
		this._retryRequest(
			'POST',
			endpoints.mention + mentionId + '/rating',
			rating,
			callback
		);
	},

	updateMentionRating(mentionId, ratingId, rating) {
		this._retryRequest(
			'PUT',
			endpoints.mention + mentionId + '/comment/' + ratingId,
			rating,
			callback
		);
	},

	deleteMentionRating(mentionId, ratingId, rating) {
		this._retryRequest(
			'DELETE',
			endpoints.mention + mentionId + '/comment/' + ratingId,
			rating,
			callback
		);
	}
};
