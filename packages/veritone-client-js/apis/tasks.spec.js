import { expect } from 'chai';

import { assertMatches } from '../apis/helper/test-util';
import tasksHandlers from './tasks';

describe('Task', function() {
  describe('updateTask', function() {
    it('validates jobId', function() {
      expect(() =>
        tasksHandlers.updateTask(null, 'task-id', {
          taskStatus: 'running'
        })
      ).to.throw(/jobId/);
    });

    it('validates taskId', function() {
      expect(() =>
        tasksHandlers.updateTask('job-id', null, {
          taskStatus: 'running'
        })
      ).to.throw(/taskId/);
    });

    it('validates result', function() {
      expect(() => tasksHandlers.updateTask('job-id', 'task-id', 123)).to.throw(
        /result/
      );

      expect(() => tasksHandlers.updateTask('job-id', 'task-id', {})).to.throw(
        /taskStatus/
      );

      expect(() =>
        tasksHandlers.updateTask('job-id', 'task-id', {
          taskStatus: 'this-should-fail'
        })
      ).to.throw(/status/);

      expect(() =>
        tasksHandlers.updateTask('job-id', 'task-id', {
          taskStatus: 'running'
        })
      ).not.to.throw();

      expect(() =>
        tasksHandlers.updateTask('job-id', 'task-id', {
          taskStatus: 'complete'
        })
      ).not.to.throw();

      expect(() =>
        tasksHandlers.updateTask('job-id', 'task-id', {
          taskStatus: 'failed'
        })
      ).not.to.throw();
    });

    it('PUTs to the API with the correct data', function() {
      const task = {
        taskStatus: 'failed'
      };

      const expected = {
        method: 'put',
        path: /job-id\/task\/task-id/,
        data: task
      };

      const result = tasksHandlers.updateTask('job-id', 'task-id', task);

      assertMatches(result, expected);
    });
  });

  describe('getTaskSummaryByRecording', function() {
    it('validates options', function() {
      expect(() => tasksHandlers.getTaskSummaryByRecording()).to.throw(
        /options/
      );
    });

    it('takes a recordingId as a string', function() {
      const expected = {
        method: 'get',
        path: /tasks/,
        query: {
          recordingId: 'recording-id'
        }
      };

      const result = tasksHandlers.getTaskSummaryByRecording('recording-id');

      assertMatches(result, expected);
    });

    it('attaches everything in options to the query', function() {
      const expected = {
        method: 'get',
        path: /tasks/,
        query: {
          a: 1,
          b: 2
        }
      };

      const result = tasksHandlers.getTaskSummaryByRecording({ a: 1, b: 2 });

      assertMatches(result, expected);
    });
  });

  describe('pollTask', function() {
    it('validates jobId', function() {
      expect(() => tasksHandlers.pollTask(null, 'task-id')).to.throw(/jobId/);
    });

    it('validates taskId', function() {
      expect(() => tasksHandlers.pollTask('job-id')).to.throw(/taskId/);
    });

    it('POSTs to the API with the correct data', function() {
      const data = {
        ok: 'ok'
      };

      const expected = {
        method: 'post',
        path: /job-id\/task\/task-id\/poll/,
        data
      };

      const result = tasksHandlers.pollTask('job-id', 'task-id', data);

      assertMatches(result, expected);
    });
  });
});
