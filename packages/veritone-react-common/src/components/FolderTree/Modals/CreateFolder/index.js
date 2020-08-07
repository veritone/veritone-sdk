/* eslint-disable react/jsx-no-bind */
import React from 'react';
import Button from '@material-ui/core/Button';
import { get } from 'lodash';
import { shape, bool, func } from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles';

const useStyles = makeStyles(theme => ({
  ...styles
}));

export default function CreateFolder({
  open,
  parentFolder,
  handleClose,
  handleSubmit
}) {
  const classes = useStyles();
  const [folderName, setFolderName] = React.useState('');
  const [error, setError] = React.useState('');
  React.useEffect(() => {
    if (!open) {
      setFolderName('');
      setError('')
    }
  }, [open])
  const onChange = event => {
    const { value } = event.target;
    if (value.length > 50) {
      return;
    }
    setFolderName(value);
    validate(value);
  };

  const onCreate = () => {
    validate(folderName);
    if (error === '') {
      handleSubmit(folderName.trim(), parentFolder.id);
    }
  };

  React.useEffect(() => {
    setFolderName('');
    setError('');
    return () => {
      setFolderName('');
      setError('');
    };
  }, []);

  const validate = (folderNameToValid) => {
    if (folderNameToValid.trim().length === 0) {
      return setError('Folder name must not be empty');
    }
    setError('');
  };

  const getContent = () => {
    const parentFolderName = get(parentFolder, 'name', 'Root Folder');
    return `Create folder within "${parentFolderName}"`
  };

  const getCounter = () => {
    return `${folderName.length}/50`;
  };

  return (
    <Dialog
      fullWidth
      maxWidth='sm'
      open={open}
      onClose={handleClose}
      aria-labelledby="create-folder"
    >
      <DialogTitle id="create-folder">
        <Typography className={classes.title}>Create Folder</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {getContent()}
        </DialogContentText>
        <div className={classes.folderNameField}>
          <TextField
            autoFocus
            margin="dense"
            id="folder-name"
            label="Folder Name"
            type="text"
            error={error.length !== 0}
            helperText={error}
            value={folderName}
            onChange={onChange}
            fullWidth
          />
          <div className={classes.counterText}>
            {getCounter()}
          </div>
        </div>
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
          disabled={folderName === ''}
          onClick={onCreate}
          color="primary"
          className={classes.buttonStyles}
        >
          Create
          </Button >
      </DialogActions>
    </Dialog>
  );
}
CreateFolder.propTypes = {
  open: bool,
  parentFolder: shape(Object),
  handleClose: func,
  handleSubmit: func
}
