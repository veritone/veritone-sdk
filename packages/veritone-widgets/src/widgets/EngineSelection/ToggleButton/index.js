import React from 'react';
import { func, bool, string, shape, any } from 'prop-types';
import cx from 'classnames';

import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import { withStyles } from '@material-ui/styles';

import styles from './styles';
class ToggleButton extends React.Component {
  static propTypes = {
    id: string.isRequired,
    onAdd: func.isRequired,
    onRemove: func.isRequired,
    engineId: string.isRequired,
    isSelected: bool.isRequired,
    classes: shape({any}),
  };

  handleAdd = () => this.props.onAdd(this.props.id, [this.props.engineId]);

  handleRemove = () =>
    this.props.onRemove(this.props.id, [this.props.engineId]);

  render() {
    const { classes } = this.props;
    const buttonClasses = cx(classes.default, {
      [classes.remove]: this.props.isSelected
    });

    return (
      <Button
        className={buttonClasses}
        variant={this.props.isSelected ? 'text' : 'contained'}
        color={this.props.isSelected ? 'default' : 'primary'}
        onClick={this.props.isSelected ? this.handleRemove : this.handleAdd}
      >
        <ClearIcon className={classes.icon} />
        {this.props.isSelected ? 'Remove' : 'Add Engine'}
      </Button>
    );
  }
}

export default withStyles(styles)(ToggleButton);
