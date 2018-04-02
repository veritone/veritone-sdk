import React from 'react';
import { storiesOf } from '@storybook/react';
import { pick, has, noop } from 'lodash';
import Nullstate from './Nullstate';
import SourceManagementForm from './SourceManagementForm';
import SourceTileView from './SourceTileView';
import SourceRow from './SourceRow';
import ContentTemplateForm from './ContentTemplateForm';

const sourceTypes = {
  sourceTypes: {
    records: [
      {
        name: "Audio",
        id: "audio_1",
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


// a mock return result on a source from graphql
const sourceResult = {
  data: {
    source: {
      id: "666",
      name: "KWOL--FM",
      createdDateTime: "2014-12-01T18:17:20.675Z",
      modifiedDateTime: "2015-12-01T18:17:20.675Z",
      thumbnail: "https://image.flaticon.com/icons/svg/25/25305.svg",
      details: {
        url: 'twitter.com',
        username: 'therealtrump',
        password: 'password'
      },
      sourceType: {
        id: "1",
        name: "Audio",
        sourceSchema: {
          id: "schemaId1",
          definition: {
            properties: {
              url: {
                type: "string",
              },
              username: {
                type: "string",
                title: "User Name"
              },
              password: {
                type: "string",
                title: "Password"
              }
            }
          }
        }
      }
    }
  }
}

let sourceName = sourceResult.data.source.name;
let sourceType = sourceResult.data.source.sourceType.name;
let creationDate = sourceResult.data.source.createdDateTime;
let lastUpdated = sourceResult.data.source.modifiedDateTime;
let thumbnail = sourceResult.data.source.thumbnail;

let sourceResults = [];
for (let i=0;i<4;i++) {
  sourceResults.push(sourceResult);
}

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

  const templateSchemas = createTemplateData(dataSchemas.data.dataRegistries.records);
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

const templateData = createTemplateData(dataSchemas.data.dataRegistries.records);
const initialTemplates = createInitialTemplates(templateSource.data.source.contentTemplates);

storiesOf('SourceManagement', module)
  .add('Nullstate', () => (
    <Nullstate />
  ))
  .add('TileView', () => (
    <SourceTileView sources={sourceResults}/>
  ))
  .add('Create Source', () => {
    return (
      <SourceManagementForm
        sourceTypes={sourceTypes.sourceTypes.records}
        templateData={templateData}
        initialTemplates={initialTemplates}
        onSubmit={noop}
        onClose={noop}
      />
    );
  })
  .add('Edit Source', () => {
    const sourceConfig = {
      ...pick(
        sourceResult.data.source,
        ['name', 'thumbnail', 'details', 'sourceTypeId', 'sourceType']
      )
    };

    return (
      <SourceManagementForm
        sourceTypes={sourceTypes.sourceTypes.records}
        source={sourceConfig}
        templateData={templateData}
        initialTemplates={initialTemplates}
        onSubmit={noop}
        onClose={noop}
      />
    );
  })
  .add('Row', () => (
    <SourceRow 
      name={sourceName}
      sourceType={sourceType}
      creationDate={creationDate}
      lastUpdated={lastUpdated}
      image={thumbnail}
    />
  ))
  .add('ContentTemplate Form', () => (
    <ContentTemplateForm
      templateData={templateData}
      initialTemplates={initialTemplates}
      onSubmit={noop}
    />
  ))