import React from 'react';
import LibAppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

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
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

export const appBarHeight = 64;
@withMuiThemeProvider
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
      <LibAppBar
        className={styles.appBar}
        style={{ height: appBarHeight, background: this.props.backgroundColor }}
      >
        <Toolbar>
        <div>
          <img src={veritoneLogo} className={styles['appBar--logo']} />
        </div>
        <div className={styles['appBar--title']}>
          {this.props.title}
        </div>
        <div className={styles['appBar--iconGroup']}>
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
        </div>
        </Toolbar>
      </LibAppBar>
    );
  }
}
