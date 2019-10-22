import { helpers } from 'veritone-redux-common';

const { createReducer } = helpers;

export const namespace = 'forms';

export const REQUEST_FORM = 'form builder/request form';
export const REQUEST_FORM_START = 'form builder/request form start';
export const REQUEST_FORM_SUCCESS = 'form builder/request form success';
export const REQUEST_FORM_ERROR = 'form builder/request form error';
export const REQUEST_FORMS = 'form builder/request forms';
export const REQUEST_FORMS_START = 'form builder/request forms start';
export const REQUEST_FORMS_SUCCESS = 'form builder/request forms success';
export const REQUEST_FORMS_ERROR = 'form builder/request forms error';
export const UPDATE_FORM = 'form builder/update form';
export const REQUEST_UPDATE_FORM = 'form builder/request update form';
export const REQUEST_UPDATE_FORM_START = 'form builder/request update form start';
export const REQUEST_UPDATE_FORM_SUCCESS = 'form builder/request update form success';
export const REQUEST_UPDATE_FORM_ERROR = 'form builder/request update form error';
export const REQUEST_DELETE_FORM = 'form builder/request delete form';
export const REQUEST_DELETE_FORM_START = 'form builder/request delete form start';
export const REQUEST_DELETE_FORM_SUCCESS = 'form builder/request delete form success';
export const REQUEST_DELETE_FORM_ERROR = 'form builder/request delete form error';
export const REQUEST_CREATE_FORM = 'form builder/request create form';
export const REQUEST_CREATE_FORM_START = 'form builder/request create form start';
export const REQUEST_CREATE_FORM_SUCCESS = 'form builder/request create form success';
export const REQUEST_CREATE_FORM_ERROR = 'form builder/request create form error';
export const NEW_FORM = 'form builder/new form';
export const RESET_FORM = 'form builder/reset form';

export const requestForm = (id) => ({
  type: REQUEST_FORM,
  payload: {
    id
  }
})

export const requestFormStart = (id) => ({
  type: REQUEST_FORM_START,
  payload: {
    id
  }
})

export const requestFormSuccess = (form) => ({
  type: REQUEST_FORM_SUCCESS,
  payload: {
    form
  }
})

export const requestFormError = (id, error) => ({
  type: REQUEST_FORM_ERROR,
  payload: {
    id,
    error
  }
})

export const requestForms = () => ({
  type: REQUEST_FORMS
})

export const requestFormsStart = () => ({
  type: REQUEST_FORMS_START,
})

export const requestFormsSuccess = (forms, hasMore) => ({
  type: REQUEST_FORMS_SUCCESS,
  payload: {
    forms,
    hasMore
  }
})

