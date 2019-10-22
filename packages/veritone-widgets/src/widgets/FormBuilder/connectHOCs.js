import { connect } from 'react-redux';

import * as formBuilderModules from '../../redux/modules/formBuilder';

const tablePagination = {
  onChangePage: formBuilderModules.changePage,
  onChangeRowsPerPage: formBuilderModules.changeRowsPerPage
}

export const connectFormTable = connect(
  (state) => ({
    forms: formBuilderModules.formsSelector(state).forms,
    ...formBuilderModules.formListSelector(state)
  }),
  tablePagination
)

export const connectTemplateTable = connect(
  (state) => ({
    forms: formBuilderModules.formsSelector(state).templates,
    isTemplate: true,
    ...formBuilderModules.formListSelector(state)
  }),
  tablePagination
)

export const connectFormListPage = connect(
  (state) => formBuilderModules.formsSelector(state),
  {
    fetchForm: formBuilderModules.requestForms,
    newForm: formBuilderModules.newForm,
  }
)

export const connectFormBuilder = connect(
  (state, { id }) => ({
    form: formBuilderModules.makeFormSelectorById(id)(state),
    formLocations: formBuilderModules.formLocationsSelector(state)
  }),
  {
    onChange: formBuilderModules.updateForm,
    fetchLocations: formBuilderModules.requestFormLocations
  }
)
