import React from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';

import {
  string,
  bool,
  func,
  shape,
  number,
  element,
  oneOfType,
  oneOf
} from 'prop-types';

import Notifier, { notifierPropTypes } from 'components/Notifier';
import Help, { helpPropTypes } from 'components/Help';
import HambugerIcon from 'images/hamburger.svg';
import AppLogo from 'images/appLogo.svg'
import OrgIcon from 'images/orgIcon.svg'
import VeritoneLogo from 'images/veritoneLogo.svg';
import SettingPanel from './templates/DrawerBar';

import styles from './styles';

export const appBarHeight = 55;
export const defaultAppBarZIndex = 1000;

const useStyles = makeStyles(styles);

function NewAppBar({
  elevation,
  zIndex,
  enableAppbarMenu,
  onClickAppbarMenu,
  logo,
  logoSrc,
  backgroundColor,
  title,
  titleColor,
  searchBar,
  searchBarJustification,
  searchBarLeftMargin,
  searchBarAlignSelf,
  help,
  notification,
  orgLogo,
  onShowSettingPanel,
  onClickOrgIcon,
  totalNotification,
  showNotifications,
  hideNotification,
  closeButton,
  onClose
}) {
  const classes = useStyles();

  function goHome() {
    window.location.href = window.location.origin;
  };

  return (
    <React.Fragment>
      <Box
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
        {enableAppbarMenu && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            paddingX="15px"
          >
            <IconButton
              className={classes.humburgerIcon}
              onClick={onClickAppbarMenu}
            >
              <img src={HambugerIcon} draggable="false" />
            </IconButton>
          </Box>
        )}
        {logoSrc && (
          <div
            data-test="appbarLogo"
            className={classes.logo}
            onClick={goHome}
          >
            {logo && <img src={logoSrc} draggable="false" />}
          </div>
        )}
        <div className={classes.content} style={{ color: titleColor }}>
          <div
            className={classNames(classes.left, classes.noSelect)}
            onClick={goHome}
          >
            <div data-test="appbarTitle" className={classes.title}>
              {title}
            </div>
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
              {//Help
                help && (
                  <Box marginRight="14px">
                    <Help {...help} />
                  </Box>
                )}
              {//Notifications
                notification && (
                  <Box marginRight="14px">
                    <Notifier
                      {...notification}
                      totalNotification={totalNotification}
                      showNotifications={showNotifications}
                      hideNotification={hideNotification}
                    />
                  </Box>
                )}

              {//org logo 
                orgLogo && (
                  <Box marginRight="14px">
                    <IconButton
                      onClick={onClickOrgIcon}
                    >
                      <img src={orgLogo} draggable="false" />
                    </IconButton>
                  </Box>
                )
              }
              {/* veritone function */}
              <IconButton
                onClick={onShowSettingPanel}
              >
                <img src={VeritoneLogo} draggable="false" />
              </IconButton>

              {//Close Button
                closeButton && onClose && (
                  <div>
                    <div style={{ marginLeft: 'auto' }}>
                      <IconButton onClick={onClose}>
                        <CloseIcon htmlColor="white" />
                      </IconButton>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </Box >
      <SettingPanel open />
    </React.Fragment>
  );
}

NewAppBar.propTypes = {
  title: string,
  titleColor: string,
  enableAppbarMenu: bool,
  backgroundColor: string,
  onClickAppbarMenu: func,
  elevation: number,
  closeButton: bool,
  logo: bool,
  logoSrc: string,
  appLogoSrc: string,
  orgLogo: string,
  onClose: func,
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
  onShowSettingPanel: func,
  onClickOrgIcon: func
};
NewAppBar.defaultProps = {
  logo: true,
  logoSrc: AppLogo,
  orgLogo: OrgIcon,
  enableAppbarMenu: true,
  titleColor: '#465364',
  backgroundColor: '#FFFFFF',
  elevation: 2,
  searchBarJustification: 'center',
  searchBarLeftMargin: 0,
  zIndex: defaultAppBarZIndex,
  searchBarAlignSelf: 'center',
  onShowSettingPanel: () => { },
  onClickOrgIcon: () => { }
};


export default NewAppBar;
