import React from 'react';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import NotificationIcon from '@material-ui/icons/Notifications';
import Popover from '@material-ui/core/Popover';
import { string, shape, func } from 'prop-types';

import classNames from 'classnames';
import styles from './styles.scss';  

import NotificationList, { notificationListPropTypes } from './NotificationList';
export const notifierPropTypes = shape({
  headerText: string,
  onOpen: func,
  onClose: func,
  headerBackgroundColor: string,
  bodyBackgroundColor: string,
  notifications: notificationListPropTypes
});

export default class Notifier extends React.Component {
  static propTypes = {
    headerText: string,
    onOpen: func,
    onClose: func,
    headerBackgroundColor: string,
    bodyBackgroundColor: string,
    notifications: notificationListPropTypes
  };

  static defaultProps = {
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
      headerText,
      headerBackgroundColor,
      bodyBackgroundColor,
      notifications
    } = this.props;


    const displayEntries = notifications.concat([]);
    const numNotifications = notifications.length || 0;

    //TODO: remove "numNotifications > 0 ?" condition when material-ui is updated to a later version
    return (
      <div className={classNames(styles.notification)}>
        <IconButton onClick={this.showNotifications} disabled={numNotifications === 0}>
          {
            numNotifications > 0 && !anchorEl ?
              <Badge color="primary" badgeContent={numNotifications}>
                <NotificationIcon nativeColor="white" />
              </Badge>
            :
              <NotificationIcon nativeColor="white" />
          }
        </IconButton>

        <Popover
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
          onClose={this.hideNotification}
          className={ classNames(styles.popover) }
        >
          <div className={classNames(styles.notificationWindow)}>
            <div className={classNames(styles.header)} style={{backgroundColor: headerBackgroundColor}}>
              <div className={classNames(styles.label)}>{headerText}</div>
              <div className={classNames(styles.chip)}>{numNotifications}</div>
            </div>
            
            <div className={classNames(styles.body)} style={{backgroundColor: bodyBackgroundColor}}>
              <NotificationList notifications={displayEntries}/>
            </div>
          </div>
        </Popover>
      </div>
    );
  }
}
