import React from 'react';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import NotificationIcon from '@material-ui/icons/Notifications';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import { string, number, func } from 'prop-types';

import classNames from 'classnames';
import styles from './styles.scss';

import NotificationList, {
  notificationListPropTypes
} from './NotificationList';
export const notifierPropTypes = {
  tooltipTitle: string,
  headerText: string,
  subheader1: string,
  subheader2: string,
  subheader3: string,
  onOpen: func,
  onClose: func,
  headerBackgroundColor: string,
  bodyBackgroundColor: string,
  notifications: notificationListPropTypes,
  totalUnread: number
};

export default class Notifier extends React.Component {
  static propTypes = notifierPropTypes;

  static defaultProps = {
    tooltipTitle: 'Notifications',
    headerText: 'Items in Queue'
  };

  state = {
    anchorEl: null
  };

  showNotifications = event => {
    const target = event.currentTarget;
    this.setState({
      anchorEl: target
    });

    this.props.onOpen && this.props.onOpen();
  };

  hideNotification = event => {
    this.setState({ anchorEl: null });
    this.props.onClose && this.props.onClose();
  };

  render() {
    const { anchorEl } = this.state;

    const {
      tooltipTitle,
      headerText,
      headerBackgroundColor,
      bodyBackgroundColor,
      notifications,
      totalUnread,
      subheader1,
      subheader2,
      subheader3
    } = this.props;

    const displayEntries = notifications.concat([]);
    const numNotifications = notifications.length || 0;
    const numUnreadNotifications = totalUnread || 0;
    //TODO: remove "numNotifications > 0 ?" condition when material-ui is updated to a later version
    return (
      <div className={classNames(styles.notification)}>
        <Tooltip title={tooltipTitle || ''}>
          <span className={styles.toolTipWrapper}>
            <IconButton
              onClick={this.showNotifications}
              disabled={numNotifications === 0}
              data-veritone-element="notification-button"
            >
              {numUnreadNotifications > 0 && !anchorEl ? (
                <Badge
                  color="primary"
                  badgeContent={numUnreadNotifications}
                  classes={{ badge: styles.badge }}
                >
                  <NotificationIcon nativeColor="white" />
                </Badge>
              ) : (
                <NotificationIcon nativeColor="white" />
              )}
            </IconButton>
          </span>
        </Tooltip>

        <Popover
          disableRestoreFocus
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          onClose={this.hideNotification}
          className={classNames(styles.popover)}
        >
          <div className={classNames(styles.notificationWindow)}>
            <div
              className={classNames(styles.header)}
              style={{ backgroundColor: headerBackgroundColor }}
            >
              <div className={classNames(styles.label)}>{headerText}</div>
              <div className={classNames(styles.chip)}>
                {numUnreadNotifications}
              </div>
              <IconButton
                className={classNames(styles.controls)}
                onClick={this.hideNotification}
              >
                <KeyboardArrowUpIcon nativeColor="white" />
              </IconButton>
            </div>
            <div className={classNames(styles.headersContainer)}>
              <div className={classNames(styles.header1)}>
                <div className={classNames(styles.description)}>
                  {subheader1}
                </div>
              </div>
              <div className={classNames(styles.header2)}>
                <div className={classNames(styles.description)}>
                  {subheader2}
                </div>
              </div>
              <div className={classNames(styles.header3)}>
                <div className={classNames(styles.description)}>
                  {subheader3}
                </div>
              </div>
            </div>
            <div
              className={classNames(styles.body)}
              style={{ backgroundColor: bodyBackgroundColor }}
            >
              <NotificationList notifications={displayEntries} />
            </div>
          </div>
        </Popover>
      </div>
    );
  }
}
