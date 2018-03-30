import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import FormCard from './FormCard';
import TemplateForms from './TemplateForms';
import TemplateList from './TemplateList';
import ContentTemplates from './';

import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import InputLabel from 'material-ui/Input/InputLabel';

// CONTENT TEMPLATES SETUP
let source = {
  data: {
    source: {
      id: '666',
      name: 'KWOL--FM',
      contentTemplates: [
        {
          schemaId: 'schemaGuid1',
          data: {
            url: 'twitter.com',
            username: 'THEREALTRUMP'
          }
        }
      ]
    }
  }
};

// FORM CARD SETUP
let value = 1;
let selectObj = {
  1: 'Lorem ipsum',
  2: 'other'
};
function handleSelect(event) {
  value = event.target.value;
};

let fields = [
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
let formName = 'Twitter Account';

function removeForm(schemaId) {
  console.log('remove this form');
};

//// FORM CARDS LIST SETUP
let result = {
  data: {
    dataRegistries: {
      records: [
        {
          name: 'Twitter Schema',
          schemas: {
            records: [
              {
                id: "schemaGuid1",
                status: "published",
                definition: {
                  properties: {
                    url: {
                      type: 'string',
                      title: 'URL'
                    },
                    username: {
                      type: 'string'
                    }
                  }
                }
              },
              {
                id: "schemaGuid2",
                status: 'published',
                // dataRegistry: {
                //   name: 'Twitter Schema 2'
                // },
                definition: {
                  properties: {
                    url: {
                      type: 'string'
                    },
                    username: {
                      type: 'string'
                    },
                    password: {
                      type: 'string'
                    }
                  }
                }
              },
              {
                id: "schemaGuid2",
                status: 'published',
                // dataRegistry: {
                //   name: 'Twitter Schema'
                // },
                definition: {
                  test: "citest"
                }
              },
              {
                id: "schemaGuid2",
                status: 'draft',
                // dataRegistry: {
                //   name: 'Twitter Schema'
                // },
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

//// Template list setup
let initialSchemas = {
  schemaGuid1: {
    schemaId: 'schemaGuid1',
    data: {
      url: 'twitter.com',
      username: 'THEREALTRUMP'
    }
  }
};

let addedSchemas = {
  schemaGuid1: result.data.dataRegistries.records[0].schemas.records[0]
};
// function for template list
function receiveSchemaState(added) {
  console.log(added);
}

storiesOf('ContentTemplates', module)
  .add('Base', () => (
    <ContentTemplates
      templates={result.data.dataRegistries.records}
      initialTemplates={source.data.source.contentTemplates}
    />
  ))
  .add('Form Card', () => (
    <FormCard
      fields={fields}
      name={formName}
      removeCallback={removeForm}
      id={'id'}
    />
  ))