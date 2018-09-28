import { has, cloneDeep } from 'lodash';

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
                  type: 'object',
                  $schema: 'http://json-schema.org/draft-07/schema#',
                  required: [
                    'stationCallSign',
                    'liveTimezone',
                    'radioStreamUrl',
                    'stationBand',
                    'stationChannel',
                    'sourceFormat'
                  ],
                  properties: {
                    description: {
                      type: 'string',
                      title: 'Description'
                    },
                    radioStreamUrl: {
                      type: 'string',
                      title: 'Radio Stream Url'
                    },
                    liveTimezone: {
                      type: 'string',
                      title: 'Live Time Zone',
                      query: 'query { results: timeZones { id:name, name } }'
                    },
                    networkIds: {
                      type: 'array',
                      title: 'Network',
                      items: {
                        type: 'integer',
                        query:
                          'query { dataRegistries (name: "Veritone Network" nameMatch: startsWith limit: 1000) { records { id name publishedSchema { structuredDataObjects (limit:1000) { records { id: data(path: "networkId") name: data(path: "networkName") } } } } } }'
                      }
                    },
                    stationCallSign: {
                      type: 'string',
                      title: 'Call Sign'
                    },
                    stationBand: {
                      type: 'string',
                      title: 'Band'
                    },
                    stationChannel: {
                      type: 'string',
                      title: 'Station Channel (Frequency)'
                    },
                    webSiteUrl: {
                      type: 'string',
                      title: 'Web Site'
                    },
                    sourceFormat: {
                      type: 'string',
                      title: 'Genre (Format)',
                      query:
                        'query { results: sourceType (id: "1") { records: sourceFormats } }'
                    },
                    marketIds: {
                      type: 'array',
                      title: 'Markets',
                      items: {
                        type: 'integer',
                        query:
                          'query { dataRegistries (name: "Veritone Market" nameMatch: startsWith limit: 1000) { records { id name publishedSchema { structuredDataObjects (limit:1000) { records { id: data(path: "marketId") name: data(path: "marketName") } } } } } }'
                      }
                    },
                    homeMarketId: {
                      type: 'integer',
                      title: 'Home Market',
                      peerEnumKey: 'marketIds',
                      query:
                        'query { dataRegistries (name: "Veritone Market" nameMatch: startsWith limit: 1000) { records { id name publishedSchema { structuredDataObjects (limit:1000) { records { id: data(path: "marketId") name: data(path: "marketName") } } } } } }'
                    }
                  },
                  definitions: {}
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

export const templateData = createTemplateData(
  dataSchemas.data.dataRegistries.records
);
export const initialTemplates = createInitialTemplates(
  templateSource.data.source.contentTemplates
);
