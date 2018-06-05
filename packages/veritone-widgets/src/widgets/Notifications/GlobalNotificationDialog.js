import React from 'react';
import { connect } from 'react-redux';
import { bool, string, func } from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import * as notificationsModule from '../../redux/modules/notifications';

@connect(
  state => ({
    open: notificationsModule.selectDialogNotificationState(state).open,
    message: notificationsModule.selectDialogNotificationState(state).message,
    title: notificationsModule.selectDialogNotificationState(state).title
  }),
  {
    onClose: notificationsModule.hideDialogNotification
  }
)
export default class GlobalNotificationDialog extends React.Component {
  static propTypes = {
    open: bool,
    message: string.isRequired,
    title: string,
    onClose: func.isRequired
  };
  static defaultProps = {
    title: ''
  };

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{this.props.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
