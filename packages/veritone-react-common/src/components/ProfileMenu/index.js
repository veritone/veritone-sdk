import React from 'react';
import AccountIcon from 'material-ui-icons/AccountCircle';
import Menu from 'material-ui/es/Menu';
import IconButton from 'material-ui/es/IconButton';
import { string, func, shape } from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import InnerProfileMenu from './InnerProfileMenu';

@withMuiThemeProvider
export default class ProfileMenu extends React.Component {
  static propTypes = {
    className: string,
    onLogout: func.isRequired,
    user: shape({
      userName: string,
      kvp: shape({
        firstName: string,
        lastName: string,
        image: string
      })
    })
  };

  state = {
    open: false,
    anchorEl: null
  };

  openMenu = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({
      open: false
    });
  };

  handleLogout = () => {
    this.props.onLogout();
  };

  handleEditProfile = () => {
    // fixme: show edit profile modal
    window.location =
      'https://enterprise.veritone.com/switch-app/default/edit-profile';
  };

  render() {
    return (
      <div>
        <IconButton className={this.props.className} onClick={this.openMenu}>
          <AccountIcon color="white" />
        </IconButton>
        <Menu
          open={this.state.open}
          onRequestClose={this.closeMenu}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorEl={this.state.anchorEl}
          // https://github.com/callemall/material-ui/issues/7961#issuecomment-326215406
          getContentAnchorEl={null}
        >
          <InnerProfileMenu
            user={this.props.user}
            onLogout={this.handleLogout}
            onEditProfile={this.handleEditProfile}
          />
        </Menu>
      </div>
    );
  }
}
