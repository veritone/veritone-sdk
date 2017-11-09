import React from 'react';
import Paper from 'material-ui/Paper';
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
    onClose: func,
    enabledAppsFailedLoading: bool,
    isFetchingApps: bool,
    logout: func,
    fetchEnabledApps: func,
    user: objectOf(any)
  };
  static defaultProps = {
    logo: true,
    backgroundColor: '#4caf50',
    rightActions: [],
    elevation: 2,
    logout: () => {},
    fetchEnabledApps: () => {}
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
              <img src={veritoneLogo} className={styles['logo']} />
            </div>
          )}

          <div className={styles['title']}>{this.props.title}</div>

          <div className={styles['iconGroup']}>
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
              <div className={styles['iconGroup__icon']}>
                <AppSwitcher
                  enabledAppsFailedLoading={this.props.enabledAppsFailedLoading}
                  enabledApps={this.props.enabledApps}
                  isFetchingApps={this.props.isFetchingApps}
                  handleRefresh={this.handleRefresh}
                  currentAppName={this.props.currentAppName}
                />
              </div>
            )}

            {this.props.profileMenu && (
              <div className={styles['iconGroup__icon']}>
                <ProfileMenu
                  onLogout={this.props.logout}
                  user={this.props.user}
                />
              </div>
            )}

            {this.props.closeButton && (
              <div className={styles['iconGroup__icon']}>
                <div style={{ marginLeft: 'auto' }}>
                  <IconButton onClick={this.props.onClose}>
                    <CloseIcon color="white" />
                  </IconButton>
                </div>
              </div>
            )}
          </div>
        </div>.
      </Paper>
    );
  }
}
