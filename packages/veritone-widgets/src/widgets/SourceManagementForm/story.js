import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import VeritoneApp from '../../shared/VeritoneApp';
import SourceManagementFormWidget from './';
import { has, noop } from 'lodash';

const sourceTypes = {
  sourceTypes: {
    records: [
      {
        name: 'Audio',
        id: 'audio_1',
        sourceSchema: {
          definition: {
            properties: {
              url: {
                type: 'string'
              },
              username: {
                type: 'string',
                title: 'User Name'
              },
              password: {
                type: 'string'
              }
            },
            required: ['url', 'username', 'password']
          }
        }
      },
      {
        name: 'Audio2',
        id: 'audio_2',
        sourceSchema: {
          definition: {
            properties: {
              url: {
                type: 'string'
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

// a mock return result on a source from graphql
const sourceResult = {
  data: {
    source: {
      id: '666',
      name: 'KWOL--FM',
      createdDateTime: '2014-12-01T18:17:20.675Z',
      modifiedDateTime: '2015-12-01T18:17:20.675Z',
      thumbnail: 'https://image.flaticon.com/icons/svg/25/25305.svg',
      details: {
        url: 'twitter.com',
        username: 'therealtrump',
        password: 'password'
      },
      sourceType: {
        id: '1',
        name: 'Audio',
        sourceSchema: {
          id: 'schemaId1',
          definition: {
            properties: {
              url: {
                type: 'string'
              },
              username: {
                type: 'string',
                title: 'User Name'
              },
              password: {
                type: 'string',
                title: 'Password'
              }
            }
          }
        }
      }
    }
  }
};

let sources = [];
for (let i = 0; i < 4; i++) {
  sources.push(sourceResult.data.source);
}

// CONTENT TEMPLATES SETUP
const source = {
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

// FORM CARDS LIST SETUP
const result = {
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
    result.data.dataRegistries.records
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

const templateData = createTemplateData(result.data.dataRegistries.records);
const initialTemplates = createInitialTemplates(
  source.data.source.contentTemplates
);

class Story extends React.Component {
  componentDidMount() {
    this._smFormWidget = new SourceManagementFormWidget({
      elId: 'sm-form-widget',
      title: 'Source Management Form Widget',
      sourceTypes: sourceTypes.sourceTypes.records,
      sources,
      templateData,
      initialTemplates,
      onClose: noop,
      onSubmit: data => {
        console.log('data:', data);
      }
    });
  }

  componentWillUnmount() {
    this._smFormWidget.destroy();
  }

  render() {
    return (
      <div>
        <span id="sm-form-widget" />
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('Source Management Form', module).add('Base', () => {
  const sessionToken = text('Api Session Token', '');

  return <Story sessionToken={sessionToken} store={app._store} />;
});
