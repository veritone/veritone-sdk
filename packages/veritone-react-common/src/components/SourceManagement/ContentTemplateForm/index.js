import React from 'react';
import { string, shape, objectOf, any, func } from 'prop-types';
import Button from 'material-ui/Button';
import ContentTemplates from '../ContentTemplates'

import styles from '../styles.scss';

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
    onSubmit: func.isRequired
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

      this.setState({
        contentTemplates: {
          ...this.state.contentTemplates,
          [templateSchemaId]: {
            ...templateData[templateSchemaId],
            data
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
      contentTemplates: this.state.contentTemplates
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <ContentTemplates
          templateData={this.props.templateData}
          selectedTemplateSchemas={this.state.contentTemplates}
          onListChange={this.manageTemplatesList}
          onInputChange={this.updateTemplateDetails}
        />
        <div className={styles.btnContainer}>
          <Button variant="raised" color='primary' type="submit">
            Save
          </Button>
        </div>
      </form>
    );
  }
}
