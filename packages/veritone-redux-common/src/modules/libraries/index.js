import { createReducer } from 'helpers/redux';
import { CALL_API } from 'redux-api-middleware-fixed';
import { getConfig } from 'modules/config';
import { commonHeaders } from 'helpers/api';
import * as constants from './constants';

export const namespace = 'libraries';

const defaultState = {
  libraries: [],
  isFetching: false,
  fetchingFailed: null
};

const reducer = createReducer(defaultState, {
  [constants.FETCH_LIBRARIES](state, action) {
    return {
      ...state,
      isFetching: true
    };
  },
  [constants.FETCH_LIBRARIES_SUCCESS](state, action) {
    let { payload } = action;
    return {
      ...state,
      isFetching: false,
      fetchingFailed: false,
      libraries: payload.data.libraries.records.map(library => {
        return {
          ...library,
          entities: library.entities.records.map(entity => {
            return {
              ...entity
            };
          })
        };
      })
    };
  },
  [constants.FETCH_LIBRARIES_FAILURE](state, action) {
    return {
      ...state,
      isFetching: false,
      fetchingFailed: true,
      libraries: []
    };
  }
});

export default reducer;

function local(state) {
  return state[namespace];
}

export function fetchLibraries() {
  let query = `query{
    libraries(limit:200) {
      records {
        id
        name
        entities(limit: 9999) {
          records {
            id
            name
            profileImageUrl
            libraryId
            jsondata
          }
        }
      }
    }
  }`;
  return {
    [CALL_API]: {
      types: [
        constants.FETCH_LIBRARIES,
        constants.FETCH_LIBRARIES_SUCCESS,
        constants.FETCH_LIBRARIES_FAILURE
      ],
      endpoint: state => `${getConfig(state).apiRoot}/v3/graphql`,
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({
        query
      })
    }
  };
}

export function getLibraries(state) {
  return local(state).libraries;
}
