import React from 'react';
import { bool, func, string } from 'prop-types';
import { reduxForm, Field } from 'redux-form';

import { formComponents } from 'veritone-react-common';
const { Input } = formComponents;
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

import styles from './styles.scss';

const ChangeName = ({ open, firstName, lastName, onConfirm, onCancel }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Change Name</DialogTitle>

      <DialogContent>
        <FormControl className={styles.inputGroup} fullWidth>
          <InputLabel htmlFor="first-name-text">First name</InputLabel>
          <Field
            component={Input}
            name="firstName"
            id="first-name-text"
            autoFocus
          />
        </FormControl>
        <FormControl className={styles.inputGroup} fullWidth>
          <InputLabel htmlFor="last-name-text">Last Name</InputLabel>
          <Field component={Input} name="lastName" id="last-name-text" />
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button color="primary" onClick={onConfirm}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ChangeName.propTypes = {
  firstName: string.isRequired,
  lastName: string.isRequired,
  open: bool.isRequired,
  onCancel: func.isRequired,
  onConfirm: func.isRequired
};

export default reduxForm({
  form: 'userProfile'
})(ChangeName);
