import React from 'react';
import { func, bool, string } from 'prop-types';
import cx from 'classnames';

import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';

import styles from './styles.scss';

export default class ToggleButton extends React.Component {
  static propTypes = {
    id: string.isRequired,
    onAdd: func.isRequired,
    onRemove: func.isRequired,
    engineId: string.isRequired,
    isSelected: bool.isRequired
  };

  handleAdd = () => this.props.onAdd(this.props.id, [this.props.engineId]);

  handleRemove = () =>
    this.props.onRemove(this.props.id, [this.props.engineId]);

  render() {
    const buttonClasses = cx(styles.default, {
      [styles.remove]: this.props.isSelected
    });

    return (
      <Button
        className={buttonClasses}
        variant={this.props.isSelected ? 'text' : 'contained'}
        color={this.props.isSelected ? 'default' : 'primary'}
        onClick={this.props.isSelected ? this.handleRemove : this.handleAdd}
      >
        <ClearIcon style={{ marginRight: '5px' }} />
        {this.props.isSelected ? 'Remove' : 'Add Engine'}
      </Button>
    );
  }
}
