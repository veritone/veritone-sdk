import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import DynamicSelect from './';


var sourceTypes = {
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
            }
          }
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
            }
          }
        }
      }
    ]
  }
};

function formCallback(formResult) {
  console.log(formResult);
};

var helperText = 'NOTE: Source types available are dynamic based on your ingestion adapter';
var selectLabel = 'Select a Source Type*';

storiesOf('SchemaDrivenSelectForm', module)
  .add('Base', () => (
    <DynamicSelect sourceTypes={sourceTypes.data.records} formCallback={formCallback} helperText={helperText} selectLabel={selectLabel} />
  ))