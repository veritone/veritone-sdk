export function mapObject(obj, fn) {
  let result = {};

  Object.keys(obj).forEach(k => {
    result[k] = fn(obj[k], k, obj);
  });

  return result;
}

export function last(array = []) {
  return array[array.length - 1];
}

export function noop() {}
