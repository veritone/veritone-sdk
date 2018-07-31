import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { noop } from 'lodash';
import VeritoneApp from '../../shared/VeritoneApp';
import SourceListWidget from './';

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
          }
        }
      }
    }
  }
};

const sources = [];
for (let i = 0; i < 4; i++) {
  sources.push(sourceResult.data.source);
}

class Story extends React.Component {
  componentDidMount() {
    this._srcList = new SourceListWidget({
      elId: 'src-list-widget',
      title: 'Source Management Widget',
      sources,
      onSelectMenuItem: noop,
      onCreateSource: noop,
      onSelectSource: noop
    });
  }

  componentWillUnmount() {
    this._srcList.destroy();
  }

  render() {
    return (
      <div>
        <span id="src-list-widget" />
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('Source List', module).add('Base', () => {
  const sessionToken = text('Api Session Token', '');

  return <Story sessionToken={sessionToken} store={app._store} />;
});
