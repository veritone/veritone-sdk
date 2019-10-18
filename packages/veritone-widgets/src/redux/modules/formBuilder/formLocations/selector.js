import { createSelector } from 'reselect';
import { formBuilderSelector } from '../selector';
import { namespace } from './';

export const formLocationsSelector = createSelector(
  formBuilderSelector,
  formBuilder => formBuilder[namespace]
);
