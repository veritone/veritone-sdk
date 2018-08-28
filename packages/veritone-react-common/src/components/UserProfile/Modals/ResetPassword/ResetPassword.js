import React from 'react';
import { bool, func } from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import classes from './styles.scss';

const ResetPassword = ({ open, requestReset, closeHandler }) => (
  <Dialog open={open} className={classes.modal}>
    <DialogTitle className={classes.title}>
      Reset Password
      <div className={classes.iconHolder}>
        <i className="icon-close-exit" onClick={closeHandler} />
      </div>
    </DialogTitle>
    <DialogContent>
      <p className={classes.dialog}>
        Vertione will send a reset password link via the email on your account.
      </p>
      <p className={classes.dialog}>Would you like to continue?</p>
    </DialogContent>
    <DialogActions>
      <Button
        className={`${classes.cancelBtn} ${classes.btn}`}
        onClick={closeHandler}
      >
        Cancel
      </Button>
      <Button
        className={`${classes.actionBtn} ${classes.btn}`}
        onClick={requestReset}
      >
        Yes
      </Button>
    </DialogActions>
  </Dialog>
);

ResetPassword.propTypes = {
  open: bool.isRequired,
  requestReset: func.isRequired,
  closeHandler: func.isRequired
};

export default ResetPassword;
