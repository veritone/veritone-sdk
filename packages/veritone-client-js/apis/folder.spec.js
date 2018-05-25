import { expect } from 'chai';

import { assertMatches } from '../apis/helper/test-util';
import folderHandlers from './folder';

describe('Folder', function() {
  describe('getRootTreeFolder', function() {
    it('validates organizationId', function() {
      expect(() =>
        folderHandlers.getRootTreeFolder(null, 'user-id', 'folder-type')
      ).to.throw(/organizationId/);
    });

    it('validates userId', function() {
      expect(() =>
        folderHandlers.getRootTreeFolder('org-id', null, 'folder-type')
      ).to.throw(/userId/);
    });

    it('validates rootFolderType', function() {
      expect(() =>
        folderHandlers.getRootTreeFolder('org-id', 'user-id', null)
      ).to.throw(/rootFolderType/);
    });

    it('gets the widgetId with extra data in the query', function() {
      const query = {
        query: 'my-query'
      };

      const expected = {
        method: 'get',
        path: /org-id\/user-id\/type\/folder-type/,
        query
      };

      const result = folderHandlers.getRootTreeFolder(
        'org-id',
        'user-id',
        'folder-type',
        query
      );
      assertMatches(result, expected);
    });

    it('can be called without options', function() {
      const expected = {
        method: 'get',
        path: /org-id\/user-id\/type\/folder-type/
      };

      const result = folderHandlers.getRootTreeFolder(
        'org-id',
        'user-id',
        'folder-type'
      );
      assertMatches(result, expected);
    });
  });

  describe('getTreeObject', function() {
    it('validates organizationId', function() {
      expect(() => folderHandlers.getTreeObject(null)).to.throw(
        /organizationId/
      );
    });

    it('gets the treeObjectId with extra data in the query', function() {
      const query = {
        query: 'my-query'
      };

      const expected = {
        method: 'get',
        path: /tree-object-id/,
        query
      };

      const result = folderHandlers.getTreeObject('tree-object-id', query);
      assertMatches(result, expected);
    });
  });

  describe('createTreeFolder', function() {
    it('validates treeFolder', function() {
      expect(() => folderHandlers.createTreeFolder()).to.throw(/tree folder/);
    });

    it('posts the treeFolder', function() {
      const data = {
        treeFolder: 'my-tree-folder'
      };

      const expected = {
        method: 'post',
        path: /folder/,
        data
      };

      const result = folderHandlers.createTreeFolder(data);
      assertMatches(result, expected);
    });
  });

  describe('createTreeObject', function() {
    it('validates treeObject', function() {
      expect(() => folderHandlers.createTreeObject()).to.throw(/tree object/);
    });

    it('posts the treeObject', function() {
      const data = {
        treeObject: 'my-tree-object'
      };

      const expected = {
        method: 'post',
        path: /object/,
        data
      };

      const result = folderHandlers.createTreeObject(data);
      assertMatches(result, expected);
    });
  });

  describe('moveTreeFolder', function() {
    it('validates treeObjectId', function() {
      expect(() => folderHandlers.moveTreeFolder()).to.throw(/object id/);
    });

    it('validates treeFolderMoveObj', function() {
      expect(() => folderHandlers.moveTreeFolder('id')).to.throw(/move/);
    });

    it('puts the treeFolderMoveObj to the tree object id', function() {
      const data = {
        treeObject: 'my-tree-object'
      };

      const expected = {
        method: 'put',
        path: /move\/tree-object-id/,
        data
      };

      const result = folderHandlers.moveTreeFolder('tree-object-id', data);
      assertMatches(result, expected);
    });
  });

  describe('updateTreeFolder', function() {
    it('validates treeObjectId', function() {
      expect(() => folderHandlers.updateTreeFolder()).to.throw(/object id/);
    });

    it('validates treeFolderObj', function() {
      expect(() => folderHandlers.updateTreeFolder('id')).to.throw(/folder/);
    });

    it('puts the treeFolderObj to the tree object id', function() {
      const data = {
        treeObject: 'my-tree-object'
      };

      const expected = {
        method: 'put',
        path: /tree-object-id/,
        data
      };

      const result = folderHandlers.updateTreeFolder('tree-object-id', data);
      assertMatches(result, expected);
    });
  });

  describe('deleteTreeFolder', function() {
    it('validates treeObjectId', function() {
      expect(() => folderHandlers.deleteTreeFolder()).to.throw(/tree/);
    });

    it('deletes the treeObjectId with extra options in params', function() {
      const query = {
        my: 'query'
      };

      const expected = {
        method: 'delete',
        path: /tree-object-id/,
        query
      };

      const result = folderHandlers.deleteTreeFolder('tree-object-id', query);
      assertMatches(result, expected);
    });
  });

  describe('deleteTreeObject', function() {
    it('validates treeObjectId', function() {
      expect(() => folderHandlers.deleteTreeObject()).to.throw(/folder/);
    });

    it('deletes the treeObjectId with extra options in params', function() {
      const query = {
        my: 'query'
      };

      const expected = {
        method: 'delete',
        path: /object\/tree-object-id/,
        query
      };

      const result = folderHandlers.deleteTreeObject('tree-object-id', query);
      assertMatches(result, expected);
    });
  });

  describe('searchTreeFolder', function() {
    it('validates queryTerms', function() {
      expect(() => folderHandlers.searchTreeFolder()).to.throw(/terms/);
    });

    it('posts to the search endpoint with queryTerms in the body', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'post',
        path: /search/,
        data
      };

      const result = folderHandlers.searchTreeFolder(data);
      assertMatches(result, expected);
    });
  });

  describe('folderSummary', function() {
    it('validates queryTerms', function() {
      expect(() => folderHandlers.folderSummary()).to.throw(/terms/);
    });

    it('posts to the summary endpoint with queryTerms in the body', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'post',
        path: /summary/,
        data
      };

      const result = folderHandlers.folderSummary(data);
      assertMatches(result, expected);
    });
  });
});
