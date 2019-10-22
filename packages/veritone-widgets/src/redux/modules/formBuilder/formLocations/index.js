import { helpers } from 'veritone-redux-common';

const { createReducer } = helpers;

export const namespace = 'formLocations';

export const REQUEST_FORM_LOCATIONS = 'form builder/request form locations';
export const REQUEST_FROM_LOCATIONS_START = 'form builder/request form locations start';
export const REQUEST_FORM_LOCATIONS_SUCCESS = 'form builder/request form locations success';
export const REQUEST_FORM_LOCATIONS_ERROR = 'form/builder/request form locations error';

export const requestFormLocations = () => ({
  type: REQUEST_FORM_LOCATIONS
})

export const requestFormLocationsStart = () => ({
  type: REQUEST_FROM_LOCATIONS_START
})

export const requestFormLocationsSuccess = (formLocations) => ({
  type: REQUEST_FORM_LOCATIONS_SUCCESS,
  payload: {
    locations: formLocations
  }
})

export const requestFormLocationsError = (error) => ({
  type: REQUEST_FORM_LOCATIONS_ERROR,
  payload: {
    error
  }
})

export const formLocationsReducer = createReducer(
  {
    locations: [],
    locationLoading: false,
    locationLoaded: false
  },
  {
    [REQUEST_FROM_LOCATIONS_START]: (state) => ({
      ...state,
      locationLoading: true
    }),
    [REQUEST_FORM_LOCATIONS_SUCCESS]: (state, action) => ({
      ...state,
      locationLoading: false,
      locationLoaded: true,
      ...action.payload
    }),
    [REQUEST_FORM_LOCATIONS_ERROR]: (state, action) => ({
      ...state,
      locationLoading: false,
      loactionLoaded: true,
      ...action.payload
    })
  }
);
