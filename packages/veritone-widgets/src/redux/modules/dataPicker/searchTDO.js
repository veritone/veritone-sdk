// import {
//   call,
//   put,
//   select
// } from 'redux-saga/effects';
// import { modules, helpers } from 'veritone-redux-common';
// import { get } from 'lodash';
// import {
//   DEFAULT_PAGE_SIZE,
//   TDO_FRAGMENTS
// } from './helper';
// import {
//   SET_SEARCH_VALUE,
//   FETCH_PAGE,
//   ERRORED_PAGE,
//   getItemByTypeAndId
// } from './';

// const { fetchGraphQLApi } = helpers;
// const {
//   user: userModule
// } = modules;

export const template = {
  type: 'search',
  selectType: 'tdo',
  // pagination: fetchSearchPage,
  // watchers: [watchOnSearch]
};

// function* fetchSearchPage(currentNode, id) {
//   console.log(currentNode, id);
// }

// function* watchOnSearch() {
//   yield takeEvery(SET_SEARCH_VALUE, function* (action) {
//     const { id } = action.meta;
//     // const searchValue = action.payload;
    
//     yield put({
//       type: FETCH_PAGE,
//       meta: { id }
//     });
//   });
// }
