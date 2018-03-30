import React from 'react';
import { storiesOf } from '@storybook/react';
import Nullstate from './SourceConfiguration/Nullstate';
import SourceConfiguration from './SourceConfiguration';
import SourceTileView from './SourceConfiguration/SourceTileView';
import SourceRow from './SourceConfiguration/SourceRow';


let sourceTypes = {
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
let sourceResult = {
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

function submitCallback(result) {
  console.log(result);
};

storiesOf('SourceManagement', module)
  .add('Nullstate', () => (
    <Nullstate />
  ))
  .add('TileView', () => (
    <SourceTileView sources={sourceResults}/>
  ))
  .add('CreateSource', () => (
    <SourceConfiguration
      sourceTypes={sourceTypes.sourceTypes.records}
      submitCallback={submitCallback}
    />
  ))
  .add('EditSource', () => (
    <SourceConfiguration
      sourceTypes={sourceTypes.sourceTypes.records} 
      source={sourceResult.data.source}
      submitCallback={submitCallback}
    />
  ))
  .add('Row', () => (
    <SourceRow 
      name={sourceName}
      sourceType={sourceType}
      creationDate={creationDate}
      lastUpdated={lastUpdated}
      image={thumbnail}
    />
  ))