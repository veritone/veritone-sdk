/* eslint-disable react/jsx-no-bind */
import React from 'react';
import Button from '@material-ui/core/Button';
import cx from 'classnames';
import { get, isNil } from 'lodash';
import { shape, bool, func } from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import styles from './styles.scss';

export default function ModifyFolder({
  open,
  currentFolder = {},
  handleClose,
  handleSubmit
}) {
  const [folderName, setFolderName] = React.useState('');
  const [error, setError] = React.useState('');
  React.useEffect(() => {
    if (!isNil(currentFolder)) {
      const folderName = get(currentFolder, 'name');
      setFolderName(folderName);
      setError('');
    }
    return () => {
      setFolderName('');
    };
  }, [currentFolder]);
  
  React.useEffect(() => {
    setFolderName('');
    setError('');
    return () => {
      setFolderName('');
      setError('');
    };
  }, []);

  const onChange = event => {
    const { value } = event.target;
    setFolderName(value);
    validate(value);
  };

  const onUpdate = () => {
    validate(folderName);
    if (error === '') {
      handleSubmit(folderName, currentFolder);
    }
  };

  const validate = (folderNameToValid) => {
    if (folderNameToValid.length === 0) {
      return setError('Folder name must not be empty');
    }
    setError('');
  };


  return (
    <div>
      <Dialog
        fullWidth
        maxWidth='md'
        open={open}
        onClose={handleClose}
        aria-labelledby="create-folder"
      >
        <DialogTitle id="create-folder">Edit Folder</DialogTitle>
        <DialogContent className={cx(styles['dialog-content'])}>
          <div className={cx(styles['folder-name-field'])}>
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            className={cx(styles['button-styles'])}
            onClick={handleClose}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            disabled={folderName === ''}
            className={cx(styles['button-styles'])}
            onClick={onUpdate}
            color="primary"
          >
            Submit
          </Button >
        </DialogActions>
      </Dialog>
    </div>
  );
}
ModifyFolder.propTypes = {
  open: bool,
  currentFolder: shape(Object),
  handleClose: func,
  handleSubmit: func,
}
