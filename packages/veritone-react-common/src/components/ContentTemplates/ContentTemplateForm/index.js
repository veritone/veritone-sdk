import React from 'react';
import { string, shape, objectOf, any, func } from 'prop-types';
import Button from '@material-ui/core/Button';
import { get } from 'lodash';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import ContentTemplates from 'components/ContentTemplates';

import styles from './styles.scss';

@withMuiThemeProvider
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
    initialTemplates: objectOf(
      shape({
        id: string,
        name: string.isRequired,
        status: string,
        definition: objectOf(any),
        data: objectOf(any)
      })
    ),
    onSubmit: func.isRequired
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
        data[schemaDefProp] = get(
          initialTemplates,
          [templateSchemaId, 'data', schemaDefProp],
          ''
        );
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
  };

  removeFromTemplateList = templateSchemaId => {
    if (this.state.contentTemplates[templateSchemaId]) {
      return this.setState(prevState => {
        const contentTemplates = { ...prevState.contentTemplates };
        delete contentTemplates[templateSchemaId];

        return { contentTemplates };
      });
    }
  };

  updateTemplateDetails = (templateSchemaId, fieldId, value) => {
    this.setState(prevState => ({
      contentTemplates: {
        ...prevState.contentTemplates,
        [templateSchemaId]: {
          ...prevState.contentTemplates[templateSchemaId],
          data: {
            ...prevState.contentTemplates[templateSchemaId].data,
            [fieldId]: value
          }
        }
      }
    }));
  };

  handleSubmit = e => {
    e.preventDefault();
    return this.props.onSubmit({
      contentTemplates: this.state.contentTemplates
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
