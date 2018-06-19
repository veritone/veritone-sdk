import React from 'react';
import { bool, string, func } from 'prop-types';
import Button from '@material-ui/core/Button';
import OverlayToolBar from './OverlayToolBar';

export default class OverlayConfirmMenu extends React.Component {
  static propTypes = {
    confirmLabel: string.isRequired,
    visible: bool,
    onConfirm: func.isRequired,
    onCancel: func.isRequired,
    onMinimize: func.isRequired
  };

  static defaultProps = {};

  state = {
    menuAnchorEl: null
  };


  render() {
    return (
      <OverlayToolBar
        visible={this.props.visible}
        onMinimize={this.props.onMinimize}
      >
        <Button
          size="small"
          color="default"
          onClick={this.props.onCancel}
          style={{ marginRight: 5 }}
        >
          Cancel
        </Button>
        <div
          style={{
            borderRight: '1px solid #E0E0E0'
          }}
        >
          {' '}
        </div>
        <Button
          size="small"
          color="primary"
          onClick={this.props.onConfirm}
          style={{ marginLeft: 5 }}
        >
          {this.props.confirmLabel}
        </Button>
      </OverlayToolBar>
    );
  }
}
