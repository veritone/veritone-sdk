import React from 'react';
import { string, bool, func } from 'prop-types';

import Dialog from 'material-ui/Dialog';
import Input from 'material-ui/Input';
import { DialogContent, DialogTitle, DialogActions } from 'material-ui/Dialog';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Button from 'material-ui/Button';

import classes from './styles.scss';

const ChangeName = ({
  firstName, 
  lastName, 
  open, 
  handleFirstNameChange, 
  handleLastNameChange, 
  handleSubmit, 
  handleClose
}) => {
  let firstNameDirty = firstName;
  let lastNameDirty = lastName;
  
  return (
  <Dialog open={open} className={classes.modal}>
    <DialogTitle>Change Name</DialogTitle>
    <DialogContent>
      <FormControl aria-describedby="first-name-text" fullWidth>
      <InputLabel 
          htmlFor="first-name-text" 
          FormControlClasses={{ focused: classes.focusedInput }}>
        First name
        </InputLabel>
        <Input id="first-name-text"
          value={firstNameDirty} 
          onChange={handleFirstNameChange} 
          autoFocus 
          classes={{ focused: classes.underline }}/>
      </FormControl>

      <FormControl 
        className={classes.formControl} 
        aria-describedby="last-name-text" 
        fullWidth>
        <InputLabel 
          htmlFor="last-name-text" 
          FormControlClasses={{ focused: classes.focusedInput }}>
          Last Name
        </InputLabel>
        <Input 
          id="last-name-text" 
          value={lastName} 
          onChange={handleLastNameChange} 
          classes={{ focused: classes.underline }} />
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button 
        className={`${classes.btnDone} ${classes.btn}`}
        onClick={handleClose}>
        Cancel
      </Button>
      <Button 
        className={`${classes.btnDone} ${classes.btn}`}
        onClick={() => handleSubmit({firstName: firstNameDirty, lastName: lastNameDirty})}>
        Done
      </Button>
    </DialogActions>
  </Dialog>
)};


ChangeName.propTypes = {
  firstName: string.isRequired,
  lastName: string.isRequired,
  open: bool.isRequired,
  handleFirstNameChange: func.isRequired,
  handleLastNameChange: func.isRequired,
  handleClose: func.isRequired,
  handleSubmit: func.isRequired,
}


export default ChangeName;
