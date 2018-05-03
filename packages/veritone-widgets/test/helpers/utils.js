import _ from 'lodash';
// Removes all functions in an object so you can test
// against objects without errors
export const removeFunctions = (obj) => {
  if (!_.isObject(obj)) {
    return obj;
  }
  let temp = {}
  const keys = _.keys(obj)
  keys.forEach((k) => {
    if (_.isObject(obj[k])) {
      temp[k] = removeFunctions(obj[k]);
    } else if (_.isFunction(obj[k])) {
      temp[k] = null;
    } else {
      temp[k] = obj[k];
    }
  });
  return temp;
}
