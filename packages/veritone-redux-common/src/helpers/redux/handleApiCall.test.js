import handleApiCall from './handleApiCall';

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
  });


  const {
    reducer: testReducer,
    selectors: { isFetching, fetchingFailed, fetchingFailureMessage }
  } = handleApiCall({
    types: [GET, GET_SUCCESS, GET_FAILURE]
  });

  describe('handleApiCall reducer', function() {
    it('sets isFetching when a call is made', function() {
      let state = testReducer(undefined, {});

      expect(isFetching(state)).toEqual(false);

      state = [
        undefined,

        {
          type: GET,
          meta: {
            _internalRequestId: 1
          }
        }
      ].reduce(testReducer);

      expect(isFetching(state)).toEqual(true);
    });

    it('sets fetchingFailed when a call fails', function() {
      let state = testReducer(undefined, {});

      expect(fetchingFailed(state)).toEqual(false);

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

      expect(fetchingFailed(state)).toEqual(true);
    });

    it('updates the failure message when a call fails', function() {
      let state = testReducer(undefined, {});

      expect(fetchingFailed(state)).toEqual(false);

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

      expect(fetchingFailed(state)).toEqual(true);
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

      expect(isFetching(state)).toEqual(true);

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

      expect(isFetching(finishedState)).toEqual(false);
      expect(fetchingFailed(finishedState)).toEqual(false);
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

    expect(isFetching(state, 'my-first-request')).toEqual(false);
    expect(fetchingFailed(state, 'my-first-request')).toEqual(true);
    expect(fetchingFailureMessage(state, 'my-first-request')).toEqual(
      'something went wrong'
    );

    expect(isFetching(state, 'my-second-request')).toEqual(true);
    expect(fetchingFailed(state, 'my-second-request')).toEqual(false);
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

    expect(isFetching(finishedState, 'my-second-request')).toEqual(false);
    expect(fetchingFailed(finishedState, 'my-second-request')).toEqual(false);
  });
});
