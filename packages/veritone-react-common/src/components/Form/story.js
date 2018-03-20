import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Form from 'components/Form';


var formName = 'Test Form';
var fields = {
  name: 'Name',
  lastName: 'Last Name',
  username: 'Username',
  password: 'Password'
};

var values = {
  name: 'John',
  lastName: 'Doe'
};

var fieldTypes = {
  name: 'text',
  lastName: 'text',
  username: 'text',
  password: 'password'
};

var submitName = 'Save';
var submitCallback = function save(callbackState) {
  console.log(callbackState);
};


storiesOf('Form', module)
  .add('Base', () => (
    <Form 
      formName={formName} 
      fields={fields} 
      values={values} 
      fieldTypes={fieldTypes} 
      submitName={submitName} 
      submitCallback={submitCallback} 
    />
  ))