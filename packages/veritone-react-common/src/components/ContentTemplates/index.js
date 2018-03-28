import React from 'react';
import { has } from 'lodash';

import {
  any, 
  arrayOf, 
  objectOf,
  func,
  string
} from 'prop-types';

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

  constructor(props) {
    super(props);
    this.state = {
      schemas: {},
      addedSchemas: {}
    };
  }

  componentWillMount = () => {
    let schemaSaver = {};
    this.props.templates.data && this.props.templates.data.dataRegistries.records.forEach(schemas => {
      // array of data registries containing an array of schemas
      schemas.schemas.records.forEach(schema => {
        // array of schemas containing an individual schema
        if (schema.status === 'published') {
          // only show published schemas
          if (has(schema.definition, 'properties')) {
            // filter out schemas that don't define field types
            schemaSaver[schema.id] = schema;
          }
        }
      });
    });

    let trackAdded = {};
    if (this.props.source.data && this.props.source.data.source.contentTemplates) {
      this.props.source.data.source.contentTemplates.forEach(template => {
        if (has(schemaSaver, template.schemaId)) {
          trackAdded[template.schemaId] = schemaSaver[template.schemaId];
          if (template.data) {
            // if we need to fill out the form with pre-data
            trackAdded[template.schemaId].data = template.data;
          }
        }
      });
      this.setState({
        schemas: schemaSaver,
        addedSchemas: trackAdded
      });
    }
  };

  addOrRemoveCallback = (addedSchemas) => {
    console.log(addedSchemas);
    this.setState({
      addedSchemas: addedSchemas
    });
  };

  handleRemoveSchema = (schemaId) => {
    console.log(schemaId);
    if (has(this.state.addedSchemas, schemaId) && this.state.addedSchemas[schemaId]) {
      let addedSchemaCopy = this.state.addedSchemas;
      delete addedSchemaCopy[schemaId];
      this.setState({
        addedSchemas: addedSchemaCopy
      });
    }
  };

  handleFormChange = (schemaState) => {
    console.log(schemaState);
  };

  render() {
    let showNullstate = Object.keys(this.state.addedSchemas).length ? false : true;
    return (
      <div className={styles.templatePage}>
        <TemplateList 
          templates={this.state.schemas} 
          initialTemplates={this.state.addedSchemas} 
          addedCallback={this.addOrRemoveCallback}
        />
        {
          !showNullstate &&
          <TemplateForms schemas={this.state.addedSchemas} removeSchemaCallback={this.handleRemoveSchema} returnDataCallback={this.handleFormChange} />
        }
        {
          showNullstate &&
          <ContentTemplatesNullstate />
        }
      </div>
    );
  };
}