import React from 'react';
import { bool, func } from 'prop-types';

import Dialog from 'material-ui/Dialog';
import { DialogContent, DialogTitle, DialogActions } from 'material-ui/Dialog';
import Button from 'material-ui/Button';

import classes from './styles.scss';



const ResetPassword = ({ open, requestReset, closeHandler }) => (
  <Dialog open={open} className={classes.modal}>
    <DialogTitle className={classes.title}>Reset Password</DialogTitle>
    <DialogContent>
      <p className={classes.dialog}>
        Vertione will send a reset password link via the email on your account.
            </p>
      <p className={classes.dialog}>
        Would you like to continue?
            </p>
    </DialogContent>
    <DialogActions>
      <Button
        className={`${classes.cancelBtn} ${classes.btn}`}
        onClick={closeHandler}>
        Cancel
            </Button>
      <Button
        className={`${classes.actionBtn} ${classes.btn}`}
        onClick={requestReset}>
        Yes
            </Button>
    </DialogActions>
  </Dialog>
);

ResetPassword.propTypes = {
  open: bool.isRequired,
  requestReset: func.isRequired,
  closeHandler: func.isRequired
}

export default ResetPassword;
