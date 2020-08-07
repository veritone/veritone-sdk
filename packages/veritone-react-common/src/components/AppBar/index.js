import React from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';

import {
  objectOf,
  any,
  string,
  bool,
  func,
  arrayOf,
  shape,
  number,
  element,
  oneOfType,
  oneOf
} from 'prop-types';

import AppSwitcher from 'components/AppSwitcher';
import ProfileMenu from 'components/ProfileMenu';
import Notifier, { notifierPropTypes } from 'components/Notifier';
import Help, { helpPropTypes } from 'components/Help';

import SmallVeritoneLogo from 'images/header-veritone-icon.svg';
import styles from './styles';

export const appBarHeight = 60;
export const defaultAppBarZIndex = 1000;

class AppBar extends React.Component {
  static propTypes = {
    title: string,
    titleColor: string,
    backgroundColor: string,
    logoBackgroundColor: string,
    enabledApps: arrayOf(
      shape({
        name: string,
        permissionId: number,
        iconClass: string,
        displayName: string
      })
    ),
    currentAppName: string,
    isDiscovery: bool,
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
    appLogoSrc: string,
    onClose: func,
    enabledAppsFailedLoading: bool,
    isFetchingApps: bool,
    onLogout: func,
    onEditProfile: func,
    fetchEnabledApps: func,
    user: objectOf(any),
    onSwitchApp: func,
    additionMenuItems: arrayOf(element),
    help: shape(helpPropTypes),
    notification: shape(notifierPropTypes),
    searchBar: oneOfType([bool, element]),
    searchBarJustification: oneOf(['flex-start', 'center', 'flex-end']),
    searchBarLeftMargin: oneOfType([string, number]),
    searchBarAlignSelf: oneOf([
      'baseline',
      'auto',
      'inherit',
      'center',
      'flex-start',
      'flex-end'
    ]),
    zIndex: number,
    totalNotification: number,
    showNotifications: func,
    hideNotification: func,
    classes: shape({ any })
  };
  static defaultProps = {
    logo: true,
    logoSrc: SmallVeritoneLogo,
    titleColor: '#FFFFFF',
    backgroundColor: '#325491',
    logoBackgroundColor: 'rgba(0,0,0,0.2)',
    rightActions: [],
    elevation: 2,
    onLogout: () => {},
    onEditProfile: () => {},
    fetchEnabledApps: () => {},
    onSwitchApp: () => {},
    searchBarJustification: 'center',
    searchBarLeftMargin: 0,
    zIndex: defaultAppBarZIndex,
    searchBarAlignSelf: 'center'
  };

  handleRefresh = () => {
    this.props.fetchEnabledApps();
  };

  goHome = () => {
    window.location.href = window.location.origin;
  };

  render() {
    const {
      elevation,
      zIndex,

      logo,
      logoSrc,
      appLogoSrc,
      backgroundColor,
      logoBackgroundColor,
      title,
      titleColor,
      isDiscovery,
      searchBar,
      searchBarJustification,
      searchBarLeftMargin,
      searchBarAlignSelf,

      rightActions,

      help,
      notification,

      appSwitcher,
      onSwitchApp,
      enabledApps,
      isFetchingApps,
      enabledAppsFailedLoading,

      profileMenu,
      user,
      onLogout,
      onEditProfile,
      additionMenuItems,
      totalNotification,
      showNotifications,
      hideNotification,
      classes
    } = this.props;

    return (
      <Paper
        data-test="appbar"
        component="header"
        square
        elevation={elevation}
        className={classes.appBar}
        style={{
          height: appBarHeight,
          background: backgroundColor,
          zIndex: zIndex
        }}
      >
        <div
          data-test="appbarLogo"
          className={classes.logo}
          style={{ backgroundColor: logoBackgroundColor }}
          onClick={this.goHome}
        >
          {logo && <img src={logoSrc} draggable="false" />}
        </div>
        <div className={classes.content} style={{ color: titleColor }}>
          <div
            className={classNames(classes.left, classes.noSelect)}
            onClick={this.goHome}
          >
            {appLogoSrc ? (
              <img
                className={classes.appLogo}
                src={appLogoSrc}
                draggable="false"
              />
            ) : (
              <div data-test="appbarTitle" className={classes.title}>
                {title}
              </div>
            )}
          </div>
          <div
            data-test="appbarSearch"
            className={classes.searchBarHolder}
            style={{
              justifyContent: searchBarJustification,
              marginLeft: searchBarLeftMargin,
              alignSelf: searchBarAlignSelf
            }}
          >
            {searchBar || <div id="veritone-search-bar" />}
          </div>
          <div className={classes.right}>
            <div className={classes.controllers}>
              {//Custom Controllers (Copy over from the previous app bar version)
              rightActions &&
                rightActions.length > 0 && (
                  <div
                    className={classNames(classes.iconGroup, classes.noSelect)}
                  >
                    {rightActions.map(({ label, onClick, isActive }) => (
                      <div className={classes.iconGroupIcon} key={label}>
                        <span
                          onClick={onClick}
                          className={classNames(
                            classes.rightActionLabel,
                            isActive ? classes.active : classes.passive
                          )}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              {//Notifications
              notification && (
                <Notifier
                  {...notification}
                  totalNotification={totalNotification}
                  showNotifications={showNotifications}
                  hideNotification={hideNotification}
                />
              )}

              {//Help
              help && <Help {...help} />}

              {//App Switcher
              appSwitcher && (
                <div data-test="appbarSwitcher">
                  <AppSwitcher
                    enabledApps={enabledApps}
                    isFetchingApps={isFetchingApps}
                    onSwitchApp={onSwitchApp}
                    handleRefresh={this.handleRefresh}
                    enabledAppsFailedLoading={enabledAppsFailedLoading}
                  />
                </div>
              )}

              {//User Profile
              profileMenu && (
                <div data-test="appbarProfile">
                  <ProfileMenu
                    enabledApps={enabledApps}
                    isDiscovery={isDiscovery}
                    onLogout={onLogout}
                    onEditProfile={onEditProfile}
                    user={user}
                    additionMenuItems={additionMenuItems}
                  />
                </div>
              )}

              {//Close Button
              this.props.closeButton &&
                this.props.onClose && (
                  <div>
                    <div style={{ marginLeft: 'auto' }}>
                      <IconButton onClick={this.props.onClose}>
                        <CloseIcon htmlColor="white" />
                      </IconButton>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(AppBar);
