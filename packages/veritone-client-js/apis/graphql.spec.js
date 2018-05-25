import { expect } from 'chai';
import { assertMatches } from '../apis/helper/test-util';
import graphqlHandlers from './graphql';

describe('Graphql', function() {
  describe('Query', function() {
    const query = `
      query getJob($jobId: ID!) {
        job(id: $jobId){
          id,
          name
        }
      }
    `;
    const variables = {
      jobId: 'b469c835-d9da-460f-a6fa-9ff12fe3cbfc'
    };

    it('validates query param', function() {
      expect(() => graphqlHandlers.query()).to.throw('Missing query!');
    });

    it('validates variables param', function() {
      expect(() => graphqlHandlers.query(query, '{ jobId: "123" }')).to.throw(
        'variables must be an object!'
      );
    });

    it('validates operation name param', function() {
      expect(() => graphqlHandlers.query(query, variables, {})).to.throw(
        'operation name must be a string!'
      );
    });

    it('gets the job via id successfully', function() {
      const data = {
        query,
        variables
      };

      const expected = {
        method: 'post',
        path: 'graphql',
        data
      };

      const result = graphqlHandlers.query(query, variables);
      assertMatches(result, expected);
    });
  });
});
