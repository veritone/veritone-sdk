import { expect } from 'chai';
import nock from 'nock';
nock.disableNetConnect();

import VeritoneApi from '../index.js';
// import { headers } from '../apis/config';

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

	describe('Job', function() {
		describe('createJob', function() {
			it('validates the job', function() {
				expect(() => this.api.createJob(undefined, noop)).to.throw(/job/);
				expect(() => this.api.createJob({}, noop)).to.throw(/job/);
				expect(() => this.api.createJob({ tasks: 'ok' }, noop)).not.to.throw(
					/job/
				);
			});

			it('posts the job to the API', function(done) {
				const job = { tasks: 'ok' };

				const scope = nock(apiBaseUrl).post(/job/, job).reply(200, 'ok');

				this.api.createJob(job, () => {
					scope.done();
					done();
				});
			});
		});

		describe('getJob', function() {
			it('validates jobId', function() {
				expect(() => this.api.getJob(undefined, noop)).to.throw(/jobId/);
				expect(() => this.api.getJob({}, noop)).to.throw(/jobId/);
				expect(() => this.api.getJob('ok', noop)).not.to.throw(/jobId/);
			});

			it('gets the job from the API', function(done) {
				const scope = nock(apiBaseUrl).get(/job-id/).reply(200, 'ok');

				this.api.getJob('job-id', () => {
					scope.done();
					done();
				});
			});
		});

		describe('getJobs', function() {
			it('validates options', function() {
				expect(() => this.api.getJobs(undefined, noop)).to.throw(/options/);
			});

			it('makes a get request to list jobs', function(done) {
				const scope = nock(apiBaseUrl).get(/job/).reply(200, []);

				this.api.getJobs(() => {
					scope.done();
					done();
				});
			});

			it('can be called with offset/limit', function(done) {
				const scope = nock(apiBaseUrl)
					.get(/job/)
					.query({
						offset: 1,
						limit: 2
					})
					.reply(200, []);

				this.api.getJobs({ offset: 1, limit: 2 }, () => {
					scope.done();
					done();
				});
			});
		});

		describe('getJobsForRecording', function() {
			it('validates options', function() {
				expect(() => this.api.getJobsForRecording(undefined, noop)).to.throw(
					/options/
				);
				expect(() => this.api.getJobsForRecording({}, noop)).to.throw(
					/recordingId/
				);
			});

			it('can be called with a string recordingId', function(done) {
				const scope = nock(apiBaseUrl)
					.get(/recording\/recording-id/)
					.reply(200, []);

				this.api.getJobsForRecording('recording-id', () => {
					scope.done();
					done();
				});
			});

			it('can be called with a recording object', function(done) {
				const scope = nock(apiBaseUrl)
					.get(/recording\/recording-id/)
					.reply(200, []);

				this.api.getJobsForRecording({ recordingId: 'recording-id' }, () => {
					scope.done();
					done();
				});
			});

			it('can be called with offset/limit', function(done) {
				const scope = nock(apiBaseUrl)
					.get(/recording\/recording-id/)
					.query({
						offset: 1,
						limit: 2
					})
					.reply(200, []);

				this.api.getJobsForRecording(
					{ recordingId: 'recording-id', offset: 1, limit: 2 },
					() => {
						scope.done();
						done();
					}
				);
			});
		});

		describe('restartJob', function() {
			it('validates jobId', function() {
				expect(() => this.api.restartJob(undefined, noop)).to.throw(/jobId/);
				expect(() => this.api.restartJob({}, noop)).to.throw(/jobId/);
				expect(() => this.api.restartJob('ok', noop)).not.to.throw(/jobId/);
			});

			it("puts to the job's restart endpoint (no body)", function(done) {
				const scope = nock(apiBaseUrl).put(/job-id\/restart/).reply(204, 'ok');

				this.api.restartJob('job-id', () => {
					scope.done();
					done();
				});
			});
		});

		describe('retryJob', function() {
			it('validates jobId', function() {
				expect(() => this.api.retryJob(undefined, noop)).to.throw(/jobId/);
				expect(() => this.api.retryJob({}, noop)).to.throw(/jobId/);
				expect(() => this.api.retryJob('ok', noop)).not.to.throw(/jobId/);
			});

			it('puts the job to the API', function(done) {
				const scope = nock(apiBaseUrl).put(/job-id/).reply(204, 'ok');

				this.api.retryJob('job-id', () => {
					scope.done();
					done();
				});
			});
		});
		describe('cancelJob', function() {
			it('validates jobId', function() {
				expect(() => this.api.cancelJob(undefined, noop)).to.throw(/jobId/);
				expect(() => this.api.cancelJob({}, noop)).to.throw(/jobId/);
				expect(() => this.api.cancelJob('ok', noop)).not.to.throw(/jobId/);
			});

			it('makes a delete request to the job', function(done) {
				const scope = nock(apiBaseUrl).delete(/job-id/).reply(204, 'ok');

				this.api.cancelJob('job-id', () => {
					scope.done();
					done();
				});
			});
		});
	});
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
