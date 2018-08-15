import nock from 'nock';
import { makeMockStore } from 'helpers/test/redux';

import * as userConstants from './constants';
import userReducer, * as userModule from './';

const mockStore = makeMockStore();

describe('user module reducer', function() {
  describe('user', function() {
    it('handles user fetch request errors', function() {
      const fetchUserRequestErrorAction = {
        type: userConstants.FETCH_USER,
        error: true,
        payload: new Error()
      };

      const state = userReducer(undefined, fetchUserRequestErrorAction);

      expect(state).toHaveProperty('fetchingFailed', true);
    });
  });

  describe('login', function() {
    it('handles request errors', function() {
      const loginRequestErrorAction = {
        type: userConstants.LOGIN,
        error: true,
        payload: new Error()
      };

      const state = userReducer(undefined, loginRequestErrorAction);

      expect(state).toHaveProperty('loginFailed', true);
    });

    it('sets a good error message for server errors', function() {
      const loginRequestErrorAction = {
        type: userConstants.LOGIN_FAILURE,
        payload: {
          status: 500
        }
      };

      const state = userReducer(undefined, loginRequestErrorAction);

      expect(state).toHaveProperty('loginFailureMessage');
      expect(state.loginFailureMessage).toMatch(/try again/);
    });

    it('sets a good error message for bad credentials', function() {
      const loginRequestErrorAction = {
        type: userConstants.LOGIN_FAILURE,
        payload: {
          name: 'ApiError',
          status: 404
        }
      };

      const state = userReducer(undefined, loginRequestErrorAction);

      expect(state).toHaveProperty('loginFailureMessage');
      expect(state.loginFailureMessage).toMatch(/password/);
    });
  });
});

describe('user module actions', function() {
  afterEach(function() {
    nock.cleanAll();
  });

  describe('login', function() {
    it('exists', function() {
      expect(typeof userModule.login).toBe('function');
    });

    it('makes a POST API call to a login endpoint based on config', function() {
      const store = mockStore({
        auth: {},
        config: {
          apiRoot: 'http://www.test.com'
        }
      });

      const api = nock('http://www.test.com')
        .post(/login/)
        .reply(200, { userName: 'mitch' });

      return store
        .dispatch(
          userModule.login({
            userName: 'mitch',
            password: '123'
          })
        )
        .then(() => api.done());
    });

    it('contains the user object in the payload of its success action', function() {
      const store = mockStore({
        auth: {},
        config: {
          apiRoot: 'http://www.test.com'
        }
      });

      const api = nock('http://www.test.com')
        .post(/login/)
        .reply(200, { userName: 'mitch' });

      return store
        .dispatch(
          userModule.login({
            userName: 'mitch',
            password: '123'
          })
        )
        .then(() => {
          const hasFailureAction = store
            .getActions()
            .some(
              a =>
                a.type === userConstants.LOGIN_SUCCESS &&
                a.payload.userName === 'mitch'
            );

          return expect(hasFailureAction).toBe(true);
        })
        .then(() => api.done());
    });
  });

  describe('fetchUser', function() {
    it('exists', function() {
      expect(typeof userModule.fetchUser).toBe('function');
    });

    it('makes an API call to a user endpoint based on config', function() {
      const store = mockStore({
        config: {
          apiRoot: 'http://www.test.com'
        },
        auth: {
          sessionToken: '123'
        }
      });

      const api = nock('http://www.test.com')
        .get(/user/)
        .reply(200);

      return store.dispatch(userModule.fetchUser()).then(() => api.done());
    });
  });
});
