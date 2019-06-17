import React from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import {
  objectOf,
  any,
  string,
  bool,
  func,
  arrayOf,
  shape,
  number,
  element
} from 'prop-types';

import veritoneLogo from 'images/veritone-logo-white.svg';
import AppSwitcher from 'components/AppSwitcher';
import ProfileMenu from 'components/ProfileMenu';
import Notifier, { notifierPropTypes } from 'components/Notifier';

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
    rightActions: arrayOf(
      shape({
        label: string.isRequired,
        onClick: func
      })
    ),
    elevation: number,
    profileMenu: bool,
    appSwitcher: bool,
    closeButton: bool,
    logo: bool,
    logoSrc: string,
    onClose: func,
    enabledAppsFailedLoading: bool,
    isFetchingApps: bool,
    onLogout: func,
    onEditProfile: func,
    fetchEnabledApps: func,
    user: objectOf(any),
    onSwitchApp: func,
    additionMenuItems: arrayOf(element),
    notification: notifierPropTypes
  };
  static defaultProps = {
    logo: true,
    logoSrc: veritoneLogo,
    backgroundColor: '#4caf50',
    rightActions: [],
    elevation: 2,
    onLogout: () => {},
    onEditProfile: () => {},
    fetchEnabledApps: () => {},
    onSwitchApp: () => {}
  };

  handleRefresh = () => {
    this.props.fetchEnabledApps();
  };

  render() {
    return (
      <Paper
        component="header"
        square
        elevation={this.props.elevation}
        className={styles.appBar}
        style={{ height: appBarHeight, background: this.props.backgroundColor }}
      >
        <div className={styles.container}>
          {this.props.logo && (
            <div>
              <img src={this.props.logoSrc} className={styles['logo']} />
            </div>
          )}

          <div className={styles['title']}>{this.props.title}</div>

          <div className={styles['iconGroup']}>
            {this.props.notification && (
              <div>
                <Notifier {...this.props.notification} />
              </div>
            )}

            {this.props.rightActions.map(({ label, onClick }) => (
              <div className={styles['iconGroup__icon']} key={label}>
                <a
                  href="#"
                  onClick={onClick}
                  className={styles['rightAction-label']}
                >
                  {label}
                </a>
              </div>
            ))}
            
            {this.props.appSwitcher && (
              <div>
                <AppSwitcher
                  enabledAppsFailedLoading={this.props.enabledAppsFailedLoading}
                  enabledApps={this.props.enabledApps}
                  isFetchingApps={this.props.isFetchingApps}
                  handleRefresh={this.handleRefresh}
                  currentAppName={this.props.currentAppName}
                  onSwitchApp={this.props.onSwitchApp}
                />
              </div>
            )}

            {this.props.profileMenu && (
              <div className={styles['iconGroup__icon']}>
                <ProfileMenu
                  onLogout={this.props.onLogout}
                  onEditProfile={this.props.onEditProfile}
                  user={this.props.user}
                  additionMenuItems={this.props.additionMenuItems}
                />
              </div>
            )}

            {this.props.closeButton && (
              <div>
                <div style={{ marginLeft: 'auto' }}>
                  <IconButton onClick={this.props.onClose}>
                    <CloseIcon nativeColor="white" />
                  </IconButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </Paper>
    );
  }
}
