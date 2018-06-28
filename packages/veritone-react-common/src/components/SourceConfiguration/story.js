import React from 'react';
import { storiesOf } from '@storybook/react';
import SourceConfiguration from './';

const sourceTypes = {
  data: {
    records: [
      {
        name: 'Audio',
        id: 'audio1',
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
            },
            required: ['url', 'days']
          }
        }
      }
    ]
  }
};

const sourceDetails = {
  url: 'twitter.com',
  username: 'trump',
  password: 'password'
};

class SourceConfigWrapper extends React.Component {
  state = {
    sourceTypeId: sourceTypes.data.records[0].id,
    name: '',
    thumbnailUrl: '',
    details: { ... sourceDetails },
    thumbnailFile: null
  }

  saveConfiguration = config => {
    return this.setState(prevState => ({
      ...prevState.sourceConfig,
      ...config
    }));
  }

  handleSubmit = (e) => {
    e.preventDefault();

    console.log('Form Values:', this.state);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <SourceConfiguration
          sourceTypes={sourceTypes.data.records}
          source={this.state}
          onInputChange={this.saveConfiguration}
        />
        <button type="submit">Submit</button>
      </form>
    );
  }
}



storiesOf('Source Configuration', module)
  .add('Base', () => (
    <SourceConfigWrapper />
  ))
