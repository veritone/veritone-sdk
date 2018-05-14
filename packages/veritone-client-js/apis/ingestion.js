import { endpoints } from './config';

export default {
  createIngestion(ingestion) {
    return {
      method: 'post',
      path: endpoints.ingestion,
      data: ingestion
    };
  },

  getIngestions(options = {}) {
    return {
      method: 'get',
      path: endpoints.ingestion,
      query: options
    };
  },

  getIngestion(ingestionId, options = {}) {
    if (typeof ingestionId !== 'string' || ingestionId === '') {
      throw new Error('Missing ingestionId');
    }

    return {
      method: 'get',
      path: `${endpoints.ingestion}/${ingestionId}`,
      query: options
    };
  },

  updateIngestion(ingestionId, patch) {
    if (typeof ingestionId !== 'string' || ingestionId === '') {
      throw new Error('Missing ingestionId');
    }

    return {
      method: 'put',
      path: `${endpoints.ingestion}/${ingestionId}`,
      data: patch
    };
  },

  deleteIngestion(ingestionId, options) {
    if (typeof ingestionId !== 'string' || ingestionId === '') {
      throw new Error('Missing ingestionId');
    }

    return {
      method: 'delete',
      path: `${endpoints.ingestion}/${ingestionId}`,
      query: options
    };
  },

  ingestionConnect(connectOptions) {
    if (typeof connectOptions === 'undefined') {
      throw new Error('Missing Connect Options');
    }

    return {
      method: 'post',
      path: `${endpoints.ingestion}/connect`,
      data: connectOptions
    };
  },

  verifyEmailIngestion(emailOptions) {
    if (
      typeof emailOptions === 'undefined' ||
      (typeof emailOptions === 'object' && !emailOptions.emailAddress)
    ) {
      throw new Error('Missing email address');
    }

    return {
      method: 'post',
      path: `${endpoints.ingestion}/verifyEmailIngestion`,
      data: emailOptions
    };
  }
};
