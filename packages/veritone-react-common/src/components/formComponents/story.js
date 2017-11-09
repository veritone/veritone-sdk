import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer, reduxForm, Field } from 'redux-form';
import { storiesOf } from '@storybook/react';
import { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormHelperText, FormControl } from 'material-ui/Form';
import Visibility from 'material-ui-icons/Visibility';
import IconButton from 'material-ui/IconButton';

import TextField from './TextField';
import Input from './Input';

const store = createStore(
  combineReducers({
    form: formReducer
  })
);

const StoryForm = reduxForm({
  form: 'story'
})(({ handleSubmit, children, submitting, pristine }) => (
  <form onSubmit={handleSubmit}>
    {children}
    <br />
    <button type="submit" disabled={pristine || submitting}>
      Submit
    </button>
  </form>
));

storiesOf('Form Components', module).add('TextField', () => (
  <Provider store={store}>
    <StoryForm onSubmit={values => alert(JSON.stringify(values))}>
      <p>
        <Field
          name="text-field"
          label="Plain TextField"
          placeholder="add your text here"
          component={TextField}
        />
        <FormHelperText>{"here's some help text"}</FormHelperText>
      </p>

      <FormControl>
        <InputLabel htmlFor="adorned-input">
          Adorned TextField
        </InputLabel>
        <Field
          component={Input}
          name="input-adorned"
          id="adorned-input"
          placeholder="add your text here"
          endAdornment={
            <InputAdornment position="end">
              <IconButton>
                <Visibility/>
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText>{"Adorned input"}</FormHelperText>
      </FormControl>

      <p>
        <Field
          error
          name="text-field-error"
          label="Error state"
          component={TextField}
        />
        <FormHelperText error>error: value must be different</FormHelperText>
      </p>

      <p>
        <Field
          disabled
          name="text-field-disabled"
          label="disabled state"
          component={TextField}
        />
        <FormHelperText disabled>this field is disabled</FormHelperText>
      </p>
    </StoryForm>
  </Provider>
));
