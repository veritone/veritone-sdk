import { expect } from 'chai';
import nock from 'nock';
nock.disableNetConnect();

import VeritoneApi from '../index.js';

const noop = () => {};
const apiBaseUri = 'http://fake.domain';

describe('ApiClient constructor', function() {
	it('can be configured with a string (token for auth header)', function() {
		const api = new VeritoneApi('testToken');

		expect(api.generateHeaders().Authorization).to.match(/testToken/);
	});

	it('throws if no token is configured', function() {
		expect(() => new VeritoneApi()).to.throw();
		expect(() => new VeritoneApi({})).to.throw();
		expect(() => new VeritoneApi('testToken')).not.to.throw();
		expect(() => new VeritoneApi({ token: 'testToken' })).not.to.throw();
	});
});

describe('API methods', function() {
	beforeEach(function() {
		this.api = new VeritoneApi({
			token: 'api-token-abc',
			baseUri: apiBaseUri
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
					expect(() => this.api.createToken(l, 'a', noop)).to.throw();
				});

				correctLabels.forEach(l => {
					expect(() => this.api.createToken(l, 'a', noop)).not.to.throw();
				});
			});

			it('validates rights', function() {
				const incorrectRights = [undefined, ''];
				const correctRights = ['rights']; // todo: string or array?

				incorrectRights.forEach(r => {
					expect(() => this.api.createToken('label', r, noop)).to.throw();
				});

				correctRights.forEach(r => {
					expect(() => this.api.createToken('label', r, noop)).not.to.throw();
				});
			});

			it('validates callback', function() {
				const incorrectCallbacks = [undefined, ''];
				const correctCallbacks = [noop];

				incorrectCallbacks.forEach(c => {
					expect(() => this.api.createToken('label', 'a', c)).to.throw();
				});

				correctCallbacks.forEach(c => {
					expect(() => this.api.createToken('label', 'a', c)).not.to.throw();
				});
			});

			it('posts to API with tokenLabel and rights in json body', function(
				done
			) {
				const scope = nock(apiBaseUri)
					.post(/token/, {
						tokenLabel: 'label',
						rights: 'rights'
					})
					.reply(200, 'ok');

				this.api.createToken('label', 'rights', () => {
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
					expect(() => this.api.revokeToken(t, noop)).to.throw();
				});

				correctTokens.forEach(t => {
					expect(() => this.api.revokeToken(t, noop)).not.to.throw();
				});
			});

			it('makes a delete request to the api with the token', function(done) {
				const scope = nock(apiBaseUri).delete(/some-token/).reply(200, 'ok');

				this.api.revokeToken('some-token', () => {
					scope.done();
					done();
				});
			});
		});
	});

	describe('Recording', function() {
		describe('createRecording', function() {
			it('validates recording', function() {
				expect(() => this.api.createRecording(undefined, noop)).to.throw();
			});

			it('posts to API with recording in json body', function(done) {
				const scope = nock(apiBaseUri)
					.post(/record/, {
						startDateTime: 1,
						stopDateTime: 2
					})
					.reply(200, 'ok');

				this.api.createRecording(
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
				const scope = nock(apiBaseUri).get(/record/).reply(200, 'ok');

				this.api.getRecordings(() => {
					scope.done();
					done();
				});
			});

			it('can be called with options.limit and options.offset', function(done) {
				const scope = nock(apiBaseUri)
					.get(/record/)
					.query({
						offset: 1,
						limit: 2
					})
					.reply(200, 'ok');

				this.api.getRecordings({ offset: 1, limit: 2 }, () => {
					scope.done();
					done();
				});
			});

			it('can be called with limit only', function(done) {
				const scope = nock(apiBaseUri)
					.get(/record/)
					.query({
						limit: 2
					})
					.reply(200, 'ok');

				this.api.getRecordings({ limit: 2 }, () => {
					scope.done();
					done();
				});
			});

			it('can be called with offset only', function(done) {
				const scope = nock(apiBaseUri)
					.get(/record/)
					.query({
						offset: 2
					})
					.reply(200, 'ok');

				this.api.getRecordings({ offset: 2 }, () => {
					scope.done();
					done();
				});
			});
		});

		// xdescribe('getRecording');
		// xdescribe('updateRecording');
		// xdescribe('updateRecordingFolder');
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
