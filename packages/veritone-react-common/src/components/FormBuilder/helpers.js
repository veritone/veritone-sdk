import _ from 'lodash';

export function errorChain({data, settings}) {
  return function getError(funcs) {
    if(_.isFunction(funcs)) {
      return funcs({ data, settings });
    }
    if(_.isArray(funcs)) {
      for(let i=0; i < funcs.length; i++) {
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

  return re.test(String(data[name]).toLowerCase()) ? '' : 'Not an email';
}

export function validateEmpty({ data, settings }) {
  const { name, required } = settings;
  if (!required) {
    return;
  }
  return _.isEmpty(data[name]) ? `${name.toUpperCase()} is required` : '';
}

export function validateRange({ data, settings }) {
  const { name, min=0, max=5 } = settings;
  if (data[name] < min) {
    return `${name} should be greater than or equal to ${min}`;
  }
  if (data[name] > max) {
    return `${name} should be less than or equal to ${max}`;
  }
}