export const requestFormsError = (error) => ({
  type: REQUEST_FORMS_ERROR,
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

export const requestCreateForm = (form) => ({
  type: REQUEST_CREATE_FORM,
  payload: {
    form
  }
})

export const requestCreateFormStart = (form) => ({
  type: REQUEST_CREATE_FORM_START,
  payload: {
    form
  }
})

export const requestCreateFormSuccess = (form) => ({
  type: REQUEST_CREATE_FORM_SUCCESS,
  payload: {
    form
  }
})

export const requestCreateFormError = (form, error) => ({
  type: REQUEST_CREATE_FORM_ERROR,
  payload: {
    form,
    error
  }
})

export const requestDeleteForm = (form) => ({
  type: REQUEST_DELETE_FORM,
  payload: {
    form
  }
})

export const requestDeleteFormStart = (form) => ({
  type: REQUEST_DELETE_FORM_START,
  payload: {
    form
  }
})

export const requestDeleteFormSuccess = (form) => ({
  type: REQUEST_DELETE_FORM_SUCCESS,
  payload: {
    form
  }
})

export const requestDeleteFormError = (form, error) => ({
  type: REQUEST_DELETE_FORM_ERROR,
  payload: {
    form,
    error
  }
})

export const resetForm = (formId) => ({
  type: RESET_FORM,
  payload: {
    formId
  }
})

export const newForm = (formId, formName) => ({
  type: NEW_FORM,
  payload: {
    form: {
      name: formName || 'New form',
      id: formId,
      definition: [],
      isPublished: false,
      isTemplate: false,
      locations: [],
      isNew: true
    }
  }
})


function makeFormMap(forms) {
  return forms.reduce((formMap, form) => ({
    ...formMap,
    [form.id]: form
  }), {})
}

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
    [REQUEST_FORMS_START]: (state) => ({
      ...state,
      loading: true
    }),
    [REQUEST_FORMS_SUCCESS]: (state, action) => ({
      ...state,
      loading: false,
      loaded: true,
      hasMore: action.payload.hasMore,
      forms: {
        allIds: [
          ...state.forms.allIds,
          ...action.payload.forms.map(({ id }) => id)
        ],
        byId: {
          ...state.forms.byId,
          ...makeFormMap(action.payload.forms)
        }
      },
      wipForm: {
        ...state.wipForm,
        ...makeFormMap(action.payload.forms)
      }
    }),
    [REQUEST_FORMS_ERROR]: (state, action) => ({
      ...state,
      loading: false,
      loaded: true,
      ...action.paylod
    }),
    [UPDATE_FORM]: (state, { payload: { form } }) => ({
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
        ...state.forms,
        byId: {
          ...state.forms.byId,
          [form.id]: form
        },
      },
      wipForm: {
        ...state.wipForm,
        [form.id]: form
      }
    }),
    [REQUEST_UPDATE_FORM_ERROR]: (state, { payload: { form, error } }) => ({
      ...state,
      wipForm: {
        ...state.wipForm,
        [form.id]: {
          ...form,
          error
        }
      }
    }),
    [NEW_FORM]: (state, { payload: { form } }) => ({
      ...state,
      forms: {
        byId: {
          ...state.forms.byId,
          [form.id]: form
        },
        allIds: [...state.forms.allIds, form.id]
      },
      wipForm: {
        ...state.wipForm,
        [form.id]: form
      }
    }),
    [REQUEST_CREATE_FORM]: (state, { payload: { form } }) => ({
      ...state,
      wipForm: {
        ...state.wipForm,
        [form.id]: {
          ...form,
          loading: true
        }
      }
    }),
    [REQUEST_CREATE_FORM_SUCCESS]: (state, { payload: { form, tempFormId } }) => ({
      ...state,
      forms: {
        byId: {
          ...state.form.allIds
            .filter(formId => formId !== tempFormId)
            .reduce((formMap, formId) => ({
              ...formMap,
              [formId]: state.form.byId[formId]
            }), {}),
          [form.id]: form
        },
        allIds: state.form.allIds.filter(id => id !== tempFormId)
      },
      wipForm: {
        ...state.form.allIds
          .filter(formId => formId !== tempFormId)
          .reduce((formMap, formId) => ({
            ...formMap,
            [formId]: state.wipForm[formId]
          }), {}),
        [form.id]: form
      }
    }),
    [REQUEST_CREATE_FORM_ERROR]: (state, { payload: { form, error } }) => ({
      ...state,
      wipForm: {
        ...state.wipForm,
        [form.id]: {
          ...form,
          error
        }
      }
    }),
    [RESET_FORM]: (state, { payload: { formId } }) => ({
      ...state,
      wipForm: {
        ...state.wipForm,
        [formId]: state.forms.byId[formId]
      }
    }),
    [REQUEST_DELETE_FORM_START]: (state, { payload: { form } }) => ({
      ...state,
      wipForm: {
        ...state.wipForm,
        [form.id]: {
          ...form,
          loading: true
        }
      }
    }),
    [REQUEST_DELETE_FORM_SUCCESS]: (state, { payload: { form } }) => ({
      ...state,
      forms: {
        allIds: state.forms.allIds.filter(formId => formId !== form.id),
        byId: state.forms.allIds
          .filter(formId => formId !== form.id)
          .reduce((formMap, formId) => ({
            ...formMap,
            [formId]: state.forms.byId[formId]
          }), {})
      },
      wipForm: {
        ...state.forms.allIds
          .filter(formId => formId !== form.id)
          .reduce((formMap, formId) => ({
            ...formMap,
            [formId]: state.wipForm[formId]
          }), {})
      }
    })
  }
)
