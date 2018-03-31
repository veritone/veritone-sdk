import React from 'react';
import { storiesOf } from '@storybook/react';
import Nullstate from './Nullstate';
import SourceConfiguration from './SourceConfiguration';
import SourceTileView from './SourceTileView';
import SourceRow from './SourceRow';
import { pick } from 'lodash';

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

export default class SourceManagementOverview extends React.Component {
  static propTypes = {
    // sourceTypes: arrayOf(objectOf(any)),
    // sources: arrayOf(objectOf(any)),
    // onSubmit: func.isRequired,
  }

  static defaultProps = {
    sourceTypes: [],
    sources: []
  }

  state = {
    selectedSource: null,
    sourceConfig: {
      sourceTypeId: '',
      name: '',
      thumbnail: '',
      details: {}
    },
    contentTemplates: {},
    openFormDialog: false,
    activeTab: 0
  }

  componentWillMount() {
    if (this.props.source) { // if editing a source, initialize the defaults
      const source = this.props.source;
      return this.setState({
        sourceConfig: {
          name: source.name || '',
          thumbnail: source.thumbnail || '',
          details: source.details || {},
          sourceTypeId: source.sourceType.id
        }
      });
    }

    const fieldValues = {};
    const properties = this.props.sourceTypes[0].sourceSchema.definition.properties;

    Object.keys(properties).forEach((field) => {
      fieldValues[field] = '';
    });

    return this.setState({
      sourceConfig: {
        ...this.state.sourceConfig,
        details: {
          ...fieldValues
        }
      }
    });
  };

  selectSource = (selectedSource) => {
    const source = this.state.sources[selectedSource];
    const sourceConfig = pick(
      source,
      ['name', 'details', 'thumbnail', 'sourceTypeId', 'sourceType']
    );

    this.setState({
      selectedSource,
      sourceConfig
    })
  }

  saveConfiguration = (config) => {
    // return this.props.onSubmit(config);
    return this.setState({
      sourceConfig: {
        ...this.state.sourceConfig,
        ...config
      }
    });
  }

  handleSubmitContentTemplates = (templates) => {
    return this.props.onSubmit(templates);
  }

  render() {
    return (
      <SourceConfiguration
        sourceTypes={this.props.sourceTypes}
        source={this.state.sourceConfig}
        // selectedSource={this.state.selectedSource}
        onInputChange={this.saveConfiguration}
        onClose={this.handleOnClose}
      />
    );
  }
}

storiesOf('SourceManagement', module)
  .add('Nullstate', () => (
    <Nullstate />
  ))
  .add('TileView', () => (
    <SourceTileView sources={sourceResults}/>
  ))
  .add('CreateSource', () => {
    const sourceConfig = {
      name: '',
      thumbnail: '',
      details: {},
      sourceTypeId: ''
    };
    
    return (
      <SourceManagementOverview
        sourceTypes={sourceTypes.sourceTypes.records}
        // source={sourceConfig}    
        // onInputChange={submitCallback}
      />
    );
  })
  .add('EditSource', () => {
    const sourceConfig = {
      ...pick(
        sourceResult.data.source,
        ['name', 'thumbnail', 'details', 'sourceTypeId']
      ),
      requiredFields: {},
    };

    return (
      <SourceConfiguration
        sourceTypes={sourceTypes.sourceTypes.records} 
        source={sourceConfig}
        onInputChange={submitCallback}
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