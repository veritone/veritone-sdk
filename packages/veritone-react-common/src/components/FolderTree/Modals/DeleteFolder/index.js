/* eslint-disable react/jsx-no-bind */
import React from 'react';
import Button from '@material-ui/core/Button';
import { get } from 'lodash';
import { shape, bool, func } from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles';

const useStyles = makeStyles(theme => ({
  ...styles
}));

export default function DeleteFolder({
  open,
  folder = {},
  handleClose,
  handleSubmit,
}) {
  const classes = useStyles();
  const [approvedText, setapprovedText] = React.useState('');
  const isFolderWithContent = () => {
    return get(folder, 'hasContent', false);
  }

  const getDialogTitle = () => {
    if (isFolderWithContent()) {
      return 'Delete Folder and Collection';
    }
    return 'Delete Folder';
  }

  const getContent = () => {
    const folderName = get(folder, 'name', '');
    const folderNameToDisplay =
      folderName.length > 50 ? `${folderName.substring(0, 50)}...` : folderName;
    if (isFolderWithContent()) {
      return 'You will delete this Folder and its collection(s). Performing this action will delete all infomation including folders and contents.';
    }
    return `You will delete "${folderNameToDisplay}" and its contents. Would you like to continue?`
  }
  const onDelete = () => {
    handleSubmit(folder);
  }

  const onChaneDeleteField = e => {
    const value = event.target.value;
    setapprovedText(value);
  }

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={handleClose}
        aria-labelledby="create-folder"
      >
        <DialogTitle id="create-folder">
          <Typography className={classes.title}>{getDialogTitle()}</Typography>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <div className={classes.actionNewField}>
            {getContent()}
          </div>
          {isFolderWithContent() && (
            <div className={classes.folderNameField}>
              <div>
                To continue, type <b>DELETE</b> in box to confirm.
            </div>
              <TextField
                autoFocus
                margin="dense"
                onChange={onChaneDeleteField}
                id="deleleConfirm"
                type="text"
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            className={classes.buttonStyles}
          >
            Cancel
          </Button>
          <Button
            disabled={isFolderWithContent() && approvedText !== 'DELETE'}
            onClick={onDelete}
            color="primary"
            className={classes.buttonStyles}
          >
            Submit
          </Button >
        </DialogActions>
      </Dialog>
    </div>
  );
}
DeleteFolder.propTypes = {
  open: bool,
  folder: shape(Object).isRequired,
  handleClose: func,
  handleSubmit: func,
}
