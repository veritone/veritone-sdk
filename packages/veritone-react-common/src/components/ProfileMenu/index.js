import React from 'react';
import { get } from 'lodash';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import { string, func, shape } from 'prop-types';

import InnerProfileMenu from './InnerProfileMenu';

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

  static defaultProps = {
    user: {}
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
    const userProfileImage =
      this.props.user.signedImageUrl ||
      get(this.props.user, 'kvp.image') ||
      '//static.veritone.com/veritone-ui/default-avatar-2.png';

    return (
      <div>
        <IconButton className={this.props.className} onClick={this.openMenu}>
          <Avatar
            src={userProfileImage}
            style={{ height: 35, width: 35 }}
          />
        </IconButton>
        <Menu
          open={this.state.open}
          onClose={this.closeMenu}
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
