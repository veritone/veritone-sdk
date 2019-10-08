import _ from 'lodash';

export function errorChain({ data, settings }) {
  return function getError(funcs) {
    if (_.isFunction(funcs)) {
      return funcs({ data, settings });
    }
    if (_.isArray(funcs)) {
      for (let i = 0; i < funcs.length; i++) {
        const error = funcs[i]({ data, settings });
        if (!_.isEmpty(error)) {
          return error;
        }
      }
    }
  }
}

export function validateEmail({ data, settings }) {
  const { name } = settings;
  const re = /.+@.+\..+/;

  return re.test(String(data[name]).toLowerCase()) ? '' : 'Please enter a valid email address';
}

export function validateEmpty({ data, settings }) {
  const { name, required } = settings;
  if (!required) {
    return;
  }
  return _.isEmpty(data[name]) ? `${name.toUpperCase()} is required` : '';
}

export function validateRange({ data, settings }) {
  const { name, min, max } = settings;
  if (_.isNumber(min) && _.isNumber(max) && (data[name] < min || data[name] > max)) {
    return `${name} must be between ${min} and ${max}`;
  }
  if (_.isNumber(min) && data[name] < min) {
    return `Minimum required ${name} is ${min}`;
  }
  if (_.isNumber(max) && data[name] > max) {
    return `Maximum ${name} can be ${max}`;
  }
  return '';
}
