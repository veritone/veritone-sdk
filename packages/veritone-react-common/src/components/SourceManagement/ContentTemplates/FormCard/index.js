import React from 'react';
import {
  any, 
  arrayOf,
  func,
  string
} from 'prop-types';

import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import styles from './styles.scss';

export default class FormCard extends React.Component {
  // take in a number of form components and populate them
  static propTypes = {
    fields: arrayOf(any), // take in an array of field elements, i.e. <TextField/>; styling of form elements is intended to be done by the parent
    name: string.isRequired,
    remove: func.isRequired,
    id: string.isRequired
  };

  handleClick = () => {
    this.props.remove(this.props.id);
  };

  renderFields = () => {
    return this.props.fields.map((field, index) => {
      return React.cloneElement(field, {
        key: index,
        className: styles.formElements
      });
    });
  };

  render() {
    return (
      <div className={styles.formCard}>
        <div className={styles.name}>
          {this.props.name}
        </div>
        <IconButton
          className={styles.trashIcon}
          onClick={this.handleClick}
          aria-label='trash'
        >
          <Icon className={'icon-trash'} />
        </IconButton>
        <form>
          {this.renderFields()}
        </form>
      </div>
    );
  };
}