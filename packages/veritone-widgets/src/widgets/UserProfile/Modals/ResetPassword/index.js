import React from 'react';
import { bool, func } from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const ResetPassword = ({ open, onConfirm, onCancel }) => (
  <Dialog open={open}>
    <DialogTitle>Reset Password</DialogTitle>

    <DialogContent>
      <DialogContentText>
        Veritone will send a reset password link via the email on your account.
      </DialogContentText>
      <DialogContentText>Would you like to continue?</DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button onClick={onCancel}>Cancel</Button>
      <Button color="primary" onClick={onConfirm}>
        Yes
      </Button>
    </DialogActions>
  </Dialog>
);

ResetPassword.propTypes = {
  open: bool.isRequired,
  onConfirm: func.isRequired,
  onCancel: func.isRequired
};

export default ResetPassword;
