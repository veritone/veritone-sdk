import { createSelector } from 'reselect';
import { helpers } from 'veritone-redux-common';
import { formBuilderSelector } from './selector';

const { createReducer } = helpers;

export const namespace = 'formList';

export const CHANGE_PAGE = 'form builder / change page';
export const CHANGE_ROWSPERPAGE = 'form builder / change rows per page';

export const changePage = (page) => ({
  type: CHANGE_PAGE,
  payload: {
    page
  }
})

export const changeRowsPerPage = (rowsPerPage) => ({
  type: CHANGE_ROWSPERPAGE,
  payload: {
    rowsPerPage
  }
})

export const formListReducer = createReducer(
  {
    page: 0,
    rowsPerPage: 10
  },
  {
    [CHANGE_PAGE]: (state, { payload }) => ({
      ...state,
      page: payload.page
    }),
    [CHANGE_ROWSPERPAGE]: (state, { payload }) => ({
      ...state,
      rowsPerPage: payload.rowsPerPage
    })
  }
)

export const formListSelector = createSelector(
  formBuilderSelector,
  formBuilder => formBuilder[namespace]
);
