import { makeMockStore } from 'helpers/test/redux';
import { omit } from 'lodash';
import nock from 'nock';
import * as engineResultsModule from './';

const mockStore = makeMockStore();

describe('engineResults module reducer', () => {
  describe('fetchEngineResults', () => {
    const mockFetchEngineResultsVars = {
      tdoId: '123',
      engineIds: ['myengine1'],
      ignoreUserEdited: false,
      stopOffsetMs: 5000
    };

    const mockEngineResultsResponse = {
      data: {
        engineResults: {
          records: [
            {
              assetId: 'test-asset-123',
              engineId: 'myengine1',
              jsondata: {
                series: [
                  {
                    startTimeMs: 0,
                    stopTimeMs: 2500,
                    words: [{ word: 'hello', confidence: 1 }]
                  },
                  {
                    startTimeMs: 2501,
                    stopTimeMs: 5000,
                    words: [{ word: 'world', confidence: 1 }]
                  }
                ]
              },
              startOffsetMs: 0,
              stopOffsetMs: 5000,
              tdoId: '123',
              userEdited: true
            }
          ]
        }
      }
    };

    const mockEngineResultsErrorResponse = {
      data: {},
      errors: [{ message: 'An error message' }]
    };

    it('should dispatch FETCH_ENGINE_RESULTS and FETCH_ENGINE_RESULTS_SUCCESS on successful response', () => {
      const store = mockStore({
        config: {
          apiRoot: 'http://www.test.com:80',
          graphQLEndpoint: 'graphql'
        },
        auth: {
          sessionToken: '123'
        },
        engineResults: engineResultsModule.defaultState
      });

      const api = nock('http://www.test.com')
        .post('/graphql')
        .reply(200, mockEngineResultsResponse);

      const expectedActions = [
        {
          type: engineResultsModule.FETCH_ENGINE_RESULTS,
          meta: {
            operationName: undefined,
            query: engineResultsModule.getEngineResultsQuery,
            variables: mockFetchEngineResultsVars
          }
        },
        {
          type: engineResultsModule.FETCH_ENGINE_RESULTS_SUCCESS,
          meta: {
            operationName: undefined,
            query: engineResultsModule.getEngineResultsQuery,
            variables: mockFetchEngineResultsVars
          },
          payload: mockEngineResultsResponse.data
        }
      ];

      const engineResults = engineResultsModule.fetchEngineResults({
        tdo: {
          id: '123'
        },
        engineId: 'myengine1',
        startOffsetMs: 0,
        stopOffsetMs: 5000,
        ignoreUserEdited: false
      });

      engineResults(store.dispatch, store.getState).then(() => {
        expect(store.getActions().map(action => {
          return {
            ...action,
            meta: omit(action.meta, ['_internalRequestId', '_shouldTrackRequestsIndividually'])
          }
        })).toEqual(expectedActions);
        api.done();
        return;
      });
    });

    it('should dispatch FETCH_ENGINE_RESULTS and FETCH_ENGINE_RESULTS_FAILURE on successful response', () => {
      const store = mockStore({
        config: {
          apiRoot: 'http://www.test.com',
          graphQLEndpoint: 'graphql'
        },
        auth: {
          sessionToken: '123'
        },
        engineResults: engineResultsModule.defaultState
      });

      const api = nock('http://www.test.com')
        .post('/graphql')
        .reply(400, mockEngineResultsErrorResponse);

      const engineResults = engineResultsModule.fetchEngineResults({
        tdo: {
          id: '123'
        },
        engineId: 'myengine1',
        startOffsetMs: 0,
        stopOffsetMs: 5000,
        ignoreUserEdited: false
      });

      const expectedActions = [
        {
          type: engineResultsModule.FETCH_ENGINE_RESULTS,
          meta: {
            operationName: undefined,
            query: engineResultsModule.getEngineResultsQuery,
            variables: mockFetchEngineResultsVars
          }
        },
        {
          error: true,
          type: engineResultsModule.FETCH_ENGINE_RESULTS_FAILURE,
          meta: {
            operationName: undefined,
            query: engineResultsModule.getEngineResultsQuery,
            variables: mockFetchEngineResultsVars
          },
          payload: mockEngineResultsErrorResponse.errors
        }
      ];

      engineResults(store.dispatch, store.getState).then(() => {
        expect(store.getActions().map(action => {
          return {
            ...action,
            meta: omit(action.meta, ['_internalRequestId', '_shouldTrackRequestsIndividually'])
          }
        })).toEqual(expectedActions);
        api.done();
        return;
      });
    });
  });
});
