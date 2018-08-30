import { isNil, get, set, isPlainObject } from 'lodash';

export const requireFields = (
  fields = [],
  { message = 'Required' } = {}
) => formValues => {
  return fields.reduce((result, field) => {
    if (isNil(get(formValues, field)) || get(formValues, field) === '') {
      set(result, field, message);
    }

    return result;
  }, {});
};

export function flattenObject(obj, concatenator = '.') {
  return Object.keys(obj).reduce((acc, key) => {
    if (!isPlainObject(obj[key])) {
      return {
        ...acc,
        [key]: obj[key]
      };
    }

    const flattenedChild = flattenObject(obj[key], concatenator);

    return {
      ...acc,
      ...Object.keys(flattenedChild).reduce(
        (childAcc, childKey) => ({
          ...childAcc,
          [`${key}${concatenator}${childKey}`]: flattenedChild[childKey]
        }),
        {}
      )
    };
  }, {});
}
