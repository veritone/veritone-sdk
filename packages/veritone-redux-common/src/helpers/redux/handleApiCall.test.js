import { combineReducers } from 'redux';
import handleApiCall from './handleApiCall';
import fetchingStatus from './fetchingStatus';

const GET = 'GET';
const GET_SUCCESS = 'GET_SUCCESS';
const GET_FAILURE = 'GET_FAILURE';

describe('handleApiCall reducer factory', function() {
  describe('handleApiCall reducer configuration', function() {
    it('stores its state at the configured key', function() {
      const { reducer, _key } = handleApiCall({
        types: [GET, GET_SUCCESS, GET_FAILURE]
      });

      let state = [
        undefined,

        {
          type: GET,
          meta: {
            _internalRequestId: 1,
            offset: 0
          }
        },

        {
          type: GET_SUCCESS,
          payload: {
            results: [{ id: 1 }]
          },
          meta: {
            _internalRequestId: 1,
            offset: 0
          }
        }
      ].reduce(reducer);

      expect(state.apiCallHandlers[_key]).toBeTruthy();
    });

    it('creates all needed selectors', function() {
      const { selectors } = handleApiCall({
        types: [GET, GET_SUCCESS, GET_FAILURE]
      });

      [
        'fetchingStatus',
        'fetchingStatusByRequestId',
        'fetchingFailureMessage',
        'fetchingFailureMessagesByRequestId'
      ].forEach(name => expect(selectors).toHaveProperty(name));
    });
  });

  const {
    reducer: testReducer,
    selectors: {
      fetchingStatusByRequestId,
      fetchingStatus: selectFetchingStatus,
      fetchingFailureMessage
    }
  } = handleApiCall({
    types: [GET, GET_SUCCESS, GET_FAILURE]
  });

  describe('handleApiCall reducer', function() {
    it('sets isFetching when a call is made', function() {
      let state = testReducer(undefined, {});

      expect(selectFetchingStatus(state)).toEqual(fetchingStatus.default);

      state = [
        undefined,

        {
          type: GET,
          meta: {
            _internalRequestId: 1
          }
        }
      ].reduce(testReducer);

      expect(selectFetchingStatus(state)).toEqual(fetchingStatus.fetching);
    });

    it('sets fetchingFailed when a call fails', function() {
      let state = testReducer(undefined, {});

      expect(selectFetchingStatus(state)).toEqual(fetchingStatus.default);

      state = [
        undefined,

        {
          type: GET,
          meta: {
            _internalRequestId: 1
          }
        },

        {
          type: GET_FAILURE,
          error: true,
          meta: {
            _internalRequestId: 1
          }
        }
      ].reduce(testReducer);

      expect(selectFetchingStatus(state)).toEqual(fetchingStatus.failure);
    });

    it('updates the failure message when a call fails', function() {
      let state = testReducer(undefined, {});

      expect(selectFetchingStatus(state)).toEqual(fetchingStatus.default);

      state = [
        undefined,

        {
          type: GET,
          meta: {
            _internalRequestId: 1
          }
        },

        {
          type: GET_FAILURE,
          error: true,
          meta: {
            _internalRequestId: 1
          },
          payload: 'There was an error' // fixme -- wrap in array?
        }
      ].reduce(testReducer);

      expect(selectFetchingStatus(state)).toEqual(fetchingStatus.failure);
      expect(fetchingFailureMessage(state)).toEqual('There was an error');
    });

    it('ignores requests that have been superseded (by default)', function() {
      const state = [
        undefined,
        {
          type: GET,
          meta: {
            _internalRequestId: 1
          }
        },

        {
          type: GET,
          meta: {
            _internalRequestId: 2
          }
        },

        // ignores for both failure type...
        {
          type: GET_FAILURE,
          error: true,
          meta: {
            _internalRequestId: 1
          }
        },

        // ...and success type
        {
          type: GET_SUCCESS,
          payload: {
            results: []
          },
          meta: {
            _internalRequestId: 1
          }
        }
      ].reduce(testReducer);

      expect(selectFetchingStatus(state)).toEqual(fetchingStatus.fetching);

      const finishedState = [
        {
          type: GET_SUCCESS,
          payload: {
            results: []
          },
          meta: {
            _internalRequestId: 2
          }
        }
      ].reduce(testReducer, state);

      expect(selectFetchingStatus(finishedState)).toEqual(
        fetchingStatus.success
      );
      expect(fetchingFailureMessage(finishedState)).toEqual('');
    });
  });

  it('allows requestId to be provided, and tracks individual calls by that ID', function() {
    const state = [
      undefined,
      {
        type: GET,
        meta: {
          _internalRequestId: 'my-first-request',
          _shouldTrackRequestsIndividually: true
        }
      },

      {
        type: GET,
        meta: {
          _internalRequestId: 'my-second-request',
          _shouldTrackRequestsIndividually: true
        }
      },

      // request 1 fails
      {
        type: GET_FAILURE,
        error: true,
        payload: 'something went wrong',
        meta: {
          _internalRequestId: 'my-first-request',
          _shouldTrackRequestsIndividually: true
        }
      }
    ].reduce(testReducer);

    expect(selectFetchingStatus(state, 'my-first-request')).toEqual(
      fetchingStatus.failure
    );
    expect(fetchingFailureMessage(state, 'my-first-request')).toEqual(
      'something went wrong'
    );

    expect(selectFetchingStatus(state, 'my-second-request')).toEqual(
      fetchingStatus.fetching
    );
    expect(fetchingFailureMessage(state, 'my-second-request')).toEqual('');

    const finishedState = [
      // request 2 succeeds
      {
        type: GET_SUCCESS,
        payload: {
          results: []
        },
        meta: {
          _internalRequestId: 'my-second-request',
          _shouldTrackRequestsIndividually: true
        }
      }
    ].reduce(testReducer, state);

    expect(selectFetchingStatus(finishedState, 'my-second-request')).toEqual(
      fetchingStatus.success
    );

    expect(fetchingStatusByRequestId(finishedState)).toEqual({
      'my-first-request': fetchingStatus.failure,
      'my-second-request': fetchingStatus.success
    });
  });

  it("allows stateSelector to be provided, and uses it to look up state in an app's nested reducers", function() {
    const {
      reducer: testReducer,
      selectors: {
        fetchingStatusByRequestId,
        fetchingStatus: selectFetchingStatus,
        fetchingFailureMessage
      }
    } = handleApiCall({
      types: [GET, GET_SUCCESS, GET_FAILURE],
      stateSelector: state => state.test
    });

    const reducer = combineReducers({
      app: state => ({}),
      test: testReducer
    });

    const state = [
      undefined,
      {
        type: GET,
        meta: {
          _internalRequestId: 1
        }
      },
      {
        type: GET_FAILURE,
        error: true,
        payload: 'there was an error',
        meta: {
          _internalRequestId: 1
        }
      }
    ].reduce(reducer);

    expect(fetchingStatusByRequestId(state)).toEqual({
      1: fetchingStatus.failure
    });
    expect(selectFetchingStatus(state, 1)).toEqual(fetchingStatus.failure);
    expect(fetchingFailureMessage(state, 1)).toEqual('there was an error');
  });
});
