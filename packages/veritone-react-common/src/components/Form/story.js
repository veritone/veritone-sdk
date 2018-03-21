import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Form from 'components/Form';


var formName = 'Test Form';
var fields = {
  name: 'Name',
  lastName: 'Last Name',
  username: 'Username',
  password: 'Password',
  time: 'Time',
  schemas: {
    twitterschema1: {
      value: 'Twitter Schema 1',
      
    },
    twitterschema2: {
      value: 'Twitter Schema 2'
    }
  }
};

var defaultValues = {
  name: 'John',
  lastName: 'Doe',
  schemas: 'twitterschema1'
};

var fieldTypes = {
  name: 'text',
  lastName: 'text',
  username: 'text',
  password: 'password',
  time: 'time',
  schemas: ['select', 'static']
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
      defaultValues={defaultValues} 
      fieldTypes={fieldTypes} 
      submitName={submitName} 
      submitCallback={submitCallback} 
    />
  ))