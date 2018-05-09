import { endpoints } from './config';

export default {
  search: function search(searchRequest) {
    if (typeof searchRequest !== 'object') {
      throw new Error('Missing search request!');
    }

    return {
      method: 'post',
      path: endpoints.search,
      data: searchRequest
    };
  }
};
