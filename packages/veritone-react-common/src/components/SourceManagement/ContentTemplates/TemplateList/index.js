import React from 'react';
import { any, objectOf, func } from 'prop-types';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import styles from './styles.scss';

export default class TemplateList extends React.Component {
  static propTypes = {
    templates: objectOf(any).isRequired,
    selectedTemplates: objectOf(any), // an array of content template objects that had already been added to the source
    addOrRemoveTemplate: func.isRequired
  };

  addTemplate = schemaId => () => {
    this.props.addOrRemoveTemplate(schemaId);
  };

  removeTemplate = schemaId => () => {
    this.props.addOrRemoveTemplate(schemaId, true);
  };

  buildTemplateList = () => {
    const { templates, selectedTemplates } = this.props;

    return Object.keys(templates).map((schemaId, index) => {
      const isAdded = !!selectedTemplates[schemaId];

      return (
        <div className={styles.templateRow} key={schemaId}>
          <div
            className={styles.name}
            style={isAdded ? { fontWeight: 500 } : undefined}
          >
            {templates[schemaId].name}
          </div>
          {isAdded ? (
            <IconButton
              className={styles.trashIcon}
              onClick={this.removeTemplate(schemaId)}
              aria-label="trash"
              disableRipple
            >
              <Icon className={'icon-trash'} />
            </IconButton>
          ) : (
            <IconButton
              className={styles.trashIcon}
              onClick={this.addTemplate(schemaId)}
              aria-label="add"
              disableRipple
            >
              <Icon className={'icon-zoom-in'} />
            </IconButton>
          )}
        </div>
      );
    });
  };

  render() {
    return (
      <div className={styles['template-list']}>
        <div className={styles.title}>Content Templates</div>
        <div className={styles.description}>
          Add more information to the files you ingest to help organize, search and filter quickly.
        </div>
        {this.buildTemplateList()}
      </div>
    );
  }
}
