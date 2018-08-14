import React from 'react';
import { storiesOf } from '@storybook/react';
import { has, noop, cloneDeep } from 'lodash';
import SourceManagementForm from './';

const sourceTypes = {
  sourceTypes: {
    records: [
      {
        name: 'Audio',
        id: 'audio',
        sourceSchema: {
          definition: {
            "required": ["stationCallSign", "liveTimezone", "radioStreamUrl", "stationBand", "stationChannel", "mediaSourceFormatId"],
            "properties": {
              "description": {
                "type": "string",
                "title": "Description"
              },
              "radioStreamUrl": {
                "type": "string",
                "title": "Radio Stream Url"
              },
              "liveTimezone": {
                "type": "string",
                "title": "Live Time Zone",
                "query": "query { results: timeZones { id:name, name } }"
              },
              "network": {
                "type": "array",
                "title": "Network",
                "items": {
                  "type": "integer",
                  "query": "query { dataRegistries (name: \"Veritone Network\" nameMatch: startsWith limit: 1000) { records { id name publishedSchema { structuredDataObjects (limit:1000) { records { id: data(path: \"networkId\") name: data(path: \"networkName\") } } } } } }"
                }
              },
              "stationCallSign": {
                "type": "string",
                "title": "Call Sign"
              },
              "stationBand": {
                "type": "string",
                "title": "Band"
              },
              "stationChannel": {
                "type": "string",
                "title": "Station Channel (Frequency)"
              },
              "webSiteUrl": {
                "type": "string",
                "title": "Web Site"
              },
              "mediaSourceFormatId": {
                "type": "integer",
                "title": "Genre (Format)",
                "enum": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
                "enumNames": ["Country","Urban","Oldies","News","Dark - Not on air","Easy Listening/Beautiful Music","Ethnic","Contemporary Hit Radio/Top 40","Spanish","Jazz/New Age","Public/Educational Station","Nostalgia/Big Band","Religion","Sports","Rock","Adult Contemporary","Album Oriented Rock/Classic Rock","Classical","Middle of the Road","Talk","Miscellaneous"]
              },
              "markets": {
                "type": "array",
                "title": "Markets",
                "items": {
                  "type": "integer",
                  "query": "query { dataRegistries (name: \"Veritone Market\" nameMatch: startsWith limit: 1000) { records { id name publishedSchema { structuredDataObjects (limit:1000) { records { id: data(path: \"marketId\") name: data(path: \"marketName\") } } } } } }"
                }
              },
              "homeMarketId": {
                "type": "integer",
                "title": "Home Market",
                "peerEnumKey": "markets",
                "query": "query { dataRegistries (name: \"Veritone Market\" nameMatch: startsWith limit: 1000) { records { id name publishedSchema { structuredDataObjects (limit:1000) { records { id: data(path: \"marketId\") name: data(path: \"marketName\") } } } } } }"
              }
            }
          }
        }
      },
      {
        name: 'Broadcast TV',
        id: 'tv',
        sourceSchema: {
          definition: {
            "required": ["stationCallSign", "liveTimezone", "radioStreamUrl", "stationBand", "stationChannel", "mediaSourceFormatId"],
            "properties": {
              "description": {
                "type": "string",
                "title": "Description"
              },
              "radioStreamUrl": {
                "type": "string",
                "title": "Stream Url"
              },
              "isNational": {
                "type": "boolean",
                "title": "Is National"
              },
              "liveTimezone": {
                "type": "string",
                "title": "Live Time Zone",
                "query": "query { schema: timeZones { id:name, name } }"
              },
              "network": {
                "type": "array",
                "title": "Network",
                "items": {
                  "type": "integer",
                  "query": "query { schema(id: \"eb101933-f931-4e63-8733-2fae48ef6df8\") { results: structuredDataObjects(limit: 10000) { records { id: data(path: \"networkId\") name: data(path: \"networkName\") } } }}"
                }
              },
              "stationCallSign": {
                "type": "string",
                "title": "Call Sign"
              },
              "stationBand": {
                "type": "string",
                "title": "Band"
              },
              "stationChannel": {
                "type": "string",
                "title": "Station Channel (Frequency)"
              },
              "webSiteUrl": {
                "type": "string",
                "title": "Web Site"
              },
              "mediaSourceFormatId": {
                "type": "integer",
                "title": "Genre (Format)",
                "query": "query { mediaSourceFormats { records { id name } } }"
              },
              "markets": {
                "type": "array",
                "title": "Markets",
                "items": {
                  "type": "integer",
                  "query": "query { schema(id: \"f9e9e760-0d24-40bc-ac79-540408c59de1\") { results: structuredDataObjects(limit: 10000) { records { id: data(path: \"marketId\") name: data(path: \"marketName\") } } }}"
                }
              },
              "homeMarketId": {
                "type": "integer",
                "title": "Home Market",
                "peerEnumKey": "markets",
                "query": "query { schema(id: \"f9e9e760-0d24-40bc-ac79-540408c59de1\") { results: structuredDataObjects(limit: 10000) { records { id: data(path: \"marketId\") name: data(path: \"marketName\") } } }}"
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
      thumbnailUrl: 'https://image.flaticon.com/icons/svg/25/25305.svg',
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
          },
          validActions: ['view', 'edit', 'deactivate', 'delete']
        }
      }
    }
  }
};

const sourceResults = [];
for (let i = 0; i < 4; i++) {
  sourceResults.push(sourceResult.data.source);
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
                id: 'schemaGuid1',
                status: 'published',
                definition: {
                  properties: {
                    url: {
                      type: 'string',
                      title: 'URL'
                    },
                    username: {
                      type: 'string',
                      title: 'Username'
                    },
                    testArray: {
                      type: 'array',
                      title: 'Array Test',
                      items: {
                        type: 'number',
                        title: 'Item Title'
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
                      title: 'Geo Location'
                    },
                    trueOrFalse: {
                      type: 'boolean',
                      title: 'Boolean'
                    },
                    datetimeEnd: {
                      type: 'dateTime',
                      title: 'End Date'
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
  const selectedTemplateSchemas = [];

  const templateSchemas = createTemplateData(
    dataSchemas.data.dataRegistries.records
  );
  templateSources.forEach(template => {
    if (has(templateSchemas, template.schemaId)) {
      const selectedTemplate = cloneDeep(templateSchemas[template.schemaId]);
      if (template.data) {
        // if we need to fill out the form with pre-data
        selectedTemplate.data = template.data;
      }
      selectedTemplateSchemas.push(selectedTemplate);
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

function displayForm(form) {
  console.log(form);
}

const fakeSchemaOptions = [{
  name: 'name0',
  id: 0
}, {
  name: 'name1',
  id: 1
}, {
  name: 'name2',
  id: 2
}]

const getFieldOptions = query => {
  console.log('Executed Query: ' + query);
  return Promise.resolve(fakeSchemaOptions);
}

storiesOf('SourceManagementForm', module)
  .add('Create Source', () => {
    return (
      <SourceManagementForm
        sourceTypes={sourceTypes.sourceTypes.records}
        templateData={templateData}
        initialTemplates={initialTemplates}
        onSubmit={displayForm}
        onClose={noop}
        getFieldOptions={getFieldOptions}
        canShare
      />
    );
  })
  .add('Edit Source', () => {
    return (
      <SourceManagementForm
        sourceTypes={sourceTypes.sourceTypes.records}
        source={sourceResult.data.source}
        templateData={templateData}
        initialTemplates={initialTemplates}
        onSubmit={displayForm}
        onClose={noop}
        getFieldOptions={getFieldOptions}
      />
    );
  });
