'use strict';

const mockery = require('mockery');

describe('veritone-api', function() {

	let apiClient, requestMock, requestMockCallback, requestMockOptions;

	beforeEach(function() {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false
		});

		requestMockCallback = {
			error: null,
			response: null,
			body: null
		};

		requestMock = jasmine.createSpy('request').and.callFake(function mockCallback(options, callback) {
			expect(options.url).toEqual(requestMockOptions.url);
			callback(requestMockCallback.error, requestMockCallback.response, requestMockCallback.body);
		});

		mockery.registerMock('request', requestMock);

		const VeritoneApi = require('../index.js');

		apiClient = new VeritoneApi({
			token: 'api-token-abc',
			baseUri: 'mock.api.veritone.com'
		});
	});

	afterEach(function() {
		mockery.deregisterMock('request');
		mockery.disable();
	});

	describe('job', function() {
		const mockJob = {
			jobId: '123',
			status: 'accepted',
			tasks: [
				{ taskId: 'some-task-id' }
			]
		};

		it('should create a job', function(done) {
			requestMockOptions = {
				url: 'mock.api.veritone.com/v1/job/'
			};
			requestMockCallback = {
				error: null,
				response: { statusCode: 200 },
				body: {
					jobId: '123',
					status: 'accepted',
					tasks: [
						{ taskId: 'some-task-id' }
					]
				}
			};

			apiClient.createJob(mockJob, function(err, newJob) {
				expect(err).not.toBeTruthy();
				expect(newJob).toBeTruthy();
				if (newJob) {
					expect(newJob.jobId).toBeTruthy();
					expect(newJob.status).toEqual('accepted');
				}

				done();
			});
		});

		it('should get a job', function(done) {
			requestMockOptions = {
				url: 'mock.api.veritone.com/v1/job/123'
			};
			requestMockCallback = {
				error: null,
				response: { statusCode: 200 },
				body: {
					status: 'running'
				}
			};

			apiClient.getJob(mockJob.jobId, function(err, returnedJob) {
				expect(err).not.toBeTruthy();
				expect(returnedJob).toBeTruthy();
				expect(returnedJob.status).toEqual('running');
				done();
			});
		});

		it('should update a task in a job', function(done) {
			const taskResult = {
				taskStatus: 'complete',
				taskOutput: { recordingId: '123' }
			};

			requestMockOptions = {
				url: 'mock.api.veritone.com/v1/job/123/task/some-task-id'
			};

			requestMockCallback = {
				error: null,
				response: { statusCode: 204 },
				body: {
					recordingId: '123',
					status: 'complete'
				}
			};

			apiClient.updateTask(mockJob.jobId, mockJob.tasks[0].taskId, taskResult, function(err) {
				expect(err).not.toBeTruthy();
				done();
			});
		});
	});

	describe('engine', function() {
		const mockJob = {
			jobId: '123',
			status: 'accepted',
			tasks: [
				{ taskId: 'some-task-id' }
			]
		};

		it('should create a job', function(done) {
			requestMockOptions = {
				url: 'mock.api.veritone.com/v1/job/'
			};
			requestMockCallback = {
				error: null,
				response: { statusCode: 200 },
				body: {
					jobId: '123',
					status: 'accepted',
					tasks: [
						{ taskId: 'some-task-id' }
					]
				}
			};

			apiClient.createJob(mockJob, function(err, newJob) {
				expect(err).not.toBeTruthy();
				expect(newJob).toBeTruthy();
				if (newJob) {
					expect(newJob.jobId).toBeTruthy();
					expect(newJob.status).toEqual('accepted');
				}

				done();
			});
		});

		it('should get engines', function(done) {
			requestMockOptions = {
				url: 'mock.api.veritone.com/v1/engine?limit=99999'
			};
			requestMockCallback = {
				error: null,
				response: { statusCode: 200 },
				body: {}
			};

			apiClient.getEngines(function(err, results) {
				expect(err).not.toBeTruthy();
				expect(results).toBeTruthy();
				done();
			});
		});

		it('should get engine categories', function(done) {
			requestMockOptions = {
				url: 'mock.api.veritone.com/v1/engine/category?limit=99999'
			};
			requestMockCallback = {
				error: null,
				response: { statusCode: 200 },
				body: {}
			};

			apiClient.getEngineCategories(function(err, results) {
				expect(err).not.toBeTruthy();
				expect(results).toBeTruthy();
				done();
			});
		});

	});
});
