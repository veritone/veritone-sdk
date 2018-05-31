import { expect } from 'chai';

import { assertMatches } from '../apis/helper/test-util';
import collectionHandlers from './collection';

describe('Collection', function() {
  describe('createCollection', function() {
    it('posts to the collection endpoint with collection in the body', function() {
      const data = {
        my: 'collection'
      };

      const expected = {
        method: 'post',
        path: /collection/,
        data
      };

      const result = collectionHandlers.createCollection(data);
      assertMatches(result, expected);
    });
  });

  describe('getCollections', function() {
    it('makes a get request to collections with the provided query', function() {
      const query = {
        my: 'query'
      };

      const expected = {
        method: 'get',
        path: /collection/,
        query
      };

      const result = collectionHandlers.getCollections(query);
      assertMatches(result, expected);
    });
  });

  describe('getCollection', function() {
    it('validates collectionId', function() {
      expect(() => collectionHandlers.getCollection()).to.throw(/collectionId/);
    });

    it('makes a get request to collections with the provided query', function() {
      const query = {
        my: 'query'
      };

      const expected = {
        method: 'get',
        path: /collection-id/,
        query
      };

      const result = collectionHandlers.getCollection('collection-id', query);
      assertMatches(result, expected);
    });
  });

  describe('updateCollection', function() {
    it('validates collectionId', function() {
      expect(() => collectionHandlers.updateCollection()).to.throw(
        /collectionId/
      );
    });

    it('makes a put request to collection with the provided data', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'put',
        path: /collection-id/,
        data
      };

      const result = collectionHandlers.updateCollection('collection-id', data);
      assertMatches(result, expected);
    });
  });

  describe('deleteCollection', function() {
    it('validates collectionId', function() {
      expect(() => collectionHandlers.deleteCollection()).to.throw(
        /collectionId/
      );
    });

    it('makes a delete request to the collection with the id and options in the query', function() {
      const options = {
        additional: 'options'
      };

      const expected = {
        method: 'delete',
        path: /collection/,
        query: {
          collectionId: 'my-collection',
          ...options
        }
      };

      const result = collectionHandlers.deleteCollection(
        'my-collection',
        options
      );
      assertMatches(result, expected);
    });

    it('works with multiple collectionIds', function() {
      const expected = {
        method: 'delete',
        path: /collection/,
        query: {
          collectionId: 'one,two'
        }
      };

      const result = collectionHandlers.deleteCollection(['one', 'two']);
      assertMatches(result, expected);
    });
  });

  describe('shareCollection', function() {
    it('validates collectionId', function() {
      expect(() => collectionHandlers.shareCollection()).to.throw(
        /collectionId/
      );
    });

    it("posts to the collection's share endpoint with the share", function() {
      const data = {
        data: 'ok'
      };

      const expected = {
        method: 'post',
        path: /my-collection\/share/,
        data
      };

      const result = collectionHandlers.shareCollection('my-collection', data);
      assertMatches(result, expected);
    });
  });

  describe('shareMentionFromCollection', function() {
    it('validates collectionId', function() {
      expect(() => collectionHandlers.shareMentionFromCollection()).to.throw(
        /collectionId/
      );
    });

    it('validates collectionId', function() {
      expect(() =>
        collectionHandlers.shareMentionFromCollection('collection-id')
      ).to.throw(/mentionId/);
    });

    it('posts to the collection/mention share endpoint with the share', function() {
      const data = {
        data: 'ok'
      };

      const expected = {
        method: 'post',
        path: /my-collection\/mention\/my-mention\/share/,
        data
      };

      const result = collectionHandlers.shareMentionFromCollection(
        'my-collection',
        'my-mention',
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('getShare', function() {
    it('validates shareId', function() {
      expect(() => collectionHandlers.getShare()).to.throw(/shareId/);
    });

    it('gets the share', function() {
      const options = {
        option: 'ok'
      };

      const expected = {
        method: 'get',
        path: /share\/share-id/,
        query: options
      };

      const result = collectionHandlers.getShare('share-id', options);
      assertMatches(result, expected);
    });
  });

  describe('deleteCollectionMention', function() {
    it('validates collectionId', function() {
      expect(() => collectionHandlers.deleteCollectionMention()).to.throw(
        /collectionId/
      );
    });

    it('validates mentionId', function() {
      expect(() =>
        collectionHandlers.deleteCollectionMention('my-collection')
      ).to.throw(/mentionId/);
    });

    it('deletes to the collection/mention', function() {
      const options = {
        option: 'ok'
      };

      const expected = {
        method: 'delete',
        path: /collection-id\/mention\/mention-id/,
        query: options
      };

      const result = collectionHandlers.deleteCollectionMention(
        'collection-id',
        'mention-id',
        options
      );
      assertMatches(result, expected);
    });
  });

  describe('getMetricsForAllCollections', function() {
    it('gets the metrics endpoint including options', function() {
      const options = {
        option: 'ok'
      };

      const expected = {
        method: 'get',
        path: /metric/,
        query: options
      };

      const result = collectionHandlers.getMetricsForAllCollections(options);
      assertMatches(result, expected);
    });
  });
});
