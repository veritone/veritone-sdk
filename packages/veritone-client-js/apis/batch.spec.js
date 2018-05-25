import { endpoints } from './config';

import { assertMatches } from '../apis/helper/test-util';
import batchHandlers from './batch';

describe('Batch', function() {
  it('posts to the batch endpoint', function() {
    const data = {
      my: 'batch'
    };

    const expected = {
      method: 'post',
      path: endpoints.batch,
      data
    };

    const result = batchHandlers.batch(data);
    assertMatches(result, expected);
  });
});
