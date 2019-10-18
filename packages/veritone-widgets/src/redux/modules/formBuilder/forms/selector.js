import { createSelector } from 'reselect';
import { formBuilderSelector } from '../selector';
import { namespace } from './';

export const local = createSelector(
  formBuilderSelector,
  formBuilder => formBuilder[namespace]
)

export const formSelector = createSelector(
  local,
  (
    {
      forms,
      wipForm,
      ...remainState
    }
  ) => ({
    ...remainState,
    forms: forms.allIds
      .filter(id => !forms.byId[id].isTemplate)
      .map(id => wipForm[id] || forms.byId[id]),
    templates: forms.allIds
      .filter(id => forms.byId[id].isTemplate)
      .map(id => wipForm[id] || forms.byId[id])
  })
)

export const makeFormSelectorById = (formId) => createSelector(
  local,
  (
    {
      forms,
      wipForm,
    }
  ) => wipForm[formId] || forms.byId[formId]
)
