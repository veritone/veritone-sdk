import React from 'react';
import { has } from 'lodash';

import {
  arrayOf,
  object,
  func
} from 'prop-types';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import TemplateForms from './TemplateForms';
import TemplateList from './TemplateList';
import ContentTemplatesNullstate from './Nullstate';
import styles from './styles.scss';

@withMuiThemeProvider
export default class ContentTemplates extends React.Component {
  static propTypes = {
    templates: arrayOf(object).isRequired,
    initialTemplates: arrayOf(object),
    onSubmit: func.isRequired,
    onCancel: func.isRequired,
  };
  static defaultProps = {};

  state = {
    templateSchemas: {},
    selectedTemplateSchemas: {}
  };

  componentWillMount() {
    const templateSchemas = {};
    // array of data registries containing an array of schemas
    this.props.templates.reduce((schemaStore, registryData) => {
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

    const selectedTemplateSchemas = {};

    if (this.props.initialTemplates) {
      this.props.initialTemplates.forEach(template => {
        if (has(templateSchemas, template.schemaId)) {
          selectedTemplateSchemas[template.schemaId] = templateSchemas[template.schemaId];
          if (template.data) { // if we need to fill out the form with pre-data
            selectedTemplateSchemas[template.schemaId].data = template.data;
          }
        }
      });
    }

    this.setState({
      templateSchemas,
      selectedTemplateSchemas
    });
  };

  handleAddOrRemoveTemplate = (schemaId, remove = false) => {
    if (remove) {
      return this.handleRemoveTemplate(schemaId);
    }

    const data = {};
    Object.keys(this.state.templateSchemas[schemaId].definition.properties)
    .reduce((fields, schemaDefProp) => {
      data[schemaDefProp] = '';
    }, data)

    this.setState({
      selectedTemplateSchemas: {
        ...this.state.selectedTemplateSchemas,
        [schemaId]: {
          ...this.state.templateSchemas[schemaId],
          data: {
            ...data
          }
        }
      }
    });
  };

  handleRemoveTemplate = (schemaId) => { 
    if (this.state.selectedTemplateSchemas[schemaId]) {
      const selectedTemplateSchemas = { ...this.state.selectedTemplateSchemas };
      delete selectedTemplateSchemas[schemaId];

      this.setState({ selectedTemplateSchemas });
    }
  };

  handleFormChange = (schemaId, fieldId, value) => {
    const selectedTemplateSchemas = this.state.selectedTemplateSchemas;

    this.setState({
      selectedTemplateSchemas: {
        ...selectedTemplateSchemas,
        [schemaId]: {
          ...selectedTemplateSchemas[schemaId],
          data: {
            ...selectedTemplateSchemas[schemaId].data,
            [fieldId]: value
          }
        }
      }
    });
  };

  render() {
    console.log('this.state:', this.state)
    const { selectedTemplateSchemas } = this.state;
    const showNullstate = !Object.keys(selectedTemplateSchemas).length;

    return (
      <div className={styles.templatePage}>
        <TemplateList 
          templates={this.state.templateSchemas} 
          // initialTemplates={selectedTemplateSchemas}
          selectedTemplates={selectedTemplateSchemas}
          addOrRemoveTemplate={this.handleAddOrRemoveTemplate}
        />
        <div className={styles['content-templates']}>
          {
            showNullstate
              ? <ContentTemplatesNullstate />
              : <TemplateForms
                  templates={selectedTemplateSchemas}
                  removeTemplate={this.handleRemoveTemplate}
                  onFormChange={this.handleFormChange}
                  onSubmit={this.props.onSubmit}
                  onCancel={this.props.onCancel}
                />
          }
        </div>
      </div>
    );
  };
}