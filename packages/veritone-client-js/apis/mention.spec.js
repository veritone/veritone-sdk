import { assertMatches } from '../apis/helper/test-util';
import mentionHandlers from './mention';

describe('Mentions', function() {
  describe('searchMentions', function() {
    it('posts to the search api with the body', function() {
      const data = {
        option: 'my-option'
      };

      const expected = {
        method: 'post',
        path: /search/,
        data
      };

      const result = mentionHandlers.searchMentions(data);
      assertMatches(result, expected);
    });
  });

  describe('getMention', function() {
    it('gets the mentionId with filter in the query', function() {
      const filter = {
        filter: 'my-filter'
      };

      const expected = {
        method: 'get',
        path: /my-mention/,
        query: filter
      };

      const result = mentionHandlers.getMention('my-mention', filter);
      assertMatches(result, expected);
    });
  });

  describe('updateMentionSelectively', function() {
    it('puts to the mentionId with the body', function() {
      const data = {
        mention: 'my-mention'
      };

      const expected = {
        method: 'put',
        path: /my-mention/,
        data
      };

      const result = mentionHandlers.updateMentionSelectively(
        'my-mention',
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('createMentionComment', function() {
    it('puts to the mentionId with the comment', function() {
      const data = {
        comment: 'my-comment'
      };

      const expected = {
        method: 'post',
        path: /my-mention\/comment/,
        data
      };

      const result = mentionHandlers.createMentionComment('my-mention', data);
      assertMatches(result, expected);
    });
  });

  describe('updateMentionComment', function() {
    it('puts to the mentionId/commentId with the comment', function() {
      const data = {
        comment: 'my-comment'
      };

      const expected = {
        method: 'put',
        path: /my-mention\/comment\/my-comment/,
        data
      };

      const result = mentionHandlers.updateMentionComment(
        'my-mention',
        'my-comment',
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('deleteMentionComment', function() {
    it('deletes to the mentionId/commentId with the comment', function() {
      const data = {
        comment: 'my-comment'
      };

      const expected = {
        method: 'delete',
        path: /my-mention\/comment\/my-comment/,
        query: data
      };

      const result = mentionHandlers.deleteMentionComment(
        'my-mention',
        'my-comment',
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('createMentionRating', function() {
    it('posts to the mentionId rating with the rating', function() {
      const data = {
        rating: 'my-rating'
      };

      const expected = {
        method: 'post',
        path: /my-mention\/rating/,
        data
      };

      const result = mentionHandlers.createMentionRating('my-mention', data);
      assertMatches(result, expected);
    });
  });

  describe('updateMentionRating', function() {
    it('puts to the mentionId rating with the rating', function() {
      const data = {
        rating: 'my-rating'
      };

      const expected = {
        method: 'put',
        path: /my-mention\/comment\/my-rating/,
        data
      };

      const result = mentionHandlers.updateMentionRating(
        'my-mention',
        'my-rating',
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('deleteMentionRating', function() {
    it('deletes to the mentionId/commentId with the comment', function() {
      const data = {
        rating: 'my-rating'
      };

      const expected = {
        method: 'delete',
        path: /my-mention\/comment\/my-rating/,
        query: data
      };

      const result = mentionHandlers.deleteMentionRating(
        'my-mention',
        'my-rating',
        data
      );
      assertMatches(result, expected);
    });
  });
});
