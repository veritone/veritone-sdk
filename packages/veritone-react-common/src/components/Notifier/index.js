import React from 'react';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import NotificationIcon from '@material-ui/icons/Notifications';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import { string, func, number, shape, any } from 'prop-types';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';
import styles from './styles';

import NotificationList, { notificationListPropTypes } from './NotificationList';
export const notifierPropTypes = {
  tooltipTitle: string,
  headerText: string,
  onOpen: func,
  onClose: func,
  headerBackgroundColor: string,
  bodyBackgroundColor: string,
  notifications: notificationListPropTypes,
  totalNotification: number,
  showNotifications: func,
  hideNotification: func,
  classes: shape({any}),
};
class Notifier extends React.Component {
  static propTypes = notifierPropTypes;

  static defaultProps = {
    tooltipTitle: 'Notifications',
    headerText: 'Items in Queue'
  };

  state = {
    anchorEl: null
  };

  showNotifications = event => {
    this.setState({
      anchorEl: event.currentTarget
    });

    this.props.onOpen && this.props.onOpen();
  };

  hideNotification = event => {
    this.setState({ anchorEl: null });
    this.props.onClose && this.props.onClose();
  }

  render() {
    const {
      anchorEl
    } = this.state;

    const {
      tooltipTitle,
      headerText,
      headerBackgroundColor,
      bodyBackgroundColor,
      notifications,
      totalNotification,
      showNotifications,
      hideNotification,
      classes
    } = this.props;


    const displayEntries = notifications.concat([]);
    const numNotifications = (totalNotification || totalNotification === 0) ? totalNotification : notifications.length || 0;
    //TODO: remove "numNotifications > 0 ?" condition when material-ui is updated to a later version
    return (
      <div className={classNames(classes.notification)}>
        <Tooltip title={tooltipTitle || ''}>
          <span className={classes.toolTipWrapper}>
            <IconButton
              onClick={showNotifications ? showNotifications : this.showNotifications}
              disabled={notifications.length === 0}
              data-veritone-element="notification-button"
            >
              {
                numNotifications > 0 && !anchorEl ?
                  <Badge
                    color="primary"
                    badgeContent={numNotifications}
                    classes={{ badge: classes.badge }}
                  >
                    <NotificationIcon htmlColor="white" />
                  </Badge>
                  :
                  <NotificationIcon htmlColor="white" />
              }
            </IconButton>
          </span>
        </Tooltip>

        <Popover
          disableRestoreFocus
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={hideNotification ? hideNotification : this.hideNotification}
          className={classNames(classes.popover)}
        >
          <div className={classNames(classes.notificationWindow)} data-test="notificationWindow">
            <div className={classNames(classes.header)} style={{ backgroundColor: headerBackgroundColor }} data-test="header">
              <div className={classNames(classes.label)}>{headerText}</div>
              <div className={classNames(classes.chip)}>{numNotifications}</div>
              <IconButton className={classNames(classes.controls)} onClick={hideNotification ? hideNotification : this.hideNotification}>
                <KeyboardArrowUpIcon htmlColor="white" />
              </IconButton>
            </div>

            <div className={classNames(classes.body)} style={{ backgroundColor: bodyBackgroundColor }}>
              <NotificationList notifications={displayEntries} />
            </div>
          </div>
        </Popover>
      </div>
    );
  }
}

export default withStyles(styles)(Notifier);
