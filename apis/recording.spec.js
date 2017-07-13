import { expect } from 'chai';
import { noop } from './helper/util';

import { assertMatches } from '../apis/helper/test-util';
import recordingHandlers from './recording';

describe('Recording', function() {
	describe('createRecording', function() {
		it('validates recording', function() {
			expect(() =>
				recordingHandlers.createRecording(undefined, noop)
			).to.throw();
		});

		it('posts to API with recording in json body', function() {
			const expected = {
				method: 'post',
				path: /record/,
				data: {
					startDateTime: 1,
					stopDateTime: 2
				}
			};

			const result = recordingHandlers.createRecording({
				startDateTime: 1,
				stopDateTime: 2
			});

			assertMatches(result, expected);
		});
	});

	describe('getRecordings', function() {
		it('can be called with options.limit and options.offset', function() {
			const expected = {
				method: 'get',
				path: /record/,
				query: {
					offset: 1,
					limit: 2
				}
			};

			const result = recordingHandlers.getRecordings({ offset: 1, limit: 2 });
			assertMatches(result, expected);
		});

		it('can be called with limit only', function() {
			const expected = {
				method: 'get',
				path: /record/,
				query: {
					limit: 2
				}
			};

			const result = recordingHandlers.getRecordings({ limit: 2 });
			assertMatches(result, expected);
		});

		it('can be called with offset only', function() {
			const expected = {
				method: 'get',
				path: /record/,
				query: {
					offset: 2
				}
			};

			const result = recordingHandlers.getRecordings({ offset: 2 });
			assertMatches(result, expected);
		});
	});

	describe('getRecording', function() {
		it('validates recordingId', function() {
			const incorrectIds = [undefined, noop];
			const correctIds = [123, '123'];

			incorrectIds.forEach(i => {
				expect(() => recordingHandlers.getRecording(i, noop)).to.throw();
			});

			correctIds.forEach(i => {
				expect(() => recordingHandlers.getRecording(i, noop)).not.to.throw();
			});
		});

		it('makes a get request to the api with the id', function() {
			const expected = {
				method: 'get',
				path: /some-recording-id/
			};

			const result = recordingHandlers.getRecording('some-recording-id');
			assertMatches(result, expected);
		});
	});

	describe('updateRecording', function() {
		it('validates recording', function() {
			expect(() =>
				recordingHandlers.updateRecording(undefined, noop)
			).to.throw();
		});

		it('makes a put request to the api with the id and body', function() {
			const recording = {
				startDateTime: 1,
				stopDateTime: 2,
				recordingId: 'some-recording-id'
			};

			const expected = {
				method: 'put',
				data: recording,
				path: /some-recording-id/
			};

			const result = recordingHandlers.updateRecording(recording);
			assertMatches(result, expected);
		});
	});

	describe('updateRecordingFolder', function() {
		it('validates folder', function() {
			expect(() =>
				recordingHandlers.updateRecordingFolder(undefined, noop)
			).to.throw(/folder/);

			expect(() => recordingHandlers.updateRecordingFolder({}, noop)).to.throw(
				/folder/
			);

			expect(() =>
				recordingHandlers.updateRecordingFolder(
					{
						folderId: '2'
					},
					noop
				)
			).not.to.throw();
		});

		it('makes a put request to the api with the folder', function() {
			const folder = {
				folderId: 'some-folder-id'
			};

			const expected = {
				method: 'put',
				data: folder,
				path: /some-folder-id/
			};

			const result = recordingHandlers.updateRecordingFolder(folder);
			assertMatches(result, expected);
		});
	});

	describe('updateCms', function() {
		it('validates recordingId', function() {
			expect(() => recordingHandlers.updateCms(undefined, noop)).to.throw(/recordingId/);

			expect(() => recordingHandlers.updateCms({}, noop)).to.throw(/recordingId/);

			expect(() => recordingHandlers.updateCms('2', noop)).not.to.throw();
		});

		it('makes a put request to the correct endpoint (no body)', function() {
			const expected = {
				method: 'put',
				path: /some-id\/cms/
			};

			const result = recordingHandlers.updateCms('some-id');
			assertMatches(result, expected);
		});
	});

	describe('deleteRecording', function() {
		it('validates recordingId', function() {
			expect(() => recordingHandlers.deleteRecording(undefined, noop)).to.throw(
				/recordingId/
			);

			expect(() => recordingHandlers.deleteRecording({}, noop)).to.throw(/recordingId/);

			expect(() => recordingHandlers.deleteRecording('2', noop)).not.to.throw();
		});

		it('makes a delete request to the correct endpoint', function() {
			const expected = {
				method: 'delete',
				path: /some-id/
			};

			const result = recordingHandlers.deleteRecording('some-id');
			assertMatches(result, expected);
		});
	});
	// xdescribe('getRecordingTranscript');
	// xdescribe('getRecordingMedia');
	// xdescribe('getRecordingAssets');
});
