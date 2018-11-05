import React from 'react';
import {
  string,
  shape,
  objectOf,
  any,
  func,
  arrayOf,
  number
} from 'prop-types';
import Button from '@material-ui/core/Button';
import { reject, cloneDeep } from 'lodash';
import ContentTemplates from 'components/ContentTemplates';
import { guid } from 'helpers/guid';

import styles from './styles.scss';

export default class ContentTemplateForm extends React.Component {
  static propTypes = {
    templateData: objectOf(
      shape({
        id: string,
        name: string.isRequired,
        status: string,
        definition: objectOf(any)
      })
    ).isRequired,
    initialTemplates: arrayOf(
      shape({
        id: string,
        name: string.isRequired,
        status: string,
        definition: objectOf(any),
        data: objectOf(any)
      })
    ),
    getFieldOptions: func,
    onSubmit: func.isRequired,
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
        data[schemaDefProp] = data[schemaDefProp] || '';
      },
      data
    );
    this.setState(prevState => ({
      contentTemplates: [
        {
          ...templateData[templateSchemaId],
          data,
          guid: guid()
        },
        ...prevState.contentTemplates
      ]
    }));
  };

  removeFromTemplateList = templateId => {
    return this.setState(prevState => {
      return {
        contentTemplates: reject([...prevState.contentTemplates], {
          guid: templateId
        })
      };
    });
  };

  updateTemplateDetails = (templateId, fieldId, value) => {
    this.setState(prevState => {
      if (
        prevState.contentTemplates.some(
          template => template.guid === templateId
        )
      ) {
        const contentTemplates = [...prevState.contentTemplates];
        const templateIndex = contentTemplates.findIndex(
          template => template.guid === templateId
        );
        contentTemplates[templateIndex] = {
          ...contentTemplates[templateIndex],
          data: {
            ...contentTemplates[templateIndex].data,
            [fieldId]: value
          }
        };
        return { contentTemplates };
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const resultTemplates = cloneDeep(this.state.contentTemplates);
    resultTemplates.forEach(template => delete template.guid);
    return this.props.onSubmit({
      contentTemplates: resultTemplates
    });
  };

  render() {
    return (
      <form
        className={styles['form-content-templates']}
        onSubmit={this.handleSubmit}
      >
        <ContentTemplates
          templateData={this.props.templateData}
          selectedTemplateSchemas={this.state.contentTemplates}
          onAddTemplate={this.addToTemplateList}
          onRemoveTemplate={this.removeFromTemplateList}
          onInputChange={this.updateTemplateDetails}
          getFieldOptions={this.props.getFieldOptions}
          textInputMaxRows={this.props.textInputMaxRows}
        />
        <div className={styles['btn-container']}>
          <Button variant="raised" color="primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    );
  }
}
