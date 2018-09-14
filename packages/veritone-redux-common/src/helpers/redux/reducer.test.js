import { reduceReducers, createReducer } from './';

describe('reduceReducers', function() {
  it('runs reducers in series and merges their responses', function() {
    const reducer = reduceReducers(
      createReducer(
        { r1Result: null },
        {
          action1(state, action) {
            return {
              r1Result: action.payload + 10
            };
          }
        }
      ),
      createReducer(
        { r2Result: null },
        {
          action1(state, action) {
            return {
              r2Result: action.payload * 10
            };
          }
        }
      )
    );

    const state = [
      undefined,
      {
        type: 'action1',
        payload: 5
      }
    ].reduce(reducer);

    expect(state).toEqual({
      r1Result: 15,
      r2Result: 50
    });
  });

  it('handles defaultState from all reducers', function() {
    const reducer = reduceReducers(
      createReducer(
        { r1Result: 5 },
        {
          action1(state, action) {
            return {
              r1Result: state.r1Result + action.payload
            };
          }
        }
      ),
      createReducer(
        { r2Result: 10 },
        {
          action1(state, action) {
            return {
              r2Result: state.r2Result + action.payload
            };
          }
        }
      )
    );

    const state = [
      undefined,
      {
        type: 'action1',
        payload: 5
      }
    ].reduce(reducer);

    expect(state).toEqual({
      r1Result: 10,
      r2Result: 15
    });
  });
});
