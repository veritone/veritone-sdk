import { endpoints } from './config';

export default {
  updateTask(jobId, taskId, result) {
    if (typeof jobId !== 'string' || jobId === '') {
      throw new Error('Missing jobId!');
    }
    if (typeof taskId !== 'string' || taskId === '') {
      throw new Error('Missing taskId!');
    }
    if (typeof result !== 'object') {
      throw new Error('Missing result!');
    }
    if (typeof result.taskStatus !== 'string' || result.taskStatus === '') {
      throw new Error('Missing result.taskStatus!');
    }
    if (
      result.taskStatus !== 'running' &&
      result.taskStatus !== 'complete' &&
      result.taskStatus !== 'failed'
    ) {
      throw new Error('Invalid task status: ' + result.taskStatus);
    }

    return {
      method: 'put',
      path: `${endpoints.job}/${jobId}/task/${taskId}`,
      data: result
    };
  },

  pollTask(jobId, taskId, data = {}) {
    if (typeof jobId !== 'string' || jobId === '') {
      throw new Error('Missing jobId!');
    }
    if (typeof taskId !== 'string' || taskId === '') {
      throw new Error('Missing taskId!');
    }

    return {
      method: 'post',
      path: `${endpoints.job}/${jobId}/task/${taskId}/poll`,
      data
    };
  },

  getTaskSummaryByRecording(options) {
    if (typeof options === 'string') {
      options = {
        recordingId: options
      };
    } else if (typeof options !== 'object') {
      throw new Error('Missing options!');
    }

    return {
      method: 'get',
      path: endpoints.tasksByRecording,
      query: options
    };
  }
};
