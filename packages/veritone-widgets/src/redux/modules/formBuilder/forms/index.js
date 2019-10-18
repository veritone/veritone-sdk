import { helpers } from 'veritone-redux-common';

const { createReducer } = helpers;

export const namespace = 'forms';
export const REQUEST_FORM = 'form builder/request form';
export const REQUEST_FORM_START = 'form builder/equest form start';
export const REQUEST_FORM_SUCCESS = 'form builder/request form success';
export const REQUEST_FORM_ERROR = 'form builder/request form error';
export const UPDATE_FORM = 'form builder/update form';
export const REQUEST_UPDATE_FORM = 'form builder/request update form';
export const REQUEST_UPDATE_FORM_START = 'form builder/request update form start';
export const REQUEST_UPDATE_FORM_SUCCESS = 'form builder/request update form success';
export const REQUEST_UPDATE_FORM_ERROR = 'form builder/request update form error';
export const REQEUST_DELETE_FORM = 'form builder/request delete form';
export const REQUEST_DELETE_FORM_START = 'form builder/request delete form start';
export const REQUEST_DELETE_FORM_SUCCESS = 'form builder/request delete form success';
export const REQUEST_DELETE_FORM_ERROR = 'form builder/request delete form error';


export const requestForm = () => ({
  type: REQUEST_FORM
})

export const requestFormSuccess = (forms, hasMore) => ({
  type: REQUEST_FORM_SUCCESS,
  payload: {
    forms,
    hasMore
  }
})

export const requestFormError = (error) => ({
  type: REQUEST_FORM_ERROR,
  payload: {
    error
  }
})

export const updateForm = (form) => ({
  type: UPDATE_FORM,
  payload: {
    form
  }
})

export const requestUpdateForm = (form) => ({
  type: REQUEST_UPDATE_FORM,
  payload: {
    form
  }
})

export const requestUpdateFormStart = (form) => ({
  type: REQUEST_UPDATE_FORM_START,
  payload: {
    form
  }
})

export const requestUpdateFormSuccess = (form) => ({
  type: REQUEST_UPDATE_FORM_SUCCESS,
  payload: {
    form
  }
})

export const requestUpdateFormError = (form, error) => ({
  type: REQUEST_UPDATE_FORM_ERROR,
  payload: {
    form,
    error
  }
})

export const formReducer = createReducer(
  {
    forms: {
      allIds: [],
      byId: {}
    },
    wipForm: {},
    loading: false,
    loaded: false,
    hasMore: true,
  },
  {
    [REQUEST_FORM]: (state) => ({
      ...state,
      loading: true
    }),
    [REQUEST_FORM_SUCCESS]: (state, action) => ({
      ...state,
      loading: false,
      loaded: true,
      forms: {
        allIds: [
          ...state.forms.allIds,
          ...action.payload.forms.map(({ id }) => id)
        ],
        byId: {
          ...state.forms.byId,
          ...action.payload.forms.reduce((form) => ({
            [form.id]: form
          }))
        }
      }
    }),
    [REQUEST_FORM_ERROR]: (state, action) => ({
      ...state,
      loading: false,
      loaded: true,
      ...action.paylod
    }),
    [UPDATE_FORM]: (state, { payload: form }) => ({
      ...state,
      wipForm: {
        ...state.wipForm,
        [form.id]: form
      }
    }),
    [REQUEST_UPDATE_FORM_START]: (state, { payload: { form } }) => ({
      ...state,
      wipForm: {
        ...state.wipForm,
        [form.id]: {
          ...state.wipForm[form.id],
          loading: true
        }
      }
    }),
    [REQUEST_UPDATE_FORM_SUCCESS]: (state, { payload: { form } }) => ({
      ...state,
      forms: {
        byId: {
          ...state.forms.byId,
          [form.id]: form
        },
        allIds: state.forms.allIds.includes(form.id) ? [
          ...state.forms.allIds,
          form.id
        ] : state.forms.allIds
      }
    })
  }
)
