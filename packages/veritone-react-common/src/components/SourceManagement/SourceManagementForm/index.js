import React from 'react';
import { arrayOf, objectOf, any, func, string, shape, bool } from 'prop-types';
import { pick, has, get } from 'lodash';
import Tabs, { Tab } from 'material-ui/Tabs';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import FullScreenDialog from 'components/FullScreenDialog';
import ModalHeader from 'components/ModalHeader';
import SourceConfiguration from '../SourceConfiguration';
import ContentTemplates from '../ContentTemplates';

import styles from './styles.scss';
@withMuiThemeProvider
export default class SourceManagementForm extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any)).isRequired,
    templateData: objectOf(
      shape({
        id: string,
        name: string.isRequired,
        status: string,
        definition: objectOf(any)
      })
    ).isRequired,
    source: objectOf(any),
    initialTemplates: objectOf(
      shape({
        id: string,
        name: string.isRequired,
        status: string,
        definition: objectOf(any),
        data: objectOf(any)
      })
    ),
    onSubmit: func.isRequired,
    onClose: func.isRequired,
    open: bool
  };

  static defaultProps = {
    initialTemplates: {}
  };

  state = {
    selectedSource: null,
    sourceConfig: {
      sourceTypeId: '',
      name: '',
      thumbnailUrl: '',
      details: {},
      thumbnailFile: null
    },
    contentTemplates: {},
    activeTab: 0,
    openDialog: true
  };

  componentWillMount() {
    const { sourceTypes } = this.props;
    const newState = {
      contentTemplates: { ...this.props.initialTemplates }
    };

    if (has(this.props, 'open')) {
      newState.openDialog = this.props.open;
    }
    if (this.props.source) {
      // if editing a source, initialize the defaults
      newState.sourceConfig = {
        ...pick(this.props.source, ['name', 'thumbnailUrl', 'details']),
        sourceTypeId: this.props.source.sourceType.id
      };
    } else {
      // If there is no source, then just pick the first available sourceType
      const fieldValues = {};
      const sourceTypeIdx = 0;
      const properties = get(sourceTypes, [
        sourceTypeIdx,
        'sourceSchema',
        'definition',
        'properties'
      ]);

      if (properties) {
        Object.keys(properties).forEach(field => {
          fieldValues[field] = '';
        });
      }

      newState.sourceConfig = {
        ...this.state.sourceConfig,
        sourceTypeId: sourceTypes[sourceTypeIdx].id,
        details: {
          ...fieldValues
        }
      };
    }

    return this.setState(newState);
  }

  handleOnClose = () => {
    return this.setState({ openDialog: false }, () => {
      this.props.onClose();
    });
  };

  handleChangeTab = (e, tabIdx) => {
    return this.setState({ activeTab: tabIdx });
  };

  saveConfiguration = config => {
    return this.setState(prevState => ({
      sourceConfig: {
        ...prevState.sourceConfig,
        ...config
      }
    }));
  };

  manageTemplatesList = (templateSchemaId, remove = false) => {
    const { templateData, initialTemplates } = this.props;

    if (remove) {
      if (this.state.contentTemplates[templateSchemaId]) {
        return this.setState(prevState => {
          const contentTemplates = { ...prevState.contentTemplates };
          delete contentTemplates[templateSchemaId];

          return { contentTemplates };
        });
      }
    } else {
      const data = {};
      Object.keys(templateData[templateSchemaId].definition.properties).reduce(
        (fields, schemaDefProp) => {
          data[schemaDefProp] =
            initialTemplates[templateSchemaId] &&
            initialTemplates[templateSchemaId].data
              ? initialTemplates[templateSchemaId].data[schemaDefProp]
              : '';
        },
        data
      );

      this.setState(prevState => ({
        contentTemplates: {
          [templateSchemaId]: {
            ...templateData[templateSchemaId],
            data
          },
          ...prevState.contentTemplates
        }
      }));
    }
  };

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

  handleSubmit = e => {
    e.preventDefault();
    return this.props.onSubmit({
      sourceConfiguration: this.state.sourceConfig,
      contentTemplates: this.state.contentTemplates
    });
  };

  render() {
    const { activeTab } = this.state;

    return (
      <FullScreenDialog open={this.state.openDialog}>
        <div className={styles['sm-form-wrapper']}>
          <ModalHeader
            title={
              this.state.sourceConfig.name
                ? this.state.sourceConfig.name
                : 'New Source'
            }
            icons={[
              <IconButton aria-label="exit" key="icon-3">
                <Icon
                  className="icon-close-exit"
                  onClick={this.handleOnClose}
                />
              </IconButton>
            ]}
          >
            <Tabs value={activeTab} onChange={this.handleChangeTab}>
              <Tab
                label="Configuration"
                classes={{ label: styles['form-tab'] }}
              />
              <Tab
                label="Content Templates"
                classes={{ label: styles['form-tab'] }}
              />
            </Tabs>
          </ModalHeader>
          <form onSubmit={this.handleSubmit} className={styles.formScroll}>
            {activeTab === 0 && (
              <SourceConfiguration
                sourceTypes={this.props.sourceTypes}
                source={this.state.sourceConfig}
                onInputChange={this.saveConfiguration}
                onClose={this.handleOnClose}
              />
            )}
            {activeTab === 1 && (
              <ContentTemplates
                templateData={this.props.templateData}
                selectedTemplateSchemas={this.state.contentTemplates}
                onListChange={this.manageTemplatesList}
                onInputChange={this.updateTemplateDetails}
              />
            )}
            <div className={styles['btn-container']}>
              <Button onClick={this.handleOnClose}>Cancel</Button>
              <Button variant="raised" color="primary" type="submit">
                {
                  get(this.props, 'source.id') ?
                  'Save' :
                  'Create'
                }
              </Button>
            </div>
          </form>
        </div>
      </FullScreenDialog>
    );
  }
}
