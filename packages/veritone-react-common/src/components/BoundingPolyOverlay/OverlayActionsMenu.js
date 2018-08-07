import React from 'react';
// import {} from 'lodash';
import { number, bool, func, arrayOf, string, shape } from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import OverlayToolBar from './OverlayToolBar';

export default class OverlayActionsMenu extends React.PureComponent {
  static propTypes = {
    visible: bool,
    onMinimize: func,
    onDelete: func,
    onConfirm: func,
    menuItems: arrayOf(
      shape({
        label: string.isRequired,
        onClick: func.isRequired
      })
    ),
    bottomOffset: number,
    focusedBoundingBoxId: string
  };

  static defaultProps = {};

  render() {
    return (
      <OverlayToolBar
        visible={this.props.visible}
        onMinimize={this.props.onMinimize}
        menuItems={this.props.menuItems}
        bottomOffset={this.props.bottomOffset}
        focusedBoundingBoxId={this.props.focusedBoundingBoxId}
      >
        <IconButton onClick={this.props.onDelete}>
          <DeleteIcon />
        </IconButton>
        {this.props.onConfirm && (
          <IconButton onClick={this.props.onConfirm}>
            <CheckCircleIcon />
          </IconButton>
        )}
      </OverlayToolBar>
    );
  }
}
