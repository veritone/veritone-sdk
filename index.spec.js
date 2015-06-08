'use strict';

describe('veritone-api', function() {

	var VeritoneApi = require('./index');

	describe('job', function() {
		var apiClient = new VeritoneApi({
			token: 'iaiqfyxz:eyJhbGciOiJSUzUxMiJ9.eyJyIjpbInRhc2s6dXBkYXRlIl0sImlkIjoiaWFpcWZ5eHoifQ.ZEmqCnikGdOVQaqCRGYTA61FArlZGRhuYUwGu6v53nKwOqMTzEpyZwC_7VTM637CeCbh7TTf4ieAwF8yGArOyHIt3CtjXNZtonkbrgpVZoCn_4jlhactObwVcETWiilNVfhgEzezKPxCJQp7GFGChu6lvHu5GqUKdt6JPeaaUJhjkqeV0k2mL68qathhN1J_rWy2WaJ3LZW8O4nkZhUGWxpdE1etWUIjo8ePFGXr9mkBGR452C_P1J8WVxniwVWXnUdd1G_kQ2HEQDZlH8fjoxIA0mnDBOEpqltulAipfd9utGOjyGPx_yrirM_rUxBvnuJ7ea95YDYQepAc-VUpvg',
			baseUri: 'http://localhost:9000'
		});
		
		var job = {
			tasks:[
				{
					taskType: 'test'
				}
			]
		};

		it('should create a job', function(done) {
			apiClient.createJob(job, function(err, newJob) {
				expect(err).not.toBeTruthy();
				expect(newJob).toBeTruthy();
				if (newJob) {
					expect(newJob.jobId).toBeTruthy();
					expect(newJob.status).toEqual('accepted');

					job = newJob;
				}

				done();
			});
		});

		if (job)
		{
			xit('shoud get a job', function(done) {
				apiClient.getJob(job.jobId, function(err, returnedJob) {
					expect(err).not.toBeTruthy();
					expect(returnedJob).toBeTruthy();
					expect(returnedJob.status).toEqual('running');
					done();
				});
			});

			xit('should update a task in a job', function(done) {
				var taskResult = {
					taskStatus: 'complete',
					taskOutput: {recordingId: '123'}
				}
				apiClient.updateTask(job.jobId, job.tasks[0].taskId, taskResult, function(err) {
					expect(err).not.toBeTruthy();

					// Verify update by retrieving job again.
					apiClient.getJob(job.jobId, function(err, returnedJob) {
						expect(err).not.toBeTruthy();
						expect(returnedJob).toBeTruthy();
						expect(returnedJob.status).toEqual('complete');
						expect(returnedJob.recordingId).toEqual('123');
						done();
					});
				});
			});
		}
	});
});
