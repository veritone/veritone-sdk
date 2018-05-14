import { expect } from 'chai';
import { endpoints } from './config';

import { assertMatches } from '../apis/helper/test-util';
import ingestionHandlers from './ingestion';

describe('Ingestion', function() {
  describe('createIngestion', function() {
    it('posts to the ingestion endpoint with the data', function() {
      const data = {
        data: 'ok'
      };

      const expected = {
        method: 'post',
        path: endpoints.ingestion,
        data
      };

      const result = ingestionHandlers.createIngestion(data);
      assertMatches(result, expected);
    });
  });

  describe('getIngestions', function() {
    it('gets to the ingestion endpoint with additional data in the query', function() {
      const query = {
        query: 'ok'
      };

      const expected = {
        method: 'get',
        path: endpoints.ingestion,
        query
      };

      const result = ingestionHandlers.getIngestions(query);
      assertMatches(result, expected);
    });
  });

  describe('getIngestion', function() {
    it('validates ingestionId', function() {
      expect(() => ingestionHandlers.getIngestion()).to.throw(/ingestionId/);
    });

    it('gets to the ingestion id with additional data in the query', function() {
      const query = {
        query: 'ok'
      };

      const expected = {
        method: 'get',
        path: /ingestion-id/,
        query
      };

      const result = ingestionHandlers.getIngestion('ingestion-id', query);
      assertMatches(result, expected);
    });
  });

  describe('updateIngestion', function() {
    it('validates ingestionId', function() {
      expect(() => ingestionHandlers.updateIngestion()).to.throw(/ingestionId/);
    });

    it('puts to the ingestion id with additional data in the query', function() {
      const data = {
        data: 'ok'
      };

      const expected = {
        method: 'put',
        path: /ingestion-id/,
        data
      };

      const result = ingestionHandlers.updateIngestion('ingestion-id', data);
      assertMatches(result, expected);
    });
  });

  describe('deleteIngestion', function() {
    it('validates ingestionId', function() {
      expect(() => ingestionHandlers.deleteIngestion()).to.throw(/ingestionId/);
    });

    it('gets to the ingestion id with additional data in the query', function() {
      const query = {
        query: 'ok'
      };

      const expected = {
        method: 'delete',
        path: /ingestion-id/,
        query
      };

      const result = ingestionHandlers.deleteIngestion('ingestion-id', query);
      assertMatches(result, expected);
    });
  });

  describe('ingestionConnect', function() {
    it('validates connectOptions', function() {
      expect(() => ingestionHandlers.ingestionConnect()).to.throw(/options/i);
    });

    it('posts to the ingestion connect endpoint with data', function() {
      const data = {
        data: 'ok'
      };

      const expected = {
        method: 'post',
        path: /connect/,
        data
      };

      const result = ingestionHandlers.ingestionConnect(data);
      assertMatches(result, expected);
    });
  });

  describe('verifyEmailIngestion', function() {
    it('validates emailOptions', function() {
      expect(() => ingestionHandlers.verifyEmailIngestion({})).to.throw(
        /email/i
      );
    });

    it('posts to the ingestion connect endpoint with data', function() {
      const data = {
        emailAddress: 'ok'
      };

      const expected = {
        method: 'post',
        path: /verifyEmailIngestion/,
        data
      };

      const result = ingestionHandlers.verifyEmailIngestion(data);
      assertMatches(result, expected);
    });
  });
});
