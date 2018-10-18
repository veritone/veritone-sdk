export function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}

export function reduceReducers(...reducers) {
  return (state, action) => {
    let isInitial = !state;
    return reducers.reduce(
      (newState, reducer) => {
        if (isInitial) {
          return { ...newState, ...reducer(undefined, action) };
        } else {
          return reducer(newState, action);
        }
      },
      { ...state }
    );
  };
}
