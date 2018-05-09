import { endpoints } from './config';

export default {
  searchMentions(options) {
    return {
      method: 'post',
      path: `${endpoints.mention}/search`,
      data: options
    };
  },

  getMention(mentionId, filter) {
    return {
      method: 'get',
      path: `${endpoints.mention}/${mentionId}`,
      query: filter
    };
  },

  updateMentionSelectively(mentionId, mention) {
    return {
      method: 'put',
      path: `${endpoints.mention}/${mentionId}`,
      data: mention
    };
  },

  createMentionComment(mentionId, comment) {
    return {
      method: 'post',
      path: `${endpoints.mention}/${mentionId}/comment`,
      data: comment
    };
  },

  updateMentionComment(mentionId, commentId, comment) {
    return {
      method: 'put',
      path: `${endpoints.mention}/${mentionId}/comment/${commentId}`,
      data: comment
    };
  },

  deleteMentionComment(mentionId, commentId, comment) {
    return {
      method: 'delete',
      path: `${endpoints.mention}/${mentionId}/comment/${commentId}`,
      query: comment
    };
  },

  createMentionRating(mentionId, rating) {
    return {
      method: 'post',
      path: `${endpoints.mention}/${mentionId}/rating`,
      data: rating
    };
  },

  updateMentionRating(mentionId, ratingId, rating) {
    return {
      method: 'put',
      path: `${endpoints.mention}/${mentionId}/comment/${ratingId}`,
      data: rating
    };
  },

  deleteMentionRating(mentionId, ratingId, rating) {
    return {
      method: 'delete',
      path: `${endpoints.mention}/${mentionId}/comment/${ratingId}`,
      query: rating
    };
  }
};
