import React from 'react';
import { string, node } from 'prop-types';

import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import ClearIcon from 'material-ui-icons/Clear';

import styles from './styles.scss';

export default class ToggleButton extends React.Component {
  static propTypes = {
  };

  handleOnAdd = () => this.props.onAdd(this.props.engineId);

  handleOnRemove = () => this.props.onRemove(this.props.engineId);

  _renderAddButton = () => (
    <Button style={{ backgroundColor: '#2196f3', borderRadius: '4px', padding: '8px 13px' }} raised color="primary" onClick={this.handleOnAdd}>
      <AddIcon style={{ marginRight: '5px' }}/>
      Add Engine
    </Button>
  )

  _renderRemoveButton = () => (
    <Button style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '8px 13px', border: '1px solid rgba(0,0,0,0.26)', minWidth: '137px' }} onClick={this.handleOnRemove}>
      <ClearIcon style={{ marginRight: '5px' }}/>
      Remove
    </Button>
  )

  render() {
    return (
      this.props.isSelected ? this._renderRemoveButton() : this._renderAddButton()
    )
  }
}
