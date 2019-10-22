import { combineReducers } from 'redux';

import { formReducer, namespace as formNamespace } from './forms';
import { formLocationsReducer, namespace as formLocationNamespace } from './formLocations';
import { formListReducer, namespace as formListNamespace } from './formList';

export const namespace = 'formBuilder';

export const formBuilderReducer = combineReducers({
  [formNamespace]: formReducer,
  [formLocationNamespace]: formLocationsReducer,
  [formListNamespace]: formListReducer
});

export { formLocationsSelector } from './formLocations/selector';
export { requestFormLocations } from './formLocations';

export { formsSelector, makeFormSelectorById } from './forms/selector';
export {
  requestForm,
  requestCreateForm,
  requestUpdateForm,
  requestDeleteForm,
  newForm,
  updateForm,
} from './forms';

export {
  changePage,
  changeRowsPerPage,
  formListSelector
} from './formList';
