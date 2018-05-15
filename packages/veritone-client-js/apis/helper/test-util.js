import { get, isRegExp, forOwn, isPlainObject } from 'lodash';

// matches({
// 	a: 'some/path/with/id',
// 	b: 'exact-value'
// }, {
// 	a: /id/,
// 	b: 'exact-value'
// }) === true

function walk(obj, cb, path = '') {
  forOwn(obj, (v, k) => {
    const newPath = path === '' ? k : `${path}.${k}`;

    if (isPlainObject(v)) {
      return walk(v, cb, newPath);
    }

    cb(v, k, newPath);
  });
}

// do nothing if obj matches source, otherwise throw a relevant error.
// obj/source are deep-compared; if sourceVal is a string, the matching
// objectVal is compared with ===. if sourceVal is a regex, objectVal is
// tested against it.
export function assertMatches(obj, source) {
  return walk(source, (srcVal, key, path) => {
    const objVal = get(obj, path);

    if (isRegExp(srcVal)) {
      if (!srcVal.test(objVal)) {
        throw new Error(
          `Expected ${objVal} to match ${srcVal} at path "${path}"`
        );
      }

      return true;
    }

    if (srcVal !== objVal) {
      throw new Error(
        `Expected "${objVal}" to equal "${srcVal}" at path "${path}"`
      );
    }
  });
}
