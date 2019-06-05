import React from 'react';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import NotificationIcon from '@material-ui/icons/Notifications';
import Popover from '@material-ui/core/Popover';
import { string, shape, func } from 'prop-types';

import classNames from 'classnames';
import styles from './styles.scss';  

import NotificationList, { notificationListPropTypes } from './NotificationList';
export const notificationPropTypes = shape({
  headerText: string,
  showMoreLabel: string,
  showLessLabel: string,
  onOpen: func,
  onClose: func,
  notifications: notificationListPropTypes
});

const SMALL_DISPLAY_SIZE = 3;
const DISPLAY_SMALL = 'DISPLAY_SMALL';
const DISPLAY_LARGE = 'DISPLAY_LARGE';

export default class Notification extends React.Component {
  static propTypes = {
    headerText: string,
    showMoreLabel: string,
    showLessLabel: string,
    onOpen: func,
    onClose: func,
    notifications: notificationListPropTypes
  };

  static defaultProps = {
    headerText: 'Items in Queue',
    showMoreLabel: 'View All',
    showLessLabel: 'View Less'
  };

  state = {
    anchorEl: null,
    display: DISPLAY_SMALL
  };

  showNotifications = event => {
    this.setState({
      display: DISPLAY_SMALL,
      anchorEl: event.currentTarget
    });

    this.props.onOpen && this.props.onOpen();
  };

  hideNotification = event => {
    this.setState({ anchorEl: null });
    this.props.onClose && this.props.onClose();
  }

  toggleDisplaySize = (event) => {
    this.setState(state => {
      return state.display === DISPLAY_SMALL ? { display: DISPLAY_LARGE } : { display: DISPLAY_SMALL }
    });
  }

  render() {
    const {
      display,
      anchorEl
    } = this.state;

    const {
      headerText,
      showMoreLabel,
      showLessLabel,
      notifications
    } = this.props;


    const isSmallDisplay = display === DISPLAY_SMALL;
    const hasMoreToShow = notifications && notifications.length > SMALL_DISPLAY_SIZE;
    const displayEntries = notifications.concat([]);
    isSmallDisplay && displayEntries.splice(SMALL_DISPLAY_SIZE); 

    const numNotifications = notifications.length || 0;

    //TODO: remove "numNotifications > 0 ?" condition with when material-ui is updated to a later version
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
          className={
            classNames(
              styles.popover, 
              {
                [styles.full]: (hasMoreToShow && !isSmallDisplay)
              }
            )
          }
        >
          <div className={classNames(styles.notificationWindow)}>
            <div className={classNames(styles.header)}>
              <div className={classNames(styles.label)}>{headerText}</div>
              <div className={classNames(styles.chip)}>{numNotifications}</div>
            </div>
            
            <div className={classNames(styles.body)}>
              <NotificationList notifications={displayEntries}/>
            </div>

            <div className={classNames(styles.footer, { [styles.hidden]: !hasMoreToShow })}>
              <Button color="primary" onClick={this.toggleDisplaySize}>
                { this.state.display === DISPLAY_LARGE ? showLessLabel : showMoreLabel }
              </Button>
            </div>
          </div>
        </Popover>
      </div>
    );
  }
}
