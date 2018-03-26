import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import FormCard from './FormCard';
import TemplateForms from './TemplateForms';

import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import InputLabel from 'material-ui/Input/InputLabel';


var value = 1;
var selectObj = {
  1: 'Lorem ipsum',
  2: 'other'
};
function handleSelect(event) {
  value = event.target.value;
};

var fields = [
  <TextField
    type={'text'}
    fullWidth
    margin='dense'
    label={'Twitter Name'}
  />,
  <div>
    <InputLabel style={{ fontSize: '12px', lineHeight: '14px'}}>Bio</InputLabel>
    <Select
      fullWidth
      name={selectObj[value]}
      onChange={handleSelect}
      value={value}
    >
      <MenuItem value={1}>Lorem ipsum</MenuItem>
      <MenuItem value={2}>Other</MenuItem>
    </Select>
  </div>
];
var formName = 'Twitter Account';


//// FORM CARDS LIST SETUP
var result = {
  data: {
    dataRegistries: {
      records: [
        {
          schemas: {
            records: [
              {
                id: "",
                dataRegistry: {
                  name: 'Twitter Schema'
                },
                definition: {
                  properties: {
                    url: {
                      type: 'string'
                    },
                    username: {
                      type: 'string'
                    }
                  }
                }
              }
            ]
          }
        }
      ]
    }
  }
}


storiesOf('ContentTemplates', module)
  .add('Form Card', () => (
    <FormCard fields={fields} name={formName} />
  ))
  .add('Form Cards List', () => (
    <TemplateForms />
  ))