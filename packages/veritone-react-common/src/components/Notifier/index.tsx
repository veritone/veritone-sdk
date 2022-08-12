import { useState } from 'react';
import classNames from 'classnames';
import Badge from '@mui/material/Badge';
import { withStyles } from '@mui/styles';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { shape } from 'prop-types';
import NotificationIcon from '@mui/icons-material/Notifications';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import NotificationList, { notificationListPropTypes } from './NotificationList';
import styles from './styles';

const Notifier = ({
  tooltipTitle = 'Notifications',
  headerText = 'Items in Queue',
  onOpen,
  onClose,
  headerBackgroundColor,
  bodyBackgroundColor,
  notifications,
  totalNotification,
  classes,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const showNotifications = (event) => {
    setAnchorEl(event.currentTarget);
    onOpen && onOpen();
  };

  const hideNotification = (event) => {
    setAnchorEl(null);
    onClose && onClose();
  };


  const displayEntries = notifications.concat([]);
  const numNotifications = (totalNotification || totalNotification === 0) ? totalNotification : notifications.length || 0;
  //TODO: remove "numNotifications > 0 ?" condition when material-ui is updated to a later version

  return (
    <div className={classNames(classes.notification)}>
      <Tooltip title={tooltipTitle || ''}>
          <span className={classes.toolTipWrapper}>
            <IconButton
              onClick={showNotifications ? showNotifications : showNotifications}
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
        onClose={hideNotification ? hideNotification : hideNotification}
        className={classNames(classes.popover)}
      >
        <div className={classNames(classes.notificationWindow)} data-test="notificationWindow">
          <div className={classNames(classes.header)} style={{ backgroundColor: headerBackgroundColor }} data-test="header">
            <div className={classNames(classes.label)}>{headerText}</div>
            <div className={classNames(classes.chip)}>{numNotifications}</div>
            <IconButton className={classNames(classes.controls)} onClick={hideNotification ? hideNotification : hideNotification}>
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
};

interface Props {
  tooltipTitle: string;
  headerText: string;
  onOpen: () => void;
  onClose: () => void;
  headerBackgroundColor: string;
  bodyBackgroundColor: string;
  notifications: typeof notificationListPropTypes;
  totalNotification: number;
  showNotifications: () => void;
  hideNotification: () => void;
  classes: typeof shape;
}

export default withStyles(styles)(Notifier);
