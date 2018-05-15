import validate from 'validate.js';
import { endpoints } from './config';

export default {
  createJob(job) {
    if (typeof job !== 'object') {
      throw new Error('Missing job!');
    }

    const validation = {
      tasks: {
        presence: true
      }
    };
    const validationErrors = validate(job, validation);
    if (validationErrors) {
      throw new Error('Invalid job object!');
    }

    return {
      method: 'post',
      path: endpoints.job,
      data: job
    };
  },

  getJobs({ limit, offset } = {}) {
    return {
      method: 'get',
      path: endpoints.job,
      query: { limit, offset }
    };
  },

  getJobsForRecording(options) {
    if (typeof options === 'string') {
      options = {
        recordingId: options
      };
    } else if (typeof options !== 'object') {
      throw new Error('Missing options!');
    }

    if (typeof options.recordingId !== 'string' || options.recordingId === '') {
      throw new Error('Missing options.recordingId!');
    }

    return {
      method: 'get',
      path: `${endpoints.job}/recording/${options.recordingId}`,
      query: { offset: options.offset, limit: options.limit },
      _requestOptions: {
        tokenType: 'api'
      }
    };
  },

  getJob(jobId) {
    if (typeof jobId !== 'string' || jobId === '') {
      throw new Error('Missing jobId!');
    }

    return {
      method: 'get',
      path: `${endpoints.job}/${jobId}`
    };
  },

  restartJob(jobId) {
    if (typeof jobId !== 'string' || jobId === '') {
      throw new Error('Missing jobId!');
    }

    return {
      method: 'put',
      path: `${endpoints.job}/${jobId}/restart`
    };
  },

  retryJob(jobId) {
    if (typeof jobId !== 'string' || jobId === '') {
      throw new Error('Missing jobId!');
    }

    return {
      method: 'put',
      path: `${endpoints.job}/${jobId}/retry`
    };
  },

  cancelJob(jobId) {
    if (typeof jobId !== 'string' || jobId === '') {
      throw new Error('Missing jobId!');
    }

    return {
      method: 'delete',
      path: `${endpoints.job}/${jobId}`
    };
  }
};
