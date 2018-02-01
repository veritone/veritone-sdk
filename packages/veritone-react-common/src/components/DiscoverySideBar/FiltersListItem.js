import React from 'react';
import CloseIcon from 'material-ui-icons/Close';
import IconButton from 'material-ui/es/IconButton';
import { func, string, number } from 'prop-types';

import styles from './styles/filtersList.scss';

export default class FiltersListItem extends React.Component {
  static propTypes = {
    id: string.isRequired,
    label: string.isRequired,
    number: number.isRequired,
    onClearFilter: func.isRequired
  };
  static defaultProps = {};

  handleClear = e => {
    e.preventDefault();
    this.props.onClearFilter(this.props.id);
  };

  render() {
    return (
      <div className={styles.filterItem}>
        <IconButton
          classes={{ root: styles.clearButton }}
          onClick={this.handleClear}
        >
          <CloseIcon />
        </IconButton>
        <a
          href="#"
          className={styles.filterItemLink}
          onClick={this.handleClear}
        >
          {this.props.label} ({this.props.number})
        </a>
      </div>
    );
  }
}
