import React from 'react';
import { connect } from 'react-redux';
import { bool, string, func } from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';

import * as notificationsModule from '../../redux/modules/notifications';

@connect(
  state => ({
    open: notificationsModule.selectSnackbarNotificationState(state).open,
    message: notificationsModule.selectSnackbarNotificationState(state).message
  }),
  {
    onClose: notificationsModule.hideSnackbarNotification
  }
)
export default class GlobalSnackBar extends React.Component {
  static propTypes = {
    open: bool,
    message: string.isRequired,
    onClose: func.isRequired
  };

  render() {
    return <Snackbar autoHideDuration={4000} {...this.props} />;
  }
}
