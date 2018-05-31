import { endpoints } from './config';

export default {
  query(query, variables, operationName) {
    if (typeof query !== 'string' || query === '') {
      throw new Error('Missing query!');
    }
    if (variables && typeof variables !== 'object') {
      throw new Error('variables must be an object!');
    }
    if (operationName && typeof operationName !== 'string') {
      throw new Error('operation name must be a string!');
    }

    return {
      method: 'post',
      path: endpoints.graphql,
      data: {
        query,
        variables,
        operationName
      },
      _requestOptions: {
        version: 3
      }
    };
  }
};
