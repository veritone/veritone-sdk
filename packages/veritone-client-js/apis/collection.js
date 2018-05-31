import { endpoints } from './config';

export default {
  createCollection(collection) {
    return {
      method: 'post',
      path: endpoints.collection,
      data: collection
    };
  },

  getCollections(options = {}) {
    return {
      method: 'get',
      path: endpoints.collection,
      query: options
    };
  },

  getCollection(collectionId, options = {}) {
    if (typeof collectionId !== 'string' || collectionId === '') {
      throw new Error('Missing collectionId');
    }

    return {
      method: 'get',
      path: `${endpoints.collection}/${collectionId}`,
      query: options
    };
  },

  updateCollection(collectionId, patch) {
    if (typeof collectionId !== 'string' || collectionId === '') {
      throw new Error('Missing collectionId');
    }

    return {
      method: 'put',
      path: `${endpoints.collection}/${collectionId}`,
      data: patch
    };
  },

  deleteCollection(collectionId, options = {}) {
    var ids = Array.isArray(collectionId)
      ? collectionId.join(',')
      : collectionId;

    if (typeof ids !== 'string' || ids === '') {
      throw new Error('Missing collectionId');
    }

    options.collectionId = ids;

    return {
      method: 'delete',
      path: endpoints.collection,
      query: options
    };
  },

  shareCollection(collectionId, share) {
    if (typeof collectionId !== 'string' || collectionId === '') {
      throw new Error('Missing collectionId');
    }

    return {
      method: 'post',
      path: `${endpoints.collection}/${collectionId}/share`,
      data: share
    };
  },

  shareMentionFromCollection(collectionId, mentionId, share) {
    if (typeof collectionId !== 'string' || collectionId === '') {
      throw new Error('Missing collectionId');
    }

    if (typeof mentionId !== 'string' || mentionId === '') {
      throw new Error('Missing mentionId');
    }

    return {
      method: 'post',
      path: `${
        endpoints.collection
      }/${collectionId}/mention/${mentionId}/share`,
      data: share
    };
  },

  getShare(shareId, options = {}) {
    if (typeof shareId !== 'string' || shareId === '') {
      throw new Error('Missing shareId');
    }

    return {
      method: 'get',
      path: `${endpoints.collection}/share/${shareId}`,
      query: options
    };
  },

  deleteCollectionMention(collectionId, mentionId, options) {
    if (typeof collectionId !== 'string' || collectionId === '') {
      throw new Error('Missing collectionId');
    }

    if (typeof mentionId !== 'string' || mentionId === '') {
      throw new Error('Missing mentionId');
    }

    return {
      method: 'delete',
      path: `${endpoints.collection}/${collectionId}/mention/${mentionId}`,
      query: options
    };
  },

  getMetricsForAllCollections(options = {}) {
    return {
      method: 'get',
      path: endpoints.metrics,
      query: options
    };
  }
};
