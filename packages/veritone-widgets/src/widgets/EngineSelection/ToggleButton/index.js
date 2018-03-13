import React from 'react';
import { func, bool, string } from 'prop-types';
import cx from 'classnames';

import Button from 'material-ui/Button';
import ClearIcon from 'material-ui-icons/Clear';

import styles from './styles.scss';

export default class ToggleButton extends React.Component {
  static propTypes = {
    onAdd: func.isRequired,
    onRemove: func.isRequired,
    engineId: string.isRequired,
    isSelected: bool.isRequired
  };

  handleOnAdd = () => this.props.onAdd([this.props.engineId]);

  handleOnRemove = () => this.props.onRemove([this.props.engineId]);

  render() {
    const buttonClasses = cx(styles.default, {
      [styles.remove]: this.props.isSelected
    });

    return (
      <Button
        className={buttonClasses}
        raised={!this.props.isSelected}
        color={this.props.isSelected ? 'default' : 'primary'}
        onClick={this.props.isSelected ? this.handleOnRemove : this.handleOnAdd}
      >
        <ClearIcon style={{ marginRight: '5px' }} />
        {this.props.isSelected ? 'Remove' : 'Add Engine'}
      </Button>
    );
  }
}
