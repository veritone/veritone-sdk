/* eslint-disable react/jsx-no-bind */
import React from 'react';
import Button from '@material-ui/core/Button';
import cx from 'classnames';
import { get } from 'lodash';
import { shape, bool, func } from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import styles from './styles.scss';

export default function DeleteFolder({
  open,
  folder = {},
  handleClose,
  handleSubmit,
}) {
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
    if (isFolderWithContent()) {
      return 'You will delete this Folder and its collection(s). Performing this action will delete all infomation including folders and contents.';
    }
    return `You will delete "${folder.name}" and its contents. Would you like to continue?`
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
          {getDialogTitle()}
        </DialogTitle>
        <DialogContent className={cx(styles['dialog-content'])}>
          <div className={cx(styles['action-new-field'])}>
            {getContent()}
          </div>
          {isFolderWithContent() && (
            <div className={cx(styles['folder-name-field'])}>
              <div>
                To continue, type <b>DELETE</b> in box to confirm.
            </div>
              <TextField
                autoFocus
                margin="dense"
                onChange={onChaneDeleteField}
                id="delele-confirm"
                type="text"
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            className={cx(styles['button-styles'])}
          >
            Cancel
          </Button>
          <Button
            disabled={isFolderWithContent() && approvedText !== 'DELETE'}
            onClick={onDelete}
            color="primary"
            className={cx(styles['button-styles'])}
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
