import React from 'react';
import { string, shape, objectOf, any, func } from 'prop-types';
import ContentTemplates from '../ContentTemplates'

export default class ContentTemplateForm extends React.Component {
  static propTypes = {
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
    handleUpdateContentTemplates: func.isRequired
  }

  static defaultProps = {
    templateData: {},
    initialTemplates: {}
  }

  state = {
    contentTemplates: {}
  }

  componentWillMount() {
    const newState = {
      contentTemplates: { ...this.props.initialTemplates }
    };

    this.setState(newState);
  }

  manageTemplatesList = (templateSchemaId, remove = false) => {
    const { templateData, initialTemplates } = this.props;
    let newState;
    if (remove) {
      if (this.state.contentTemplates[templateSchemaId]) {
        const contentTemplates = { ...this.state.contentTemplates };
        delete contentTemplates[templateSchemaId];
        newState = { contentTemplates };
        return this.setState(newState);
      }
    } else {
      const data = {};
      Object.keys(templateData[templateSchemaId].definition.properties)
        .reduce((fields, schemaDefProp) => {
          data[schemaDefProp] = (initialTemplates[templateSchemaId] && initialTemplates[templateSchemaId].data)
            ? initialTemplates[templateSchemaId].data[schemaDefProp]
            : '';
        }, data)
      newState = {
        contentTemplates: {
          ...this.state.contentTemplates,
          [templateSchemaId]: {
            ...templateData[templateSchemaId],
            data
          }
        }
      };
      this.setState(newState);
    }
    if (newState) {
      this.props.handleUpdateContentTemplates(newState.contentTemplates);
    }
  }

  updateTemplateDetails = (templateSchemaId, fieldId, value) => {
    const { contentTemplates } = this.state;
    let newState = {
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
    };
    this.setState(newState);
    this.props.handleUpdateContentTemplates(newState.contentTemplates);
  };

  render() {
    return (
      <form>
        <ContentTemplates
          templateData={this.props.templateData}
          selectedTemplateSchemas={this.state.contentTemplates}
          onListChange={this.manageTemplatesList}
          onInputChange={this.updateTemplateDetails}
        />
      </form>
    );
  }
}