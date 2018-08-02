import React from 'react';
import { string, shape, objectOf, any, func } from 'prop-types';

import TemplateForms from './TemplateForms';
import TemplateList from './TemplateList';
import ContentTemplatesNullState from './NullState';
import styles from './styles.scss';

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
    onAddTemplate: func.isRequired,
    onRemoveTemplate: func.isRequired,
    onInputChange: func.isRequired
  };
  static defaultProps = {
    selectedTemplateSchemas: {}
  };

  render() {
    const { selectedTemplateSchemas } = this.props;
    const showNullstate = !Object.keys(selectedTemplateSchemas).length;

    return (
      <div className={styles.templatePage}>
        <div className={styles['template-list-container']}>
          <TemplateList
            templates={this.props.templateData}
            selectedTemplates={selectedTemplateSchemas}
            addTemplate={this.props.onAddTemplate}
            removeTemplate={this.props.onRemoveTemplate}
          />
        </div>
        <div className={styles['content-templates']}>
          {showNullstate ? (
            <ContentTemplatesNullState />
          ) : (
              <TemplateForms
                templates={selectedTemplateSchemas}
                onRemoveTemplate={this.props.onRemoveTemplate}
                onTemplateDetailsChange={this.props.onInputChange}
              />
            )}
        </div>
      </div>
    );
  }
}
