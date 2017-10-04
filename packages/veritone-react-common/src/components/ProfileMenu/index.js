import React from 'react';
import { get } from 'lodash';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import { darkBlack } from 'material-ui/styles/colors';
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
    menuOpen: false
  };

  handleOnRequestChange = value => {
    this.setState({
      menuOpen: value
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
    const menuItemStyle = { padding: '0px 16px 0px 56px', color: darkBlack };

    return (
      <IconMenu
        className={this.props.className}
        iconButtonElement={
          <IconButton style={{ fontSize: 'inherit' }}>
            <AccountIcon color="white"/>
          </IconButton>
        }
        open={this.state.menuOpen}
        onRequestChange={this.handleOnRequestChange}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Subheader>
          <div className={styles['header']}>
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
                <RaisedButton
                  primary
                  label="Edit Profile"
                  onClick={this.handleEditProfile}
                />
              </div>
            </div>
          </div>
        </Subheader>
        <MenuItem
          primaryText="Log out"
          onClick={this.handleLogout}
          leftIcon={<PowerIcon/>}
          innerDivStyle={menuItemStyle}
        />
      </IconMenu>
    );
  }
}
