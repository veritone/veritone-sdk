import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
export default function SaveTemplate({
    open,
    handleSave,
    handleClose,
    onChange,
}) {
  return (
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle id="form-dialog-title">Save Process Template
      </DialogTitle>
        <DialogContent>
          <DialogContentText>
          Please enter a name for this template
          </DialogContentText>
          <TextField
            autoFocus
            label="Template Name"
            fullWidth
            onChange={onChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
  );
}