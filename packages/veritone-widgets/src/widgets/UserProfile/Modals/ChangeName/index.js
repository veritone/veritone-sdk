import React from 'react';
import { bool, func } from 'prop-types';
import { reduxForm, Field } from 'redux-form';

import { formComponents } from 'veritone-react-common';
const { TextField } = formComponents;
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';

import styles from './styles';

const useStyles = makeStyles(styles);

const ChangeName = ({ open, disableConfirm, onConfirm, onCancel }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} classes={{ root: classes.dialogContainer }}>
      <DialogTitle>Change Name</DialogTitle>

      <DialogContent>
        <div className={classes.inputGroup}>
          <Field
            component={TextField}
            name="firstName"
            label="First name"
            autoFocus
            fullWidth
          />
        </div>
        <div className={classes.inputGroup}>
          <Field
            component={TextField}
            name="lastName"
            label="Last name"
            fullWidth
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button color="primary" disabled={disableConfirm} onClick={onConfirm}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ChangeName.propTypes = {
  open: bool,
  disableConfirm: bool,
  onCancel: func.isRequired,
  onConfirm: func.isRequired
};

export default reduxForm({
  form: 'userProfile'
})(ChangeName);
