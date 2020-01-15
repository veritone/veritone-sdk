import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/styles';
import { func, string, number, shape, any } from 'prop-types';

import styles from './styles/filtersList';

class FiltersListItem extends React.Component {
  static propTypes = {
    id: string.isRequired,
    label: string.isRequired,
    number: number,
    onClearFilter: func.isRequired,
    classes: shape({ any }),
  };
  static defaultProps = {};

  handleClear = e => {
    e.preventDefault();
    this.props.onClearFilter(this.props.id);
  };

  render() {
    const { classes } = this.props;
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

export default withStyles(styles)(FiltersListItem);