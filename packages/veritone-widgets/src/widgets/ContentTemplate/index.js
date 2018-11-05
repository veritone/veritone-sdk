import React from 'react';
import { reject } from 'lodash';
import { objectOf, arrayOf, any, func, bool, number } from 'prop-types';
import { ContentTemplate } from 'veritone-react-common';
import { guid } from '../../shared/util';

import widget from '../../shared/widget';

class ContentTemplateWidget extends React.Component {
  static propTypes = {
    templateData: objectOf(any).isRequired,
    initialTemplates: arrayOf(any),
    handleUpdateContentTemplates: func.isRequired,
    getFieldOptions: func,
    isReadOnly: bool,
    textInputMaxRows: number
  };

  static defaultProps = {
    initialTemplates: []
  };

  state = {
    contentTemplates: []
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillMount() {
    const newState = {
      contentTemplates: [...this.props.initialTemplates]
    };
    newState.contentTemplates.forEach(template => (template.guid = guid()));
    this.setState(newState);
  }

  addToTemplateList = templateSchemaId => {
    const { templateData } = this.props;
    const data = {};
    Object.keys(templateData[templateSchemaId].definition.properties).reduce(
      (fields, schemaDefProp) => {
        data[schemaDefProp] = data[schemaDefProp];
      },
      data
    );

    const newState = {
      contentTemplates: [
        {
          ...templateData[templateSchemaId],
          data,
          guid: guid()
        },
        ...this.state.contentTemplates
      ]
    };

    this.setState(newState, () => {
      this.props.handleUpdateContentTemplates(newState.contentTemplates);
    });
  };

  removeFromTemplateList = templateId => {
    if (
      this.state.contentTemplates.some(template => template.guid === templateId)
    ) {
      const newState = {
        contentTemplates: reject([...this.state.contentTemplates], {
          guid: templateId
        })
      };
      this.setState(newState, () => {
        this.props.handleUpdateContentTemplates(newState.contentTemplates);
      });
    }
  };

  onInputChange = (templateId, fieldId, value) => {
    if (
      this.state.contentTemplates.some(template => template.guid === templateId)
    ) {
      const newState = {
        contentTemplates: [...this.state.contentTemplates]
      };
      const templateIndex = newState.contentTemplates.findIndex(
        template => template.guid === templateId
      );
      newState.contentTemplates[templateIndex] = {
        ...newState.contentTemplates[templateIndex],
        data: {
          ...newState.contentTemplates[templateIndex].data,
          [fieldId]: value
        }
      };
      if (!value) {
        delete newState.contentTemplates[templateIndex].data[fieldId];
      }
      this.setState(newState, () => {
        this.props.handleUpdateContentTemplates(newState.contentTemplates);
      });
    }
  };

  render() {
    return (
      <ContentTemplate
        templateData={this.props.templateData}
        selectedTemplateSchemas={this.state.contentTemplates}
        onAddTemplate={this.addToTemplateList}
        onRemoveTemplate={this.removeFromTemplateList}
        onInputChange={this.onInputChange}
        getFieldOptions={this.props.getFieldOptions}
        isReadOnly={this.props.isReadOnly}
        textInputMaxRows={this.props.textInputMaxRows}
      />
    );
  }
}

export default widget(ContentTemplateWidget);
