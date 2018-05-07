import {
  WAIT_FOR_ACTION,
  ERROR_ACTION,
  CALLBACK_ARGUMENT,
  CALLBACK_ERROR_ARGUMENT,
  promiseMiddleware
} from './promiseMiddleware';

describe('Middleware: promiseMiddleware', () => {
  const mockStore = {};
  const mockNext = () => {};
  let action;

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
    const promWrap = promiseMiddleware()(mockStore)(mockNext);
    action = {
      type: 'TEST'
    }
    
    expect(promWrap(action)).toBeUndefined();
  });

  it('should return promise if symbols are present', () => {
    const promWrap = promiseMiddleware()(mockStore)(mockNext);
    action = {
      type: 'TEST',
      [WAIT_FOR_ACTION]: 'TEST_SUCCESS'
    }
    
    expect(promWrap(action)).toBeInstanceOf(Promise);
  });

  it('should resolve promise on successful action', () => {
    const promWrap = promiseMiddleware()(mockStore)(mockNext);
    action = {
      type: 'TEST',
      [WAIT_FOR_ACTION]: 'TEST_SUCCESS'
    }
    const successAction = {
      type: 'TEST_SUCCESS',
      payload: 'winnerwinner'
    }
    const prom = promWrap(action);
    prom.then(result => {
      return expect(result).toBe('winnerwinner');
    });
    expect(promWrap(successAction)).toBeUndefined();
  });

  it('should reject promise on error action and grab payload', () => {
    const promWrap = promiseMiddleware()(mockStore)(mockNext);
    action = {
      type: 'TEST',
      [WAIT_FOR_ACTION]: 'TEST_SUCCESS',
      [ERROR_ACTION]: 'TEST_ERROR',
      [CALLBACK_ERROR_ARGUMENT]: action => action.payload
    }
    const errorAction = {
      type: 'TEST_ERROR',
      payload: 'loserloser'
    }
    const prom = promWrap(action);
    prom.catch(result => {
      return expect(result).toBe('loserloser');
    });
    expect(promWrap(errorAction)).toBeUndefined();
  });
});
