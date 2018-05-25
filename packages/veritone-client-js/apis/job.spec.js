import { expect } from 'chai';
import nock from 'nock';
nock.disableNetConnect();

import { noop } from './helper/util';
import { assertMatches } from '../apis/helper/test-util';
import jobHandlers from './job';

describe('Job', function() {
  describe('createJob', function() {
    it('validates the job', function() {
      expect(() => jobHandlers.createJob(undefined, noop)).to.throw(/job/);
      expect(() => jobHandlers.createJob({}, noop)).to.throw(/job/);
      expect(() => jobHandlers.createJob({ tasks: 'ok' }, noop)).not.to.throw(
        /job/
      );
    });

    it('posts the job to the API', function() {
      const job = { tasks: 'ok' };

      const expected = {
        method: 'post',
        path: /job/,
        data: job
      };

      const result = jobHandlers.createJob(job);
      assertMatches(result, expected);
    });
  });

  describe('getJob', function() {
    it('validates jobId', function() {
      expect(() => jobHandlers.getJob(undefined, noop)).to.throw(/jobId/);
      expect(() => jobHandlers.getJob({}, noop)).to.throw(/jobId/);
      expect(() => jobHandlers.getJob('ok', noop)).not.to.throw(/jobId/);
    });

    it('gets the job from the API', function() {
      const expected = {
        method: 'get',
        path: /job-id/
      };

      const result = jobHandlers.getJob('job-id');
      assertMatches(result, expected);
    });
  });

  describe('getJobs', function() {
    it('makes a get request to list jobs', function() {
      const expected = {
        method: 'get',
        path: /job/
      };

      const result = jobHandlers.getJobs();
      assertMatches(result, expected);
    });

    it('can be called with offset/limit', function() {
      const expected = {
        method: 'get',
        path: /job/,
        query: {
          offset: 1,
          limit: 2
        }
      };

      const result = jobHandlers.getJobs({ offset: 1, limit: 2 });
      assertMatches(result, expected);
    });
  });

  describe('getJobsForRecording', function() {
    it('validates options', function() {
      expect(() => jobHandlers.getJobsForRecording(undefined, noop)).to.throw(
        /options/
      );
      expect(() => jobHandlers.getJobsForRecording({}, noop)).to.throw(
        /recordingId/
      );
    });

    it('can be called with a string recordingId', function() {
      const expected = {
        method: 'get',
        path: /recording\/recording-id/
      };

      const result = jobHandlers.getJobsForRecording('recording-id');
      assertMatches(result, expected);
    });

    it('can be called with a recording object', function() {
      const expected = {
        method: 'get',
        path: /recording\/recording-id/
      };

      const result = jobHandlers.getJobsForRecording({
        recordingId: 'recording-id'
      });
      assertMatches(result, expected);
    });

    it('can be called with offset/limit', function() {
      const expected = {
        method: 'get',
        path: /recording\/recording-id/,
        query: {
          offset: 1,
          limit: 2
        }
      };

      const result = jobHandlers.getJobsForRecording({
        recordingId: 'recording-id',
        offset: 1,
        limit: 2
      });
      assertMatches(result, expected);
    });
  });

  describe('restartJob', function() {
    it('validates jobId', function() {
      expect(() => jobHandlers.restartJob(undefined, noop)).to.throw(/jobId/);
      expect(() => jobHandlers.restartJob({}, noop)).to.throw(/jobId/);
      expect(() => jobHandlers.restartJob('ok', noop)).not.to.throw(/jobId/);
    });

    it("puts to the job's restart endpoint (no body)", function() {
      const expected = {
        method: 'put',
        path: /job-id\/restart/
      };

      const result = jobHandlers.restartJob('job-id');
      assertMatches(result, expected);
    });
  });

  describe('retryJob', function() {
    it('validates jobId', function() {
      expect(() => jobHandlers.retryJob(undefined, noop)).to.throw(/jobId/);
      expect(() => jobHandlers.retryJob({}, noop)).to.throw(/jobId/);
      expect(() => jobHandlers.retryJob('ok', noop)).not.to.throw(/jobId/);
    });

    it('puts the job to the API', function() {
      const expected = {
        method: 'put',
        path: /job-id\/retry/
      };

      const result = jobHandlers.retryJob('job-id');
      assertMatches(result, expected);
    });
  });

  describe('cancelJob', function() {
    it('validates jobId', function() {
      expect(() => jobHandlers.cancelJob(undefined, noop)).to.throw(/jobId/);
      expect(() => jobHandlers.cancelJob({}, noop)).to.throw(/jobId/);
      expect(() => jobHandlers.cancelJob('ok', noop)).not.to.throw(/jobId/);
    });

    it('makes a delete request to the job', function() {
      const expected = {
        method: 'delete',
        path: /job-id/
      };

      const result = jobHandlers.cancelJob('job-id');
      assertMatches(result, expected);
    });
  });
});
