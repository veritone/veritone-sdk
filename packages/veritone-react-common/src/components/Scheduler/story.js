import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'react-redux';
import { reducer as formReducer, reduxForm, Field } from 'redux-form';
import { combineReducers, createStore } from 'redux';

import Scheduler from './';

const store = createStore(
  combineReducers({
    form: formReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const StoryForm = reduxForm({
  form: 'story',
  initialValues: {}
})(({ handleSubmit, children, submitting, pristine }) => (
  <form onSubmit={handleSubmit}>
    {children}
    <br />
    <button type="submit" disabled={pristine || submitting}>
      Submit
    </button>
  </form>
));

/* eslint-disable react/jsx-no-bind */

storiesOf('Scheduler', module).add('Empty Scheduler', () => (
  <Provider store={store}>
    <Scheduler />
  </Provider>
));
