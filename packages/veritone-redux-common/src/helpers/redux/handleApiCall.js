import { get, without, mapValues, partial } from 'lodash';
import { guid } from 'helpers/misc';
import { createReducer } from './';

// Creates a reducer and selectors that track the loading state for any api call.
// Designed to be used with callGraphQLApi.

// Use (in a module):

// const {
//   reducer: testReducer,
//   selectors: {
//     isFetching: testIsFetching,
//     fetchingFailed: testFetchingFailed,
//     fetchingFailureMessage: testFetchingFailureMessage
//   }
// } = handleApiCall({
//   types: [GET_TEST, GET_TEST_SUCCESS, GET_TEST_FAILURE]
// });

// export default reduceReducers(
//   testReducer,
//   createReducer(defaultState, {
//     // ...other main reducer stuff
//     [GET_TEST_SUCCESS](state, action) {
//       // handleApiCall doesn't store the resource for you; it only tracks loading
//       // states
//       return {
//         ...state,
//         test: action.payload
//       }
//     }
//   })
// )

// export { testIsFetching, testFetchingFailed, testFetchingFailureMessage }

// There are two options for handling multiple in-flight requests for the same
// resource:

// 1. If a `requestId` is passed to the callGraphQLApi call, that specific request
// (and any others that are given different requestIds) can be tracked individually
// by passing that requestId back to the selectors.

// 2. If no explicit `requestId` is given, only the "latest" call for a given
// resource is tracked. New calls will supersede old ones; old calls will
// still resolve normally, but isFetching() etc will refer to the latest call.

// see tests for examples

function makeApiCallReducer(key, [requestType, successType, failureType]) {
  const defaultState = {
    isFetchingRequestIds: [],
    fetchingFailedRequestIds: [],
    fetchingFailureMessagesByRequestId: {},
    activeRequestId: null
  };

  const apiCallReducer = createReducer(defaultState, {
    [requestType](
      state,
      {
        meta: {
          _internalRequestId
          // _shouldTrackRequestsIndividually = false
        } = {}
      }
    ) {
      return {
        isFetchingRequestIds: [
          ...state.isFetchingRequestIds,
          _internalRequestId
        ],
        fetchingFailedRequestIds: without(
          state.fetchingFailedRequestIds,
          _internalRequestId
        ),
        fetchingFailureMessagesByRequestId: {
          ...state.fetchingFailureMessagesByRequestId,
          [_internalRequestId]: ''
        },
        activeRequestId: _internalRequestId
      };
    },

    [successType](
      state,
      {
        meta: {
          _internalRequestId,
          _shouldTrackRequestsIndividually = false
        } = {}
      }
    ) {
      if (
        !_shouldTrackRequestsIndividually &&
        _internalRequestId !== state.activeRequestId
      ) {
        // ignore calls that have been superseded if not tracking individually
        return state;
      }

      return {
        isFetchingRequestIds: without(
          state.isFetchingRequestIds,
          _internalRequestId
        ),
        fetchingFailedRequestIds: without(
          state.fetchingFailedRequestIds,
          _internalRequestId
        ),
        fetchingFailureMessagesByRequestId: {
          ...state.fetchingFailureMessagesByRequestId,
          [_internalRequestId]: ''
        },
        // don't clear active request -- we need it to find the "last" request
        activeRequestId: state.activeRequestId
      };
    },

    [failureType](
      state,
      {
        payload,
        meta: {
          _internalRequestId,
          _shouldTrackRequestsIndividually = false
        } = {}
      }
    ) {
      if (
        !_shouldTrackRequestsIndividually &&
        _internalRequestId !== state.activeRequestId
      ) {
        // ignore calls that have been superseded if not tracking individually
        return state;
      }

      return {
        isFetchingRequestIds: without(
          state.isFetchingRequestIds,
          _internalRequestId
        ),
        fetchingFailedRequestIds: [
          ...state.fetchingFailedRequestIds,
          _internalRequestId
        ],
        fetchingFailureMessagesByRequestId: {
          ...state.fetchingFailureMessagesByRequestId,
          [_internalRequestId]: payload
        },
        // don't clear active request -- we need it to find the "last" request
        activeRequestId: state.activeRequestId
      };
    }
  });

  return (state = {}, action) => {
    let baseState = state.apiCallHandlers
      ? state
      : { apiCallHandlers: { [key]: defaultState } };

    return {
      ...state,
      apiCallHandlers: {
        ...baseState.apiCallHandlers,
        [key]: apiCallReducer(baseState.apiCallHandlers[key], action)
      }
    };
  };
}

const selectors = {
  isFetching: (key, localState, optionalRequestId) => {
    const requestId =
      optionalRequestId || localState.apiCallHandlers[key].activeRequestId;

    return selectors.isFetchingRequestIds(key, localState).includes(requestId);
  },

  isFetchingRequestIds: (key, localState) => {
    return get(localState.apiCallHandlers, [key, 'isFetchingRequestIds'], []);
  },

  fetchingFailed: (key, localState, optionalRequestId) => {
    const requestId =
      optionalRequestId || localState.apiCallHandlers[key].activeRequestId;

    return selectors
      .fetchingFailedRequestIds(key, localState)
      .includes(requestId);
  },

  fetchingFailedRequestIds: (key, localState) => {
    return get(
      localState.apiCallHandlers,
      [key, 'fetchingFailedRequestIds'],
      []
    );
  },

  fetchingFailureMessage: (key, localState, optionalRequestId) => {
    const requestId =
      optionalRequestId || localState.apiCallHandlers[key].activeRequestId;

    return get(
      selectors.fetchingFailureMessagesByRequestId(key, localState),
      requestId,
      ''
    );
  },

  fetchingFailureMessagesByRequestId: (key, localState) => {
    return get(
      localState.apiCallHandlers,
      [key, 'fetchingFailureMessagesByRequestId'],
      {}
    );
  }
};

const makeSelectors = key => mapValues(selectors, func => partial(func, key));

export default function handleApiCall({
  types: [requestType, successType, failureType]
}) {
  const key = guid();

  return {
    reducer: makeApiCallReducer(key, [requestType, successType, failureType]),
    selectors: makeSelectors(key),
    _key: key
  };
}
