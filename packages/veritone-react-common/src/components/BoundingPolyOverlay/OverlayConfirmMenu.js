import React from 'react';
import { number, bool, string, func } from 'prop-types';
import Button from '@material-ui/core/Button';
import OverlayToolBar from './OverlayToolBar';

export default class OverlayConfirmMenu extends React.Component {
  static propTypes = {
    confirmLabel: string.isRequired,
    visible: bool,
    onConfirm: func.isRequired,
    onCancel: func.isRequired,
    onMinimize: func.isRequired,
    bottomOffset: number
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
        bottomOffset={this.props.bottomOffset}
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
