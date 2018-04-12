import React from 'react';
import { string, shape, objectOf, any, func } from 'prop-types';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import TemplateForms from './TemplateForms';
import TemplateList from './TemplateList';
import ContentTemplatesNullstate from './Nullstate';
import styles from './styles.scss';

@withMuiThemeProvider
export default class ContentTemplates extends React.Component {
  static propTypes = {
    templateData: objectOf(
      shape({
        id: string,
        name: string.isRequired,
        status: string,
        definition: objectOf(any)
      })
    ).isRequired,
    selectedTemplateSchemas: objectOf(
      shape({
        id: string,
        name: string.isRequired,
        status: string,
        definition: objectOf(any),
        data: objectOf(any)
      })
    ),
    onListChange: func.isRequired,
    onInputChange: func.isRequired
  };
  static defaultProps = {
    templateData: {},
    selectedTemplateSchemas: {}
  };

  render() {
    console.log('this.props:', this.props);
    const { selectedTemplateSchemas } = this.props;
    const showNullstate = !Object.keys(selectedTemplateSchemas).length;

    return (
      <div className={styles.templatePage}>
        <TemplateList
          templates={this.props.templateData}
          selectedTemplates={selectedTemplateSchemas}
          addOrRemoveTemplate={this.props.onListChange}
        />
        <div className={styles['content-templates']}>
          {showNullstate ? (
            <ContentTemplatesNullstate />
          ) : (
            <TemplateForms
              templates={selectedTemplateSchemas}
              onRemoveTemplate={this.props.onListChange}
              onTemplateDetailsChange={this.props.onInputChange}
            />
          )}
        </div>
      </div>
    );
  }
}
