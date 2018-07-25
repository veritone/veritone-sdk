import React from 'react';
import { string, shape, objectOf, func } from 'prop-types';
import cx from 'classnames';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import styles from './styles.scss';

export default class TemplateList extends React.Component {
  static propTypes = {
    templates: objectOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
      })
    ).isRequired,
    selectedTemplates: objectOf( // an array of content template objects that had already been added to the source
      shape({
        id: string
      })
    ),
    addTemplate: func.isRequired,
    removeTemplate: func.isRequired
  };

  static defaultProps = {
    selectedTemplates: {}
  }

  addTemplate = schemaId => () => {
    this.props.addTemplate(schemaId);
  };

  removeTemplate = schemaId => () => {
    this.props.removeTemplate(schemaId);
  };

  buildTemplateList = () => {
    const { templates, selectedTemplates } = this.props;

    return Object.keys(templates).map((schemaId, index) => {
      const isAdded = !!selectedTemplates[schemaId];

      return (
        <div className={styles.templateRow} key={schemaId}>
          <div
            className={cx(styles.name, { [styles.addedTemplate]: isAdded })}
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
          Add more information to the files you ingest to help organize, search
          and filter quickly.
        </div>
        {this.buildTemplateList()}
      </div>
    );
  }
}
