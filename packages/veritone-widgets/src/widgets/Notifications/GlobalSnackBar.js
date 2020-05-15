import React from 'react';
import { connect } from 'react-redux';
import { bool, string, func, shape } from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import * as notificationsModule from '../../redux/modules/notifications';
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
@connect(
  state => ({
    open: notificationsModule.selectSnackbarNotificationState(state).open,
    message: notificationsModule.selectSnackbarNotificationState(state).message,
    anchorOrigin: notificationsModule.selectSnackbarNotificationState(state).anchorOrigin,
    severity: notificationsModule.selectSnackbarNotificationState(state).severity
  }),
  {
    onClose: notificationsModule.hideSnackbarNotification
  }
)

export default class GlobalSnackBar extends React.Component {
  static propTypes = {
    open: bool,
    message: string.isRequired,
    onClose: func.isRequired,
    severity: string,
    anchorOrigin: shape({
      vertical: string,
      horizontal: string
    })
  };

  render() {
    return (
      <Snackbar autoHideDuration={4000} {...this.props} >
        <Alert severity={this.props.severity}>{this.props.message}</Alert>
      </Snackbar>
    )
  }
}
