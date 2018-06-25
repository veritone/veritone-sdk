import React from 'react';
import { storiesOf } from '@storybook/react';
import { has } from 'lodash';
import NullState from './NullState';
import ContentTemplateForm from './';

// CONTENT TEMPLATES SETUP
const templateSource = {
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

const dataSchemas = {
  data: {
    dataRegistries: {
      records: [
        {
          name: 'Twitter Schema',
          schemas: {
            records: [
              {
                id: 'schemaGuid1',
                status: 'published',
                definition: {
                  properties: {
                    url: {
                      type: 'string',
                      title: 'URL'
                    },
                    username: {
                      type: 'string'
                    },
                    testArray: {
                      type: 'array',
                      title: 'Array Test',
                      items: {
                        type: 'number',
                        title: 'item title'
                      }
                    },
                    testObject: {
                      type: 'object',
                      title: 'Object Test',
                      properties: {
                        objectString: {
                          type: 'string',
                          title: 'Object String'
                        },
                        objectNumber: {
                          type: 'number',
                          title: 'Object Number'
                        }
                      }
                    },
                    number: {
                      type: 'number',
                      title: 'Number'
                    },
                    geoLocation: {
                      type: 'geoPoint',
                      title: 'geoLocation'
                    },
                    trueOrFalse: {
                      type: 'boolean',
                      title: 'Boolean'
                    },
                    datetimeEnd: {
                      type: 'dateTime',
                      title: 'datetimeEnd'
                    }
                  }
                }
              },
              {
                id: 'schemaGuid2',
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
                id: 'schemaGuid2',
                status: 'published',
                // dataRegistry: {
                //   name: 'Twitter Schema'
                // },
                definition: {
                  test: 'citest'
                }
              },
              {
                id: 'schemaGuid2',
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
};

function createTemplateData(dataSchemas) {
  const templateSchemas = {};
  // array of data registries containing an array of schemas
  dataSchemas.reduce((schemaStore, registryData) => {
    registryData.schemas.records.forEach(schema => {
      // only take schemas that are 'published' and also define field types
      if (
        schema.status === 'published' &&
        has(schema.definition, 'properties')
      ) {
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

  const templateSchemas = createTemplateData(
    dataSchemas.data.dataRegistries.records
  );
  templateSources.forEach(template => {
    if (has(templateSchemas, template.schemaId)) {
      selectedTemplateSchemas[template.schemaId] =
        templateSchemas[template.schemaId];
      if (template.data) {
        // if we need to fill out the form with pre-data
        selectedTemplateSchemas[template.schemaId].data = template.data;
      }
    }
  });

  return selectedTemplateSchemas;
}

const templateData = createTemplateData(
  dataSchemas.data.dataRegistries.records
);
const initialTemplates = createInitialTemplates(
  templateSource.data.source.contentTemplates
);

function logFormData(formData) {
  console.log(formData);
}

storiesOf('Content Templates', module)
  .add('Nullstate', () => <NullState />)
  .add('ContentTemplate Form', () => (
    <ContentTemplateForm
      templateData={templateData}
      initialTemplates={initialTemplates}
      onSubmit={logFormData}
    />
  ));
