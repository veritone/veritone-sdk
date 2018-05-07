import { isObject, isFunction, keys } from 'lodash';
// Removes all functions in an object so you can test
// against objects without errors
export const withoutFunctions = (obj) => {
  if (!isObject(obj)) {
    return obj;
  }
  let temp = {}
  const _keys = keys(obj)
  _keys.forEach((k) => {
    if (isObject(obj[k])) {
      temp[k] = withoutFunctions(obj[k]);
    } else if (isFunction(obj[k])) {
      temp[k] = null;
    } else {
      temp[k] = obj[k];
    }
  });
  return temp;
}
