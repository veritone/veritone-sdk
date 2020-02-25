import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from 'helpers/withStyles';
import { func, string, number } from 'prop-types';

import styles from './styles/filtersList';

const classes = withStyles(styles);
class FiltersListItem extends React.Component {
  static propTypes = {
    id: string.isRequired,
    label: string.isRequired,
    number: number,
    onClearFilter: func.isRequired
  };
  static defaultProps = {};

  handleClear = e => {
    e.preventDefault();
    this.props.onClearFilter(this.props.id);
  };

  render() {
    return (
      <div className={classes.filterItem}>
        <IconButton
          classes={{ root: classes.clearButton }}
          onClick={this.handleClear}
        >
          <CloseIcon />
        </IconButton>
        <a
          href="#"
          className={classes.filterItemLink}
          onClick={this.handleClear}
        >
          {this.props.label} {this.props.number && `(${this.props.number})`}
        </a>
      </div>
    );
  }
}

export default FiltersListItem;