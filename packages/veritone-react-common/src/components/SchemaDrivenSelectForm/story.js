import React from 'react';
import { storiesOf } from '@storybook/react';
import DynamicSelect from './';


const sourceTypes = {
  data: {
    records: [
      {
        name: "Audio",
        id: "audio1",
        sourceSchema: {
          definition: {
            properties: {
              url: {
                type: 'string',
              },
              username: {
                type: 'string',
                title: 'User Name'
              },
              password: {
                type: 'string'
              }
            },
            required: [
              'url', 'username', 'password'
            ]
          },
        }
      },
      {
        name: "Audio2",
        id: "audio_2",
        sourceSchema: {
          definition: {
            properties: {
              url: {
                type: 'string',
              },
              username: {
                type: 'string',
                title: 'User Name 2'
              },
              password: {
                type: 'string'
              },
              days: {
                type: 'number'
              }
            },
            required: [
              'url', 'days'
            ]
          }
        }
      }
    ]
  }
};

function formCallback(formResult) {
  console.log(formResult);
  
};

let helperText = 'NOTE: Source types available are dynamic based on your ingestion adapter';
let selectLabel = 'Select a Source Type';

let initialValues = {
  url: 'twitter.com',
  username: 'trump',
  password: 'password',
};

// test passing in an object with fields that are in error state
let errorFields = {
  url: true,
  username: false,
  password: true
};

storiesOf('SchemaDrivenSelectForm', module)
  .add('Base', () => (
    <DynamicSelect
      sourceTypes={sourceTypes.data.records}
      currentSource={0}
      fieldValues={initialValues}
      onInputChange={formCallback}
      helperText={helperText}
      selectLabel={selectLabel} 
    />
  ))
  .add('Error Field', () => (
    <DynamicSelect
      sourceTypes={sourceTypes.data.records}
      fieldValues={{username:'trump'}}
      errorFields={errorFields}
      onInputChange={formCallback}
      helperText={helperText}
      selectLabel={selectLabel}
    />
  ))