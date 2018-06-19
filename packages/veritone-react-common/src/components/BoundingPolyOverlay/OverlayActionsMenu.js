import React from 'react';
// import {} from 'lodash';
import { bool, func, arrayOf, string, shape } from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import OverlayToolBar from './OverlayToolBar';

export default class OverlayActionsMenu extends React.Component {
  static propTypes = {
    visible: bool,
    onMinimize: func,
    onDelete: func,
    menuItems: arrayOf(
      shape({
        label: string.isRequired,
        onClick: func.isRequired
      })
    )
  };

  static defaultProps = {};

  render() {
    return (
      <OverlayToolBar
        visible={this.props.visible}
        onMinimize={this.props.onMinimize}
        menuItems={this.props.menuItems}
      >
        <IconButton onClick={this.props.onDelete}>
          <DeleteIcon />
        </IconButton>
      </OverlayToolBar>
    );
  }
}
