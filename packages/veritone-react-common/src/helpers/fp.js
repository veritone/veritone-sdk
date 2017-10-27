import {
  tail,
  isFunction,
  spread,
  constant,
  flow,
  map,
  zip,
  flatten
} from 'lodash';

import { slice as fpSlice } from 'lodash/fp';

// https://gist.github.com/jtheisen/f680afab642454fc0747b21ec3b11e02
export function intersperse(a, f) {
  const pairs = zip(tail(a), fpSlice(0, -1, a));

  const inner = map(pairs, isFunction(f) ? spread(f) : constant(f));
  const interposed = zip(a, inner);

  return flow(flatten, fpSlice(0, -1))(interposed);
}
