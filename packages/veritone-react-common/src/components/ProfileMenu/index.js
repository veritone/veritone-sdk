import React from 'react';
import { get } from 'lodash';
import AccountIcon from 'material-ui-icons/AccountCircle';
import PowerIcon from 'material-ui-icons/PowerSettingsNew';
import Menu, { MenuItem } from 'material-ui/Menu';
import { ListItemIcon, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import ListSubheader from 'material-ui/List/ListSubheader';
import { string, func, shape } from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

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
    window.location =
      'https://enterprise.veritone.com/switch-app/default/edit-profile';
  };

  render() {
    return (
      <div>
        <IconButton
          // style={{ fontSize: 'inherit' }} // fixme: needed?
          className={this.props.className}
          onClick={this.openMenu}
        >
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
          <ListSubheader className={styles['header']}>
            <div className={styles['user-avatar']}>
              <Avatar
                src={get(
                  this.props.user,
                  'kvp.image',
                  '//static.veritone.com/veritone-ui/default-avatar-2.png'
                )}
              />
            </div>
            <div className={styles['user-profile']}>
              <div className={styles['full-name']}>
                {get(this.props.user, 'kvp.firstName')}&nbsp;
                {get(this.props.user, 'kvp.lastName')}
              </div>
              <div className={styles['username']}>
                {get(this.props.user, 'userName')}
              </div>
              <div className={styles['editButton']}>
                <Button raised color="primary" onClick={this.handleEditProfile}>
                  Edit Profile
                </Button>
              </div>
            </div>
          </ListSubheader>
          <MenuItem onClick={this.handleLogout}>
            <ListItemIcon>
              <PowerIcon />
            </ListItemIcon>
            <ListItemText primary="Log out" />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}
