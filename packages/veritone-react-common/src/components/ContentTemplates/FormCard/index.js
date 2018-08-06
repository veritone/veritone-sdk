import React from 'react';
import { any, arrayOf, func, string } from 'prop-types';

import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import styles from './styles.scss';

export default class FormCard extends React.Component {
  static propTypes = {
    fields: arrayOf(any), // take in an array of field elements, i.e. <TextField/>; styling of form elements is intended to be done by the parent
    name: string.isRequired,
    remove: func.isRequired,
    id: string.isRequired
  };

  handleClick = () => {
    this.props.remove(this.props.id);
  };

  render() {
    const { name, fields } = this.props;

    return (
      <div className={styles.formCard}>
        <div className={styles.name}>{name}</div>
        <IconButton
          className={styles.trashIcon}
          onClick={this.handleClick}
          aria-label="trash"
        >
          <Icon className={'icon-trash'} />
        </IconButton>
        {fields.map((field, index) => {
          return React.cloneElement(field, {
            key: `${name}-field-${index}`, // eslint-disable-line
            className: styles.formElements
          });
        })}
      </div>
    );
  }
}
