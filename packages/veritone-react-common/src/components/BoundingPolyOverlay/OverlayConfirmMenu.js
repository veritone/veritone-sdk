import React from 'react';
import { bool, string, func } from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Slide from '@material-ui/core/Slide';

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
    menuAnchorEl: null,
    temporarilyHidden: false
  };

  handleOpenMenu = event => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };

  handleCloseMenu = () => {
    // todo: cb
    this.setState({ menuAnchorEl: null });
  };

  render() {
    return (
      <Slide
        in={this.props.visible}
        direction="up"
      >
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'rgb(243, 243, 243, 0.87)',
            display: 'flex',
            justifyContent: 'flex-end',
            padding: 4,
            bottom: 0,
            width: '100%'
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <IconButton onClick={this.props.onMinimize}>
              <ArrowDownIcon />
            </IconButton>
          </div>
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

          <IconButton onClick={this.handleOpenMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={this.state.menuAnchorEl}
            open={Boolean(this.state.menuAnchorEl)}
            onClose={this.handleCloseMenu}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
          >
            {['Action 1', 'Action 2'].map(option => (
              <MenuItem key={option} onClick={this.handleCloseMenu}>
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </Slide>
    );
  }
}
