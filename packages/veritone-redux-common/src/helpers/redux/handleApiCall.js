import { get, mapValues, partial } from 'lodash';
import { guid } from 'helpers/misc';
import fetchingStatus from './fetchingStatus';
import { createReducer } from './reducer';

// Creates a reducer and selectors that track the loading state for any api call.
// Designed to be used with callGraphQLApi.

// Use (in a module):

// const {
//   reducer: testReducer,
//   selectors: {
//     fetchingStatus: testFetchingStatus,
//     fetchingFailureMessage: testFetchingFailureMessage
//   }
// } = handleApiCall({
//   types: [GET_TEST, GET_TEST_SUCCESS, GET_TEST_FAILURE],
//   stateSelector: state => state.myModule
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

// export { testFetchingStatus, testFetchingFailureMessage }

// There are two options for handling multiple in-flight requests for the same
// resource:

// 1. If a `requestId` is passed to the callGraphQLApi call, that specific request
// (and any others that are given different requestIds) can be tracked individually
// by passing that requestId back to the selectors.

// 2. If no explicit `requestId` is given, only the "latest" call for a given
// resource is tracked. New calls will supersede old ones; old calls will
// still resolve normally, but fetchingStatus() etc will refer to the latest call.

// see tests for examples

function makeApiCallReducer(key, [requestType, successType, failureType]) {
  const defaultState = {
    fetchingStatusByRequestId: {},
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
        fetchingStatusByRequestId: {
          ...state.fetchingStatusByRequestId,
          [_internalRequestId]: fetchingStatus.fetching
        },
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
        fetchingStatusByRequestId: {
          ...state.fetchingStatusByRequestId,
          [_internalRequestId]: fetchingStatus.success
        },
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
        fetchingStatusByRequestId: {
          ...state.fetchingStatusByRequestId,
          [_internalRequestId]: fetchingStatus.failure
        },
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
  fetchingStatus(key, stateSelector, state, optionalRequestId) {
    const requestId =
      optionalRequestId ||
      stateSelector(state).apiCallHandlers[key].activeRequestId;

    return get(
      stateSelector(state).apiCallHandlers,
      [key, 'fetchingStatusByRequestId', requestId],
      fetchingStatus.default
    );
  },

  fetchingStatusByRequestId(key, stateSelector, state) {
    return get(stateSelector(state).apiCallHandlers, [
      key,
      'fetchingStatusByRequestId'
    ]);
  },

  fetchingFailureMessage(key, stateSelector, state, optionalRequestId) {
    const requestId =
      optionalRequestId ||
      stateSelector(state).apiCallHandlers[key].activeRequestId;

    return get(
      selectors.fetchingFailureMessagesByRequestId(key, stateSelector, state),
      requestId,
      ''
    );
  },

  fetchingFailureMessagesByRequestId(key, stateSelector, state) {
    return get(
      stateSelector(state).apiCallHandlers,
      [key, 'fetchingFailureMessagesByRequestId'],
      {}
    );
  }
};
const defaultStateSelector = s => s;
const makeSelectors = (key, stateSelector = defaultStateSelector) =>
  mapValues(selectors, func => partial(func, key, stateSelector));

export default function handleApiCall({
  types: [requestType, successType, failureType],
  stateSelector = defaultStateSelector
}) {
  const key = guid();

  return {
    reducer: makeApiCallReducer(key, [requestType, successType, failureType]),
    selectors: makeSelectors(key, stateSelector),
    _key: key
  };
}
