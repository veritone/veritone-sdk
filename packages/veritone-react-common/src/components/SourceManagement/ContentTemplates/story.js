import React from 'react';
import { storiesOf } from '@storybook/react';
import { has } from 'lodash';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import InputLabel from 'material-ui/Input/InputLabel';
import TemplateForms from './TemplateForms';
import TemplateList from './TemplateList';
import FormCard from './FormCard';
import ContentTemplates from './';

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

function createTemplateData(dataSchemas) {
  const templateSchemas = {};
  // array of data registries containing an array of schemas
  dataSchemas.reduce((schemaStore, registryData) => {
    registryData.schemas.records.forEach(schema => {
      // only take schemas that are 'published' and also define field types
      if (schema.status === 'published' && has(schema.definition, 'properties')) {
        schemaStore[schema.id] = {
          name: registryData.name,
          ...schema
        };
      }
    });
  }, templateSchemas);

  return templateSchemas;
}

function createInitialTemplates(templateSources) {
  const selectedTemplateSchemas = {};

  const templateSchemas = createTemplateData(result.data.dataRegistries.records);
  templateSources.forEach(template => {
    if (has(templateSchemas, template.schemaId)) {
      selectedTemplateSchemas[template.schemaId] = templateSchemas[template.schemaId];
      if (template.data) { // if we need to fill out the form with pre-data
        selectedTemplateSchemas[template.schemaId].data = template.data;
      }
    }
  });

  return selectedTemplateSchemas;
}

const templateData = createTemplateData(result.data.dataRegistries.records);
const initialTemplates = createInitialTemplates(source.data.source.contentTemplates);

export default class SMOverview extends React.Component {
  state = {
    contentTemplates: {}
  }

  componentWillMount() {
    const newState = {
      contentTemplates: { ...this.props.initialTemplates }
    };

    return this.setState(newState);
  };

  manageTemplatesList = (templateSchemaId, remove = false) => {
    if (remove) {
      if (this.state.contentTemplates[templateSchemaId]) {
        const contentTemplates = { ...this.state.contentTemplates };
        delete contentTemplates[templateSchemaId];

        return this.setState({ contentTemplates });
      }
    } else {
      const data = {};
      Object.keys(templateData[templateSchemaId].definition.properties)
        .reduce((fields, schemaDefProp) => {
          data[schemaDefProp] = (initialTemplates[templateSchemaId] && initialTemplates[templateSchemaId].data)
            ? initialTemplates[templateSchemaId].data[schemaDefProp]
            : '';
        }, data)

      this.setState({
        contentTemplates: {
          ...this.state.contentTemplates,
          [templateSchemaId]: {
            ...this.props.templateData[templateSchemaId],
            data
          }
        }
      });
    }
  }

  updateTemplateDetails = (templateSchemaId, fieldId, value) => {
    const { contentTemplates } = this.state;

    this.setState({
      contentTemplates: {
        ...contentTemplates,
        [templateSchemaId]: {
          ...contentTemplates[templateSchemaId],
          data: {
            ...contentTemplates[templateSchemaId].data,
            [fieldId]: value
          }
        }
      }
    });
  };

  render() {
    return (
        <ContentTemplates
          templateData={this.props.templateData}
          selectedTemplateSchemas={this.state.contentTemplates}
          onListChange={this.manageTemplatesList}
          onInputChange={this.updateTemplateDetails}
        />
    );
  }
}


storiesOf('ContentTemplates', module)
  .add('Base', () => (
    <SMOverview
      templateData={templateData}
      initialTemplates={initialTemplates}
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