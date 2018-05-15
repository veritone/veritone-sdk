import { expect } from 'chai';
import { endpoints } from './config';

import { assertMatches } from '../apis/helper/test-util';
import searchHandlers from './search';

describe('search', function() {
  it('validates searchRequest', function() {
    expect(() => searchHandlers.search()).to.throw(/search/);
  });

  it('posts to the search endpoint', function() {
    const data = {
      my: 'search'
    };

    const expected = {
      method: 'post',
      path: endpoints.search,
      data
    };

    const result = searchHandlers.search(data);
    assertMatches(result, expected);
  });
});
