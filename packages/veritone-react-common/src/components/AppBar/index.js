import React from 'react';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import {
  objectOf,
  any,
  string,
  bool,
  func,
  arrayOf,
  shape,
  number
} from 'prop-types';

import veritoneLogo from 'images/veritone-logo-white.svg';
import AppSwitcher from 'components/AppSwitcher';
import ProfileMenu from 'components/ProfileMenu';

import styles from './styles.scss';

export const appBarHeight = 60;
export default class AppBar extends React.Component {
  static propTypes = {
    title: string,
    backgroundColor: string,
    enabledApps: arrayOf(
      shape({
        name: string,
        permissionId: number,
        iconClass: string,
        displayName: string
      })
    ),
    currentAppName: string,
    profileMenu: bool,
    appSwitcher: bool,
    closeButton: bool,
    onClose: func,
    enabledAppsFailedLoading: bool,
    isFetchingApps: bool,
    logout: func,
    fetchEnabledApps: func,
    user: objectOf(any)
  };
  static defaultProps = {
    logout: () => {},
    fetchEnabledApps: () => {},
    backgroundColor: '#4caf50'
  };

  handleRefresh = () => {
    this.props.fetchEnabledApps();
  };

  render() {
    return (
      <Toolbar
        className={styles.appBar}
        style={{ height: appBarHeight, background: this.props.backgroundColor }}
      >
        <ToolbarGroup>
          <img src={veritoneLogo} className={styles['appBar--logo']} />
        </ToolbarGroup>
        <ToolbarGroup className={styles['appBar--title']}>
          {this.props.title}
        </ToolbarGroup>
        <ToolbarGroup style={{ width: 170 }}>
          {this.props.appSwitcher && (
            <AppSwitcher
              enabledAppsFailedLoading={this.props.enabledAppsFailedLoading}
              enabledApps={this.props.enabledApps}
              isFetchingApps={this.props.isFetchingApps}
              handleRefresh={this.handleRefresh}
              currentAppName={this.props.currentAppName}
            />
          )}
          {this.props.profileMenu && (
            <ProfileMenu onLogout={this.props.logout} user={this.props.user} />
          )}
          {this.props.closeButton && (
            <div style={{ marginLeft: 'auto' }}>
              <IconButton
                onClick={this.props.onClose}
                style={{ fontSize: 'inherit' }}
              >
                <CloseIcon color="white" />
              </IconButton>
            </div>
          )}
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
