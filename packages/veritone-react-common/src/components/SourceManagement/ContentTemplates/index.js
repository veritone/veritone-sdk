import React from 'react';
import { has } from 'lodash';

import {
  any, 
  objectOf,
} from 'prop-types';
import Button from 'material-ui/Button';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import TemplateForms from './TemplateForms';
import TemplateList from './TemplateList';
import ContentTemplatesNullstate from './Nullstate';
import styles from './styles.scss';

@withMuiThemeProvider
export default class ContentTemplates extends React.Component {
  static propTypes = {
    templates: objectOf(any).isRequired, //make a graphql query for the list of all schemas through "dataRegistries"
    source: objectOf(any).isRequired, // make a graphql query for the source by id
  };
  static defaultProps = {};

  state = {
    schemas: {},
    addedSchemas: {}
  };

  componentWillMount = () => {
    // array of data registries containing an array of schemas
    const schemas = {};
    this.props.templates.data.dataRegistries.records
    .reduce((schemaStore, dataSchema) => {
      // array of schemas containing an individual schema
      dataSchema.schemas.records.forEach(schema => {
        // only show schemas that are 'published' and also define field types
        if (schema.status === 'published' && has(schema.definition, 'properties')) {
          schemaStore[schema.id] = { name: dataSchema.name, ...schema };
        }
      });
    }, schemas);

    const trackAdded = {};

    if (this.props.source.data.source.contentTemplates) {
      this.props.source.data.source.contentTemplates.forEach(template => {
        if (has(schemas, template.schemaId)) {
          trackAdded[template.schemaId] = schemas[template.schemaId];
          if (template.data) { // if we need to fill out the form with pre-data
            trackAdded[template.schemaId].data = template.data;
          }
        }
      });
    }

    this.setState({
      schemas,
      addedSchemas: trackAdded
    });
  };

  handleAddOrRemoveSchema = (schemaId, remove = false) => {
    if (remove) {
      return this.handleRemoveSchema(schemaId);
    }

    const data = {};
    Object.keys(this.state.schemas[schemaId].definition.properties)
    .reduce((fields, schemaDefProp) => {
      data[schemaDefProp] = '';
    }, data)

    this.setState({
      addedSchemas: {
        ...this.state.addedSchemas,
        [schemaId]: {
          ...this.state.schemas[schemaId],
          data: {
            ...data
          }
        }
      }
    });
  };

  handleRemoveSchema = (schemaId) => { 
    // if (has(this.state.addedSchemas, schemaId) && this.state.addedSchemas[schemaId]) {
    if (this.state.addedSchemas[schemaId]) {
      const addedSchemas = { ...this.state.addedSchemas };
      delete addedSchemas[schemaId];

      this.setState({ addedSchemas });
    }
  };

  handleFormChange = (schemaId, fieldId, value) => {
    // console.log(schemaState);
    const addedSchemas = this.state.addedSchemas;

    this.setState({
      addedSchemas: {
        ...addedSchemas,
        [schemaId]: {
          ...addedSchemas[schemaId],
          data: {
            ...addedSchemas[schemaId].data,
            [fieldId]: value
          }
        }
      }
    });
  };

  handleSubmit = () => {

  }

  render() {
    console.log('this.state:', this.state)
    const { addedSchemas } = this.state;
    const showNullstate = !Object.keys(addedSchemas).length;

    return (
      <div className={styles.templatePage}>
        <TemplateList 
          templates={this.state.schemas} 
          // initialTemplates={addedSchemas}
          addedSchemas={addedSchemas}
          addOrRemoveSchema={this.handleAddOrRemoveSchema}
        />
        <div className={styles['content-templates']}>
          {
            showNullstate
              ? <ContentTemplatesNullstate />
              : <TemplateForms
                  schemas={addedSchemas}
                  removeSchema={this.handleRemoveSchema}
                  onFormChange={this.handleFormChange}
                  onSubmit={this.handleSubmit}
                  onCancel={this.handleCancel}
                />
          }
          <div className={styles.btnContainer}>
            <Button onClick={this.props.onCancel}>
              Cancel
            </Button>
            <Button
              raised
              color='primary'
              type="submit"
              // component='span'
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    );
  };
}