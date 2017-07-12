import { expect } from 'chai';
import nock from 'nock';
nock.disableNetConnect();

import VeritoneApi from '../index.js';

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

	describe('Token', function() {
		describe('createToken', function() {
			it('validates label', function() {
				const incorrectLabels = [undefined, noop, ''];
				const correctLabels = ['ok'];

				incorrectLabels.forEach(l => {
					expect(() => this.api.token.createToken(l, 'a', noop)).to.throw();
				});

				correctLabels.forEach(l => {
					expect(() => this.api.token.createToken(l, 'a', noop)).not.to.throw();
				});
			});

			it('validates rights', function() {
				const incorrectRights = [undefined, ''];
				const correctRights = ['rights']; // todo: string or array?

				incorrectRights.forEach(r => {
					expect(() => this.api.token.createToken('label', r, noop)).to.throw();
				});

				correctRights.forEach(r => {
					expect(() =>
						this.api.token.createToken('label', r, noop)
					).not.to.throw();
				});
			});

			it('posts to API with tokenLabel and rights in json body', function(
				done
			) {
				const scope = nock(apiBaseUrl)
					.post(/token/, {
						tokenLabel: 'label',
						rights: 'rights'
					})
					.reply(200, 'ok');

				this.api.token.createToken('label', 'rights', () => {
					scope.done();
					done();
				});
			});
		});

		describe('revokeToken', function() {
			it('validates token', function() {
				const incorrectTokens = [undefined, noop, ''];
				const correctTokens = ['ok'];

				incorrectTokens.forEach(t => {
					expect(() => this.api.token.revokeToken(t, noop)).to.throw();
				});

				correctTokens.forEach(t => {
					expect(() => this.api.token.revokeToken(t, noop)).not.to.throw();
				});
			});

			it('makes a delete request to the api with the token', function(done) {
				const scope = nock(apiBaseUrl).delete(/some-token/).reply(200, 'ok');

				this.api.token.revokeToken('some-token', () => {
					scope.done();
					done();
				});
			});
		});
	});

	describe.only('Recording', function() {
		describe('createRecording', function() {
			it('validates recording', function() {
				expect(() =>
					this.api.recording.createRecording(undefined, noop)
				).to.throw();
			});

			it('posts to API with recording in json body', function(done) {
				const scope = nock(apiBaseUrl)
					.post(/record/, {
						startDateTime: 1,
						stopDateTime: 2
					})
					.reply(200, 'ok');

				this.api.recording.createRecording(
					{
						startDateTime: 1,
						stopDateTime: 2
					},
					() => {
						scope.done();
						done();
					}
				);
			});
		});

		describe('getRecordings', function() {
			it('can be called with only a callback', function(done) {
				const scope = nock(apiBaseUrl).get(/record/).reply(200, 'ok');

				this.api.recording.getRecordings(() => {
					scope.done();
					done();
				});
			});

			it('can be called with options.limit and options.offset', function(done) {
				const scope = nock(apiBaseUrl)
					.get(/record/)
					.query({
						offset: 1,
						limit: 2
					})
					.reply(200, 'ok');

				this.api.recording.getRecordings({ offset: 1, limit: 2 }, () => {
					scope.done();
					done();
				});
			});

			it('can be called with limit only', function(done) {
				const scope = nock(apiBaseUrl)
					.get(/record/)
					.query({
						limit: 2
					})
					.reply(200, 'ok');

				this.api.recording.getRecordings({ limit: 2 }, () => {
					scope.done();
					done();
				});
			});

			it('can be called with offset only', function(done) {
				const scope = nock(apiBaseUrl)
					.get(/record/)
					.query({
						offset: 2
					})
					.reply(200, 'ok');

				this.api.recording.getRecordings({ offset: 2 }, () => {
					scope.done();
					done();
				});
			});
		});

		describe('getRecording', function() {
			it('validates recordingId', function() {
				const incorrectIds = [undefined, noop];
				const correctIds = [123, '123'];

				incorrectIds.forEach(i => {
					expect(() => this.api.recording.getRecording(i, noop)).to.throw();
				});

				correctIds.forEach(i => {
					expect(() => this.api.recording.getRecording(i, noop)).not.to.throw();
				});
			});

			it('makes a get request to the api with the id', function(done) {
				const scope = nock(apiBaseUrl)
					.get(/some-recording-id/)
					.reply(200, 'ok');

				this.api.recording.getRecording('some-recording-id', () => {
					scope.done();
					done();
				});
			});
		});

		describe('updateRecording', function() {
			it('validates recording', function() {
				expect(() =>
					this.api.recording.updateRecording(undefined, noop)
				).to.throw();
			});

			it('makes a put request to the api with the id and body', function(done) {
				const recording = {
					startDateTime: 1,
					stopDateTime: 2,
					recordingId: 'some-recording-id'
				};

				const scope = nock(apiBaseUrl)
					.put(/some-recording-id/, recording)
					.reply(200, 'ok');

				this.api.recording.updateRecording(recording, () => {
					scope.done();
					done();
				});
			});
		});

		describe('updateRecordingFolder', function() {
			it('validates folder', function() {
				expect(() =>
					this.api.recording.updateRecordingFolder(undefined, noop)
				).to.throw();
				expect(() =>
					this.api.recording.updateRecordingFolder({}, noop)
				).to.throw();
			});
		});
		// xdescribe('updateCms');
		// xdescribe('deleteRecording');
		// xdescribe('getRecordingTranscript');
		// xdescribe('getRecordingMedia');
		// xdescribe('getRecordingAssets');
	});

	// xdescribe('Asset');
	// xdescribe('Job');
	// xdescribe('Engine');
	// xdescribe('Task');
	// xdescribe('DropboxWatcher');
	// xdescribe('Faces');
	// xdescribe('Mentions');
	// xdescribe('Widgets');
	// xdescribe('Folder');
	// xdescribe('Collection');
	// xdescribe('Ingestion');
});
