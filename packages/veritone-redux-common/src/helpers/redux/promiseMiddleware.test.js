import {
  WAIT_FOR_ACTION,
  ERROR_ACTION,
  CALLBACK_ARGUMENT,
  CALLBACK_ERROR_ARGUMENT,
  promiseMiddleware
} from './promiseMiddleware';

describe('Middleware: promiseMiddleware', () => {
  let action;
  let promWrap;
  const successAction = {
    type: 'TEST_SUCCESS',
    payload: 'winnerwinner'
  };
  const errorAction = {
    type: 'TEST_ERROR',
    payload: 'loserloser'
  };

  beforeEach(() => {
    const mockStore = {};
    const mockNext = () => {};
    promWrap = promiseMiddleware()(mockStore)(mockNext);
  });

  it('exports symbols', () => {
    expect(typeof WAIT_FOR_ACTION).toBe('symbol');
    expect(typeof ERROR_ACTION).toBe('symbol');
    expect(typeof CALLBACK_ARGUMENT).toBe('symbol');
    expect(typeof CALLBACK_ERROR_ARGUMENT).toBe('symbol');
  });

  it('passes middleware function', () => {
    expect(typeof promiseMiddleware).toBe('function');
  });

  it('should not return promise if symbols are not present', () => {
    action = { type: 'TEST' };
    expect(promWrap(action)).toBeUndefined();
  });

  it('should return promise if symbols are present', () => {
    action = {
      type: 'TEST',
      [WAIT_FOR_ACTION]: 'TEST_SUCCESS'
    };
    expect(promWrap(action)).toBeInstanceOf(Promise);
  });

  it('should resolve promise on successful action', () => {
    expect.assertions(2);
    action = {
      type: 'TEST',
      [WAIT_FOR_ACTION]: 'TEST_SUCCESS'
    };
    const prom = promWrap(action);
    expect(promWrap(successAction)).toBeUndefined();
    return expect(prom).resolves.toBe('winnerwinner');
  });

  it('should reject promise on error action and grab payload', () => {
    expect.assertions(2);
    action = {
      type: 'TEST',
      [WAIT_FOR_ACTION]: 'TEST_SUCCESS',
      [ERROR_ACTION]: 'TEST_ERROR',
      [CALLBACK_ERROR_ARGUMENT]: action => action.payload
    };
    const prom = promWrap(action);
    expect(promWrap(errorAction)).toBeUndefined();
    return expect(prom).rejects.toBe('loserloser');
  });
});
