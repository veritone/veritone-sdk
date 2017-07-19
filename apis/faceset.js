import { endpoints } from './config';

export default {
	queryFaceset(q) {
		if (typeof q !== 'string' || q === '') {
			throw new Error('Missing query!');
		}
		this._retryRequest(
			'GET',
			endpoints.faceset + 'autocomplete/' + encodeURIComponent(q),
			null,
			callback
		);
	},

	createFaceset(faceset) {
		if (typeof faceset !== 'object') {
			throw new Error('Missing faceset!');
		}
		if (typeof faceset.faceSetId !== 'string') {
			throw new Error('Missing faceSetId!');
		}
		this._retryRequest(
			'POST',
			endpoints.faceset + encodeURIComponent(faceset.faceSetId),
			faceset,
			callback
		);
	},

	updateFaceset(faceset) {
		if (typeof faceset !== 'object') {
			throw new Error('Missing faceset!');
		}
		if (typeof faceset.faceSetId !== 'string') {
			throw new Error('Missing faceSetId!');
		}
		this._retryRequest(
			'PUT',
			endpoints.faceset + encodeURIComponent(faceset.faceSetId),
			faceset,
			callback
		);
	}
}
