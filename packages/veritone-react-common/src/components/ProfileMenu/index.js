import React from 'react';
import { get } from 'lodash';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import {
  string,
  func,
  shape,
  arrayOf,
  bool,
  element,
  any,
  number
} from 'prop-types';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';

import InnerProfileMenu from './InnerProfileMenu';
import styles from './styles';

class ProfileMenu extends React.Component {
  static propTypes = {
    className: string,
    onLogout: func.isRequired,
    onEditProfile: func,
    user: shape({
      userName: string,
      kvp: shape({
        firstName: string,
        lastName: string,
        image: string
      }),
      organization: shape({
        organizationId: number
      })
    }),
    enabledApps: arrayOf(
      shape({
        name: string,
        permissionId: number,
        iconClass: string,
        displayName: string
      })
    ),
    isDiscovery: bool,
    tooltipTitle: string,
    additionMenuItems: arrayOf(element),
    classes: shape({ any })
  };

  static defaultProps = {
    user: {},
    tooltipTitle: 'Profile'
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

  render() {
    const userExists = !!Object.keys(this.props.user).length;
    let userProfileImage;
    let userInitials;
    if (!userExists) {
      userProfileImage =
        '//static.veritone.com/veritone-ui/default-avatar-2.png';
    } else {
      userInitials =
        get(this.props.user, 'kvp.firstName')
          .slice(0, 1)
          .toUpperCase() +
        get(this.props.user, 'kvp.lastName')
          .slice(0, 1)
          .toUpperCase();
      userProfileImage =
        this.props.user.signedImageUrl || get(this.props.user, 'kvp.image');
      if (!userInitials && !userProfileImage) {
        userProfileImage =
          '//static.veritone.com/veritone-ui/default-avatar-2.png';
      }
    }

    const { classes } = this.props;

    return (
      <div>
        <Tooltip title={this.props.tooltipTitle || ''} disableFocusListener>
          <IconButton
            className={classNames(this.props.className, classes.center)}
            onClick={this.openMenu}
            data-veritone-element="profile-menu-button"
          >
            {userProfileImage ? (
              <Avatar
                style={{ height: 35, width: 35 }}
                src={userProfileImage}
              />
            ) : (
              <Avatar className={classes.avatarProfile}>{userInitials}</Avatar>
            )}
          </IconButton>
        </Tooltip>
        <Menu
          disableEnforceFocus
          open={this.state.open}
          onClose={this.closeMenu}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorEl={this.state.anchorEl}
          elevation={0}
          classes={{ paper: classes.paper }}
          // https://github.com/callemall/material-ui/issues/7961#issuecomment-326215406
          getContentAnchorEl={null}
          className={classes.popover}
        >
          <InnerProfileMenu
            user={this.props.user}
            isDiscovery={this.props.isDiscovery}
            enabledApps={this.props.enabledApps}
            onLogout={this.handleLogout}
            onEditProfile={this.props.onEditProfile}
            additionMenuItems={this.props.additionMenuItems}
          />
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(ProfileMenu);
