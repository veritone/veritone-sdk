import React from 'react';
import { get } from 'lodash';
import { objectOf, any, func } from 'prop-types';
import { ContentTemplate } from 'veritone-react-common';

import widget from '../../shared/widget';

class ContentTemplateWidget extends React.Component {
  static propTypes = {
    templateData: objectOf(any).isRequired,
    initialTemplates: objectOf(any),
    handleUpdateContentTemplates: func.isRequired
  };

  static defaultProps = {
    initialTemplates: {}
  };

  state = {
    contentTemplates: {}
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillMount() {
    const newState = {
      contentTemplates: { ...this.props.initialTemplates }
    };

    this.setState(newState);
  }

  addToTemplateList = templateSchemaId => {
    const { templateData, initialTemplates } = this.props;
    const data = {};

    Object.keys(templateData[templateSchemaId].definition.properties).reduce(
      (fields, schemaDefProp) => {
        const value = get(initialTemplates, [
          templateSchemaId,
          'data',
          schemaDefProp
        ]);
        if (value) {
          data[schemaDefProp] = value;
        }
      },
      data
    );

    const newState = {
      contentTemplates: {
        ...this.state.contentTemplates,
        [templateSchemaId]: {
          ...templateData[templateSchemaId],
          data
        }
      }
    };

    this.setState(newState, () => {
      this.props.handleUpdateContentTemplates(newState.contentTemplates);
    });
  };

  removeFromTemplateList = templateSchemaId => {
    if (this.state.contentTemplates[templateSchemaId]) {
      const contentTemplates = { ...this.state.contentTemplates };
      delete contentTemplates[templateSchemaId];

      const newState = { contentTemplates };

      this.setState(newState, () => {
        this.props.handleUpdateContentTemplates(newState.contentTemplates);
      });
    }
  };

  onInputChange = (templateSchemaId, fieldId, value) => {
    let newState;
    const { contentTemplates } = this.state;

    this.setState(
      prevState => {
        newState = {
          contentTemplates: {
            ...contentTemplates,
            [templateSchemaId]: {
              ...contentTemplates[templateSchemaId],
              data: {
                ...contentTemplates[templateSchemaId].data
              }
            }
          }
        };

        if (value) {
          newState.contentTemplates[templateSchemaId].data[fieldId] = value;
        } else {
          delete newState.contentTemplates[templateSchemaId].data[fieldId];
        }

        return newState;
      },
      () => {
        this.props.handleUpdateContentTemplates(newState.contentTemplates);
      }
    );
  };

  render() {
    return (
      <ContentTemplate
        templateData={this.props.templateData}
        selectedTemplateSchemas={this.state.contentTemplates}
        onAddTemplate={this.addToTemplateList}
        onRemoveTemplate={this.removeFromTemplateList}
        onInputChange={this.onInputChange}
      />
    );
  }
}

export default widget(ContentTemplateWidget);
