import { createSelector } from 'reselect';
import { formBuilderSelector } from '../selector';
import { namespace } from './';

export const local = createSelector(
  formBuilderSelector,
  formBuilder => formBuilder[namespace]
)

export const formsSelector = createSelector(
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
      .map(id => wipForm[id]),
    templates: forms.allIds
      .filter(id => forms.byId[id].isTemplate)
      .map(id => wipForm[id])
  })
)

export const makeFormSelectorById = (formId) => createSelector(
  local,
  (
    {
      wipForm,
    }
  ) => wipForm[formId]
)
