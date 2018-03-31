import React from 'react';
import { arrayOf, objectOf, any, func, shape, string, object } from 'prop-types';
import { has, pick } from 'lodash';
import Tabs, { Tab } from 'material-ui/Tabs';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import FullScreenDialog from 'components/FullScreenDialog';
import ModalHeader from 'components/ModalHeader';
import SourceManagementNullState from './Nullstate';
import SourceTileView from './SourceRow';
import SourceConfiguration from './SourceConfiguration';
import ContentTemplates from './ContentTemplates';
import styles from './styles.scss';


export default class SourceManagementOverview extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any)).isRequired,
    sources: arrayOf(objectOf(any)),
    templateData: objectOf(shape({
      id: string,
      name: string.isRequired,
      status: string,
      definition: objectOf(any)
    })).isRequired,
    initialTemplates: objectOf(shape({
      id: string,
      name: string.isRequired,
      status: string,
      definition: objectOf(any),
      data: objectOf(any)
    })),
    onSubmit: func.isRequired,
  }

  static defaultProps = {
    sourceTypes: [],
    sources: [],
    templateData: {},
    initialTemplates: {}
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
    const newState = {
      contentTemplates: { ...this.props.initialTemplates }
    };

    // if (this.props.source) { // if editing a source, initialize the defaults
    //   const source = this.props.source;
    //   // return this.setState({
    //     newState.sourceConfig = {
    //       ...pick(source, ['name', 'thumbnail', 'details']),
    //       // name: source.name || '',
    //       // thumbnail: source.thumbnail || '',
    //       // details: source.details || {},
    //       sourceTypeId: source.sourceType.id
    //     }
    //   // });
    // } 
    // else {
      const fieldValues = {};
      const properties = this.props.sourceTypes[0].sourceSchema.definition.properties;
  
      Object.keys(properties).forEach((field) => {
        fieldValues[field] = '';
      });
  
      // return this.setState({
        newState.sourceConfig = {
          ...this.state.sourceConfig,
          details: {
            ...fieldValues
          }
        }

    return this.setState(newState);
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

  openDialog = () => {
    return this.setState({ openFormDialog: true });
  };

  handleOnClose = () => {
    return this.setState({ openFormDialog: false });
  }

  handleChangeTab = (e, tabIdx) => {
    return this.setState({ activeTab: tabIdx });
  }

  saveConfiguration = (config) => {
    return this.setState({
      sourceConfig: {
        ...this.state.sourceConfig,
        ...config
      }
    });
  }

  manageTemplatesList = (templateSchemaId, remove = false) => {
    const { templateData, initialTemplates } = this.props;

    if (remove) {
      if (this.state.contentTemplates[templateSchemaId]) {
        const contentTemplates = { ...this.state.contentTemplates };
        delete contentTemplates[templateSchemaId];
  
        return this.setState({ contentTemplates });
      }
    } else {
      const data = {};
      Object.keys(templateData[templateSchemaId].definition.properties)
        .reduce((fields, schemaDefProp) => {
          data[schemaDefProp] = (initialTemplates[templateSchemaId] && initialTemplates[templateSchemaId].data)
            ? initialTemplates[templateSchemaId].data[schemaDefProp]
            : '';
        }, data)

        console.log('data:', data)

      this.setState({
        contentTemplates: {
          ...this.state.contentTemplates,
          [templateSchemaId]: {
            ...templateData[templateSchemaId],
            data
            // data: {
            //   ...data
            // }
          }
        }
      });
    }
  }

  updateTemplateDetails = (templateSchemaId, fieldId, value) => {
    const { contentTemplates } = this.state;

    this.setState({
      contentTemplates: {
        ...contentTemplates,
        [templateSchemaId]: {
          ...contentTemplates[templateSchemaId],
          data: {
            ...contentTemplates[templateSchemaId].data,
            [fieldId]: value
          }
        }
      }
    });
  };
  
  handleSubmit = (e) => {
    e.preventDefault();
    return this.props.onSubmit({
      sourceConfiguration: this.state.sourceConfig,
      contentTemplates: this.state.contentTemplates
    });
  }

  renderDialog = () => {
    const { activeTab } = this.state;

    return (
      <FullScreenDialog
        open={this.state.openFormDialog}
      >
        <ModalHeader
          title={this.state.selectedSource ? this.state.selectedSource.name : "New Source"}
          icons={[
            <IconButton aria-label='help' key={1}>
              <Icon className='icon-help2' />
            </IconButton>,
            <IconButton aria-label='menu' key={2}>
              <Icon className='icon-more_vert' />
            </IconButton>,
            <IconButton aria-label='trash' key={3}>
              <Icon className='icon-trash' />
            </IconButton>,
            <span className={styles.separator} key={4} />,
            <IconButton aria-label='exit' key={5}>
              <Icon className='icon-close-exit' onClick={this.handleOnClose} />
            </IconButton>
          ]}
        >
          <Tabs value={activeTab} onChange={this.handleChangeTab}>
            <Tab label="Configuration" />
            <Tab label="Content Templates" />
          </Tabs>
        </ModalHeader>
        <form onSubmit={this.handleSubmit}>
          {activeTab === 0 &&
            <SourceConfiguration
              sourceTypes={this.props.sourceTypes}
              source={this.state.sourceConfig}
              onInputChange={this.saveConfiguration}
              onClose={this.handleOnClose} />}
          {activeTab === 1 && 
            <ContentTemplates
              templateData={this.props.templateData}
              selectedTemplateSchemas={this.state.contentTemplates}
              onListChange={this.manageTemplatesList}
              onInputChange={this.updateTemplateDetails}
            />
          }
          <div className={styles.btnContainer}>
            <Button onClick={this.handleOnClose}>
              Cancel
            </Button>
            <Button raised color='primary' type="submit">
              Create
            </Button>
          </div>        
        </form>
      </FullScreenDialog>
    );
  }

  render() {
    return (
      <div>
        {
          this.props.sources.length
          ? <SourceManagementNullState onClick={this.openDialog} />
          : <SourceTileView
              onSelectSource={this.selectSource}
              sources={this.props.sources}
            />
        }
        {this.state.openFormDialog && this.renderDialog()}
      </div>
    );
  }
}
