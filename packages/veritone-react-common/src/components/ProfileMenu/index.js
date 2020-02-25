import React from 'react';
import { get } from 'lodash';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { string, func, shape, arrayOf, element } from 'prop-types';
import { withStyles } from 'helpers/withStyles';
import classNames from 'classnames';

import InnerProfileMenu from './InnerProfileMenu';
import styles from './styles';

const classes = withStyles(styles);
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
      })
    }),
    tooltipTitle: string,
    additionMenuItems: arrayOf(element)
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
    const userProfileImage =
      this.props.user.signedImageUrl ||
      get(this.props.user, 'kvp.image') ||
      '//static.veritone.com/veritone-ui/default-avatar-2.png';

    return (
      <div>
        <Tooltip title={this.props.tooltipTitle || ''} disableFocusListener>
          <IconButton
            className={classNames(this.props.className, classes.center)}
            onClick={this.openMenu}
            data-veritone-element="profile-menu-button"
          >
            <Avatar src={userProfileImage} style={{ height: 35, width: 35 }} />
          </IconButton>
        </Tooltip>
        <Menu
          disableEnforceFocus
          open={this.state.open}
          onClose={this.closeMenu}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorEl={this.state.anchorEl}
          // https://github.com/callemall/material-ui/issues/7961#issuecomment-326215406
          getContentAnchorEl={null}
          className={classes.popover}
        >
          <InnerProfileMenu
            user={this.props.user}
            onLogout={this.handleLogout}
            onEditProfile={this.props.onEditProfile}
            additionMenuItems={this.props.additionMenuItems}
          />
        </Menu>
      </div>
    );
  }
}

export default ProfileMenu;
