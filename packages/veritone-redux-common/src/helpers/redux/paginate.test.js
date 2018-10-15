import fetchingStatus from 'helpers/redux/fetchingStatus';
import paginate, {
  makeSelectors,
  clearPagination
} from 'helpers/redux/paginate';

const LIST = 'LIST';
const LIST_SUCCESS = 'LIST_SUCCESS';
const LIST_FAILURE = 'LIST_FAILURE';

const testReducer = paginate({
  types: [LIST, LIST_SUCCESS, LIST_FAILURE]
});

const testSelectors = makeSelectors();

describe('redux pagination reducer factory', function() {
  describe('pagination reducer configuration', function() {
    it('stores its state at the configured key', function() {
      const keyReducer = paginate({
        types: [LIST, LIST_SUCCESS, LIST_FAILURE],
        key: 'myKey'
      });

      const keySelectors = makeSelectors('myKey');

      let state = [
        undefined,

        {
          type: LIST,
          meta: {
            requestId: 1,
            offset: 0
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: [{ id: 1 }]
          },
          meta: {
            requestId: 1,
            offset: 0
          }
        }
      ].reduce(keyReducer);

      expect(state.pagination.myKey).toBeTruthy();
      expect(state.pagination.pagination).toBeFalsy(); // default

      expect(keySelectors.selectPaginationOrder(state)).toEqual({ 0: 1 });
    });

    it('selects entities with a custom idAttribute', function() {
      const idAttributeReducer = paginate({
        types: [LIST, LIST_SUCCESS, LIST_FAILURE],
        idAttribute: 'thingId'
      });

      const idAttributeSelectors = makeSelectors();

      let state = [
        undefined,

        {
          type: LIST,
          meta: {
            requestId: 1,
            offset: 0
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: [{ thingId: 1 }]
          },
          meta: {
            requestId: 1,
            offset: 0
          }
        }
      ].reduce(idAttributeReducer);

      expect(idAttributeSelectors.selectPaginationOrder(state)).toEqual({
        0: 1
      });
    });

    it('selects the response result using the configured function', function() {
      const resultReducer = paginate({
        types: [LIST, LIST_SUCCESS, LIST_FAILURE],
        selectResponseResults: action => action.payload.customResultField
      });

      const resultSelectors = makeSelectors();

      let state = [
        undefined,

        {
          type: LIST,
          meta: {
            requestId: 1,
            offset: 0
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            customResultField: [{ id: 1 }]
          },
          meta: {
            requestId: 1,
            offset: 0
          }
        }
      ].reduce(resultReducer);

      expect(resultSelectors.selectPaginationOrder(state)).toEqual({ 0: 1 });
    });

    it('selects the response total using the configured function', function() {
      const totalReducer = paginate({
        types: [LIST, LIST_SUCCESS, LIST_FAILURE],
        selectResponseTotal: action => action.payload.customTotalField
      });

      const totalSelectors = makeSelectors();

      let state = [
        undefined,

        {
          type: LIST,
          meta: {
            requestId: 1
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: [],
            customTotalField: 100
          },
          meta: {
            requestId: 1
          }
        }
      ].reduce(totalReducer);

      expect(totalSelectors.selectTotalEntities(state)).toEqual(100);
    });

    it('creates a paginator for each unique key when given a keyBy string', function() {
      const keyByReducer = paginate({
        types: [LIST, LIST_SUCCESS, LIST_FAILURE],
        keyBy: 'foreignId'
      });

      let state = [
        undefined,

        {
          type: LIST,
          meta: {
            requestId: 1,
            foreignId: 'foreign-1',
            offset: 0
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: [{ id: 0, foreignId: 'foreign-1', value: 1 }],
            totalResults: 1
          },
          meta: {
            requestId: 1,
            foreignId: 'foreign-1',
            offset: 0
          }
        },

        {
          type: LIST,
          meta: {
            requestId: 2,
            foreignId: 'foreign-2',
            offset: 0
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: [
              { id: 0, foreignId: 'foreign-2', value: 2 },
              { id: 1, foreignId: 'foreign-2', value: 3 }
            ],
            totalResults: 2
          },
          meta: {
            requestId: 2,
            foreignId: 'foreign-2',
            offset: 0
          }
        }
      ].reduce(keyByReducer);

      const id1Selectors = makeSelectors('foreign-1');
      const id2Selectors = makeSelectors('foreign-2');

      expect(id1Selectors.selectPaginationOrder(state)).toEqual({ 0: 0 });
      expect(id1Selectors.selectTotalEntities(state)).toEqual(1);

      expect(id2Selectors.selectPaginationOrder(state)).toEqual({ 0: 0, 1: 1 });
      expect(id2Selectors.selectTotalEntities(state)).toEqual(2);
    });

    it('accepts a function of (state, meta) => key for keyBy', function() {
      const keyByReducer = paginate({
        types: [LIST, LIST_SUCCESS, LIST_FAILURE],
        keyBy: (state, meta) => `${meta.foreignId}:${state.filter}`
      });

      let state = [
        {
          type: LIST,
          meta: {
            requestId: 1,
            foreignId: 'foreign-1',
            offset: 0
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: [{ id: 0, foreignId: 'foreign-1', value: 1 }],
            totalResults: 1
          },
          meta: {
            requestId: 1,
            foreignId: 'foreign-1',
            offset: 0
          }
        },

        {
          type: LIST,
          meta: {
            requestId: 2,
            foreignId: 'foreign-2',
            offset: 0
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: [
              { id: 0, foreignId: 'foreign-2', value: 2 },
              { id: 1, foreignId: 'foreign-2', value: 3 }
            ],
            totalResults: 2
          },
          meta: {
            requestId: 2,
            foreignId: 'foreign-2',
            offset: 0
          }
        }
      ].reduce(keyByReducer, { filter: 'completed' });

      const id1Selectors = makeSelectors('foreign-1:completed');
      const id2Selectors = makeSelectors('foreign-2:completed');

      expect(id1Selectors.selectPaginationOrder(state)).toEqual({ 0: 0 });
      expect(id1Selectors.selectTotalEntities(state)).toEqual(1);

      expect(id2Selectors.selectPaginationOrder(state)).toEqual({ 0: 0, 1: 1 });
      expect(id2Selectors.selectTotalEntities(state)).toEqual(2);
    });
  });

  describe('pagination reducer', function() {
    it('updates the status when a call is made', function() {
      let state = testReducer(undefined, {});

      expect(testSelectors.selectFetchingStatus(state)).toEqual(
        fetchingStatus.default
      );

      state = [
        undefined,

        {
          type: LIST,
          meta: {}
        }
      ].reduce(testReducer);

      expect(testSelectors.selectFetchingStatus(state)).toEqual(
        fetchingStatus.fetching
      );
    });

    it('updates the status when a call succeeds', function() {
      const state = [
        undefined,
        {
          type: LIST,
          meta: {
            requestId: 1
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: []
          },
          meta: {
            requestId: 1
          }
        }
      ].reduce(testReducer);

      expect(testSelectors.selectFetchingStatus(state)).toEqual(
        fetchingStatus.success
      );
    });

    it('updates the status when a call fails', function() {
      const state = [
        undefined,
        {
          type: LIST,
          meta: {
            requestId: 1
          }
        },

        {
          type: LIST_FAILURE,
          payload: {
            results: []
          },
          meta: {
            requestId: 1
          }
        }
      ].reduce(testReducer);

      expect(testSelectors.selectFetchingStatus(state)).toEqual(
        fetchingStatus.failure
      );
    });

    it('ignores requests that have been superseded', function() {
      const state = [
        undefined,
        {
          type: LIST,
          meta: {
            requestId: 1
          }
        },

        {
          type: LIST,
          meta: {
            requestId: 2
          }
        },

        // ignores for both failure type...
        {
          type: LIST_FAILURE,
          payload: {
            results: []
          },
          meta: {
            requestId: 1
          }
        },

        // ...and success type
        {
          type: LIST_SUCCESS,
          payload: {
            results: []
          },
          meta: {
            requestId: 1
          }
        }
      ].reduce(testReducer);

      expect(testSelectors.selectFetchingStatus(state)).toEqual(
        fetchingStatus.fetching
      );

      const finishedState = [
        {
          type: LIST_SUCCESS,
          payload: {
            results: []
          },
          meta: {
            requestId: 2
          }
        }
      ].reduce(testReducer, state);

      expect(testSelectors.selectFetchingStatus(finishedState)).toEqual(
        fetchingStatus.success
      );
    });

    it('stores/retrieves engines at the correct paginated order', function() {
      const serverDataSet = [
        { id: 'id-0' },
        { id: 'id-1' },
        { id: 'id-2' },
        { id: 'id-3' },
        { id: 'id-4' },
        { id: 'id-5' },
        { id: 'id-6' },
        { id: 'id-7' },
        { id: 'id-8' },
        { id: 'id-9' }
      ];

      let state = [
        undefined,

        {
          type: LIST,
          meta: {
            requestId: 1,
            offset: 0,
            limit: 5
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: serverDataSet.slice(0, 5),
            totalResults: serverDataSet.length
          },
          meta: {
            requestId: 1,
            offset: 0,
            limit: 5
          }
        }
      ].reduce(testReducer);

      expect(testSelectors.selectPaginationOrder(state)).toEqual({
        0: 'id-0',
        1: 'id-1',
        2: 'id-2',
        3: 'id-3',
        4: 'id-4'
      });

      state = [
        {
          type: LIST,
          meta: {
            requestId: 2,
            offset: 5,
            limit: 5
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: serverDataSet.slice(5, 10),
            totalResults: serverDataSet.length
          },
          meta: {
            requestId: 2,
            offset: 5,
            limit: 5
          }
        }
      ].reduce(testReducer, state);

      expect(testSelectors.selectPaginationOrder(state)).toEqual({
        0: 'id-0',
        1: 'id-1',
        2: 'id-2',
        3: 'id-3',
        4: 'id-4',
        5: 'id-5',
        6: 'id-6',
        7: 'id-7',
        8: 'id-8',
        9: 'id-9'
      });
    });

    it(`clears pagination data when the server total changes (which invalidates 
    the current pagination info)`, function() {
      let serverDataSet = [
        { id: 'id-0' },
        { id: 'id-1' },
        { id: 'id-2' },
        { id: 'id-3' },
        { id: 'id-4' },
        { id: 'id-5' },
        { id: 'id-6' },
        { id: 'id-7' },
        { id: 'id-8' },
        { id: 'id-9' }
      ];

      let state = [
        undefined,

        // load pages 1,2,4
        {
          type: LIST,
          meta: {
            requestId: 1,
            offset: 0,
            limit: 2
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: serverDataSet.slice(0, 2),
            totalResults: serverDataSet.length
          },
          meta: {
            requestId: 1,
            offset: 0,
            limit: 2
          }
        },

        {
          type: LIST,
          meta: {
            requestId: 2,
            offset: 2,
            limit: 2
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: serverDataSet.slice(2, 4),
            totalResults: serverDataSet.length
          },
          meta: {
            requestId: 2,
            offset: 2,
            limit: 2
          }
        },

        {
          type: LIST,
          meta: {
            requestId: 3,
            offset: 6,
            limit: 2
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: serverDataSet.slice(6, 8),
            totalResults: serverDataSet.length
          },
          meta: {
            requestId: 3,
            offset: 6,
            limit: 2
          }
        },

        // load third page, total changes
        {
          type: LIST,
          meta: {
            requestId: 4,
            offset: 4,
            limit: 2
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: serverDataSet.slice(4, 6),
            totalResults: serverDataSet.length + 1
          },
          meta: {
            requestId: 4,
            offset: 4,
            limit: 2
          }
        }
      ].reduce(testReducer);

      // data we can't be sure about is dropped
      expect(testSelectors.selectPaginationOrder(state)).toEqual({
        4: 'id-4',
        5: 'id-5'
      });
    });

    it('properly stores/retrieves totals', function() {
      let state = [
        undefined,

        {
          type: LIST,
          meta: {
            requestId: 1
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: [],
            totalResults: 100
          },
          meta: {
            requestId: 1
          }
        }
      ].reduce(testReducer);

      expect(testSelectors.selectTotalEntities(state)).toEqual(100);
    });

    it('filters actions so the same constants can be used for multiple paginators', function() {
      const filterReducer = paginate({
        types: [LIST, LIST_SUCCESS, LIST_FAILURE],
        filter: action => action.meta.type === 'this-one'
      });

      const filterSelectors = makeSelectors();

      let state = [
        undefined,

        {
          type: LIST,
          meta: {
            requestId: 1,
            offset: 0,
            type: 'this-one'
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: [{ id: 1 }]
          },
          meta: {
            requestId: 1,
            offset: 0,
            type: 'this-one'
          }
        },

        {
          type: LIST,
          meta: {
            requestId: 2,
            offset: 0,
            type: 'not-this-one'
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            results: [{ id: 'a' }]
          },
          meta: {
            requestId: 2,
            offset: 0,
            type: 'not-this-one'
          }
        }
      ].reduce(filterReducer);

      expect(filterSelectors.selectPaginationOrder(state)).toEqual({ 0: 1 });
    });

    it('stores/retrieves indices of fetching entities', function() {
      let state = [
        undefined,

        {
          type: LIST,
          meta: {
            requestId: 1,
            offset: 0,
            limit: 2
          }
        }
      ].reduce(testReducer);

      expect(testSelectors.selectFetchingEntities(state)).toEqual([0, 1]);

      let successState = [
        {
          type: LIST_SUCCESS,
          payload: {
            error: true
          },
          meta: {
            requestId: 1,
            offset: 0,
            limit: 2
          }
        }
      ].reduce(testReducer, state);

      expect(testSelectors.selectFetchingEntities(successState)).toEqual(
        [],
        'clears after success'
      );
    });

    it('stores/retrieves indices of failed entity fetches', function() {
      let state = [
        undefined,

        {
          type: LIST,
          meta: {
            requestId: 1,
            offset: 0,
            limit: 2
          }
        },

        {
          type: LIST_FAILURE,
          payload: {
            error: true
          },
          meta: {
            requestId: 1,
            offset: 0,
            limit: 2
          }
        }
      ].reduce(testReducer);

      expect(testSelectors.selectFailedFetchingEntities(state)).toEqual([0, 1]);

      let successState = [
        {
          type: LIST,
          meta: {
            requestId: 2,
            offset: 0,
            limit: 2
          }
        },

        {
          type: LIST_SUCCESS,
          payload: {
            result: [{ id: 1 }, { id: 2 }]
          },
          meta: {
            requestId: 2,
            offset: 0,
            limit: 2
          }
        }
      ].reduce(testReducer, state);

      expect(testSelectors.selectFailedFetchingEntities(successState)).toEqual(
        [],
        'clears after success'
      );
    });

    it('handles request errors (redux api middleware behavior)', function() {
      let state = [
        undefined,

        {
          type: LIST,
          meta: {
            requestId: 1,
            offset: 0,
            limit: 2
          },
          error: true
        }
      ].reduce(testReducer);

      expect(testSelectors.selectFailedFetchingEntities(state)).toEqual([0, 1]);
    });

    it(
      'clears pagination data for the specified key when clearPagination ' +
        'is dispatched',
      function() {
        const clearReducer = paginate({
          types: [LIST, LIST_SUCCESS, LIST_FAILURE],
          key: 'clear-me'
        });

        const clearSelectors = makeSelectors('clear-me');

        let state = [
          undefined,

          {
            type: LIST,
            meta: {
              requestId: 1,
              offset: 0
            }
          },

          {
            type: LIST_SUCCESS,
            payload: {
              results: [{ id: 1 }, { id: 2 }],
              totalResults: 2
            },
            meta: {
              requestId: 1,
              offset: 0
            }
          },

          clearPagination('clear-me')
        ].reduce(clearReducer);

        expect(clearSelectors.selectPaginationOrder(state)).toEqual({});

        expect(clearSelectors.selectTotalEntities(state)).toEqual(2);
      }
    );

    it(
      'invalidates (clears) existing pagination data when an invalidateOnType ' +
        'is specified',
      function() {
        const CREATE = 'created/new/entity';

        const invalidateReducer = paginate({
          types: [LIST, LIST_SUCCESS, LIST_FAILURE],
          invalidateOnTypes: [CREATE]
        });

        const invalidateSelectors = makeSelectors();

        let state = [
          undefined,

          {
            type: LIST,
            meta: {
              requestId: 1,
              offset: 0
            }
          },

          {
            type: LIST_SUCCESS,
            payload: {
              results: [{ id: 1 }, { id: 2 }],
              totalResults: 2
            },
            meta: {
              requestId: 1,
              offset: 0
            }
          },

          {
            type: CREATE,
            payload: {}
          }
        ].reduce(invalidateReducer);

        expect(invalidateSelectors.selectPaginationOrder(state)).toEqual({});

        expect(invalidateSelectors.selectTotalEntities(state)).toEqual(2);
      }
    );
  });
});
