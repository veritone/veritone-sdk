import React from 'react';
import { string, shape, objectOf, func, bool } from 'prop-types';
import cx from 'classnames';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import styles from './styles.scss';

export default class TemplateList extends React.Component {
  static propTypes = {
    templates: objectOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ).isRequired,
    addTemplate: func.isRequired,
    isReadOnly: bool
  };

  addTemplate = schemaId => () => {
    this.props.addTemplate(schemaId);
  };

  buildTemplateList = () => {
    const { templates } = this.props;

    return Object.keys(templates).map(schemaId => {
      return (
        <div className={styles.templateRow} key={schemaId}>
          <div className={cx(styles.name)}>{templates[schemaId].name}</div>
          {!this.props.isReadOnly ? (
            <IconButton
              className={styles.trashIcon}
              onClick={this.addTemplate(schemaId)}
              aria-label="add"
              disableRipple
            >
              <Icon className={'icon-zoom-in'} />
            </IconButton>
          ) : null}
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
