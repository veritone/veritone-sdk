import { expect } from 'chai';

import { endpoints } from './config';
import { assertMatches } from '../apis/helper/test-util';
import dropboxHandlers from './dropbox';

describe('DropboxWatcher', function() {
  describe('getDropboxWatchers', function() {
    it('validates options', function() {
      expect(() => dropboxHandlers.getDropboxWatchers()).to.throw(/options/);
    });

    it('makes the correct request to the api', function() {
      const expected = {
        method: 'get',
        path: new RegExp(endpoints.dropboxWatcher),
        query: {
          watcherId: 'watcher-id'
        }
      };

      const result = dropboxHandlers.getDropboxWatchers({
        watcherId: 'watcher-id'
      });
      assertMatches(result, expected);
    });

    it('accepts watcherId as a string', function() {
      const expected = {
        method: 'get',
        path: new RegExp(endpoints.dropboxWatcher),
        query: {
          watcherId: 'watcher-id'
        }
      };

      const result = dropboxHandlers.getDropboxWatchers('watcher-id');
      assertMatches(result, expected);
    });
  });

  describe('createDropboxWatcher', function() {
    it('makes the correct request to the api', function() {
      const expected = {
        method: 'post',
        path: new RegExp(endpoints.dropboxWatcher),
        data: {
          watcherId: 'watcher-id'
        }
      };

      const result = dropboxHandlers.createDropboxWatcher({
        watcherId: 'watcher-id'
      });
      assertMatches(result, expected);
    });
  });

  describe('getDropboxWatcher', function() {
    it('validates watcherId', function() {
      expect(() => dropboxHandlers.getDropboxWatcher()).to.throw(/watcherId/);
    });

    it('makes the correct request to the api', function() {
      const expected = {
        method: 'get',
        path: /watcher-id/
      };

      const result = dropboxHandlers.getDropboxWatcher('watcher-id');
      assertMatches(result, expected);
    });
  });

  describe('updateDropboxWatcher', function() {
    it('validates watcher', function() {
      expect(() => dropboxHandlers.updateDropboxWatcher()).to.throw(/watcher/);
    });

    it('makes the correct request to the api', function() {
      const expected = {
        method: 'put',
        path: /watcher-id/,
        data: {
          watcherId: 'watcher-id'
        }
      };

      const result = dropboxHandlers.updateDropboxWatcher({
        watcherId: 'watcher-id'
      });
      assertMatches(result, expected);
    });
  });

  describe('deleteDropboxWatcher', function() {
    it('validates watcherId', function() {
      expect(() => dropboxHandlers.deleteDropboxWatcher()).to.throw(
        /watcherId/
      );
    });

    it('makes the correct request to the api', function() {
      const expected = {
        method: 'delete',
        path: /watcher-id/
      };

      const result = dropboxHandlers.deleteDropboxWatcher('watcher-id');
      assertMatches(result, expected);
    });
  });
});
