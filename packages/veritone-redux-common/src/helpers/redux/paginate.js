import {
  isString,
  isFunction,
  constant,
  range,
  reduce,
  pick,
  get
} from 'lodash';

import { createReducer } from 'helpers/redux';
import fetchingStatus from 'helpers/redux/fetchingStatus';

// Example usage:
// const reducer = reduceReducers(
//   paginate({
//     types: [LIST, LIST_SUCCESS, LIST_FAILURE],
//     key: 'own-engines',
//     filter: (action) => action.meta.type === 'own'
//   }),
//
//   paginate({
//     types: [LIST, LIST_SUCCESS, LIST_FAILURE],
//     key: 'other-engines',
//     filter: (action) => action.meta.type === 'other'
//   }),
//
//   createReducer(defaultState, {
//     [DELETE](state, action) {
//
//     }
//   })
// );

// based on
// https://github.com/reactjs/redux/blob/master/examples/real-world/src/reducers/paginate.js
export default function paginate({
  types,
  invalidateOnTypes = [], // invalidate pagination if we see this
  // todo: invalidationFilter?
  key = 'default',
  // allow a single paginator to manage pagination data for multiple similar responses.
  // ie. LIST_BUILDS has an engineId param, but we can't create a separate paginator
  // for each engine, so in the LIST_BUILDS paginator we keyBy: 'engineId'.

  // engineId data is expected to live at action.meta[engineId].

  // if keyBy is specified, `key` is ignored. In this example to select from a keyBy'd
  // reducer, use ie makeSelectors('engineId1'), makeSelectors('engineId2')

  // keyBy can also be a function, receiving (localState, action.meta), to
  // paginate on other state in the paginated store
  keyBy = null,
  // allow the same actions to be used for multiple pagination types by filtering
  // on something else in the action: (action) => bool
  filter = constant(true),
  idAttribute = 'id',
  selectResponseResults = action =>
    get(action.payload, 'data.results.records', action.payload.results),
  selectResponseTotal = action =>
    get(action.payload, 'data.totalResults.count', action.payload.totalResults)
}) {
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected types to be an array of three elements.');
  }

  if (!types.every(isString)) {
    throw new Error('Expected types to be strings.');
  }

  if (!isString(key)) {
    throw new Error('Expected key to be a string.');
  }

  if (!isFunction(filter)) {
    throw new Error('Expected filter to be a function.');
  }

  if (keyBy && !(isString(keyBy) || isFunction(keyBy))) {
    throw new Error('Expected keyBy to be a string or function.');
  }

  const [requestType, successType, failureType] = types;

  let defaultState = {
    status: fetchingStatus.default,
    // { 5: 'myEngineId' } where 5 is index of myEngineId in overall server data set
    // (object because sparse arrays don't work well)
    idsByPaginationOrder: {},
    // which IDs are currently fetching (based on offset/limit specified)
    fetchingEntities: [],
    failedFetchingEntities: [],
    totalEntities: 0,
    // requestId of active request (so new requests can supersede old ones)
    activeRequestId: null
  };

  const updatePagination = createReducer(defaultState, {
    [requestType](state, action) {
      if (!filter(action)) {
        return state;
      }

      const requestSuccessState = {
        ...state,
        status: fetchingStatus.fetching,
        fetchingEntities: range(
          action.meta.offset,
          action.meta.offset + action.meta.limit
        ),
        failedFetchingEntities: [],
        activeRequestId: action.meta.requestId
      };

      return action.error
        ? // handle requestError ie. offline
          this[failureType](
            {
              ...state,
              // set needed keys for failure handler
              ...pick(requestSuccessState, [
                'fetchingEntities',
                'activeRequestId'
              ])
            },
            action
          )
        : requestSuccessState;
    },

    [successType](state, action) {
      if (!filter(action)) {
        return state;
      }

      const { offset, requestId } = action.meta;

      if (requestId !== state.activeRequestId) {
        // ignore calls that have been superseded
        return state;
      }

      const totalEntities = selectResponseTotal(action) || 0;
      const totalDidChange = state.totalEntities !== totalEntities;

      return {
        ...state,
        status: fetchingStatus.success,

        idsByPaginationOrder: reduce(
          selectResponseResults(action),
          (order, entity, i) => {
            order[i + offset] = entity[idAttribute];
            return order;
            // drop unreliable pagination data if total changes
          },
          totalDidChange ? {} : { ...state.idsByPaginationOrder }
        ),

        fetchingEntities: [],
        failedFetchingEntities: [],
        totalEntities: totalEntities,
        activeRequestId: null
      };
    },

    [failureType](state, action) {
      if (!filter(action)) {
        return state;
      }

      const { requestId } = action.meta;

      if (requestId !== state.activeRequestId) {
        // ignore calls that have been superseded
        return state;
      }

      return {
        ...state,
        status: fetchingStatus.failure,
        fetchingEntities: [],
        failedFetchingEntities: [
          ...state.failedFetchingEntities,
          ...state.fetchingEntities
        ],
        activeRequestId: null
      };
    },

    [CLEAR_PAGINATION](state, action) {
      // fixme-- more granular clearing by key?
      // if (action.payload !== key) {
      //   return state;
      // }

      return {
        ...state,
        // does not cancel in-flight requests
        idsByPaginationOrder: {}
      };
    },

    ...invalidateOnTypes.reduce((res, type) => {
      res[type] = function(...args) {
        return this[CLEAR_PAGINATION](...args);
      };
      return res;
    }, {})
  });

  return (state = {}, action) => {
    let baseKey = keyBy
      ? isString(keyBy)
        ? get(action, ['meta', keyBy], 'init-ignore-this') // fixme?
        : keyBy(state, get(action, 'meta'))
      : key;

    let baseState = state.pagination
      ? state
      : {
          pagination: { [baseKey]: defaultState }
        };

    return {
      ...state,
      pagination: {
        ...baseState.pagination,
        [baseKey]: updatePagination(baseState.pagination[baseKey], action)
      }
    };
  };
}

export const makeSelectors = (key = 'default') => ({
  selectFetchingStatus: localState =>
    get(localState.pagination, [key, 'status']),

  selectPaginationOrder: localState =>
    get(localState.pagination, [key, 'idsByPaginationOrder']),

  selectFetchingEntities: localState =>
    get(localState.pagination, [key, 'fetchingEntities']),

  selectFailedFetchingEntities: localState =>
    get(localState.pagination, [key, 'failedFetchingEntities']),

  selectTotalEntities: localState =>
    get(localState.pagination, [key, 'totalEntities'])
});

const CLEAR_PAGINATION = 'vtn/pagination/CLEAR_PAGINATION';
export function clearPagination(key = 'default') {
  return {
    type: CLEAR_PAGINATION,
    payload: key
  };
}
