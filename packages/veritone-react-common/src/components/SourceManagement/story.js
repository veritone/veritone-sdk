import React from 'react';
import { storiesOf } from '@storybook/react';
import NullState from './NullState';
import SourceTileView from './SourceTileView';

// a mock return result on a source from graphql
const sourceResult = {
  data: {
    source: {
      id: '666',
      name: 'KWOL--FM',
      isLivestream: true,
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

for (let i = 0; i < 15; i++) {
  sourceResults.push(sourceResult.data.source);
}

function btnClick() {
  alert('Button Clicked!');
}

storiesOf('SourceManagement', module)
  .add('NullState', () => <NullState onClick={btnClick} />)
  .add('Tile View', () => <SourceTileView sources={sourceResults} />);
