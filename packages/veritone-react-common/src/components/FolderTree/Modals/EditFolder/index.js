/* eslint-disable react/jsx-no-bind */
import React from 'react';
import Button from '@material-ui/core/Button';
import cx from 'classnames';
import { get, isNil, omit, isEmpty } from 'lodash';
import { shape, bool, func, arrayOf, string, oneOfType, number } from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FolderTree from '../../index';
import styles from './styles.scss';

const actionType = {
  1: 'New Folder',
  2: 'Move Folder',
  3: 'Edit Folder'
}

export default function EditFolder({
  open,
  isNewFolder = false,
  type = 'New Folder',
  isEnableEditName = false,
  isEnableEditFolder = false,
  currentFolder = {},
  handleClose,
  handleSubmit,
  foldersData,
  onExpand,
  defaultOpening = [],
  processingFolder = [],
  handerClickNewFolder
}) {
  const [folderName, setFolderName] = React.useState('');
  const [error, setError] = React.useState('');
  const [selectedFolder, setSelectedFolder] = React.useState({});
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

  const onSelectFolder = folders => {
    setSelectedFolder(folders);
  };

  const onUpdate = () => {
    validate(folderName);
    if (error === '') {
      handleSubmit(selectedFolder, folderName);
    }
  };

  const validate = (folderNameToValid) => {
    if (folderNameToValid.length === 0) {
      return setError('Folder name must not be empty');
    }
    setError('');
  };

  const foldersDataReprocess = () => {
    return {
      ...foldersData,
      allId: [...foldersData.allId.filter(item => item !== currentFolder.id)],
      byId: omit(foldersData.byId, currentFolder.id)
    }
  };

  const handlerNewFolder = () => {
    handerClickNewFolder(selectedFolder);
  }

  const getSubmitStatus = () => {
    if (type === 3) {
      return folderName === '';
    }
    return folderName === '' || isEmpty(selectedFolder);
  }

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth='md'
        open={open}
        onClose={handleClose}
        aria-labelledby="create-folder"
      >
        <DialogTitle id="create-folder">
          {actionType[type]}
        </DialogTitle>
        <DialogContent className={cx(styles['dialog-content'])}>
          {
            isEnableEditName && (
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
            )
          }
          {isEnableEditFolder && (
            <div className={cx(styles['action-new-field'])}>
              <div>Choose a Folder</div>
              {!isNewFolder && (
                <Button
                  color="primary"
                  className={cx(styles['button-styles'])}
                  onClick={handlerNewFolder}
                >
                  NEW FOLDER
              </Button>
              )}
            </div>
          )}
          {isEnableEditFolder && (
            <div className={cx(styles['folder-tree-card'])}>
              <FolderTree
                selectable={false}
                loading={false}
                foldersData={foldersDataReprocess()}
                onChange={onSelectFolder}
                onExpand={onExpand}
                isEnableShowContent={false}
                isEnableShowRootFolder
                selected={selectedFolder}
                defaultOpening={defaultOpening}
                processingFolder={processingFolder}
              />
            </div>
          )}
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
            disabled={getSubmitStatus()}
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
EditFolder.propTypes = {
  open: bool,
  isEnableEditName: bool,
  isEnableEditFolder: bool,
  isNewFolder: bool,
  type: oneOfType([string, number]),
  currentFolder: shape(Object),
  handleClose: func,
  handleSubmit: func,
  foldersData: shape(Object),
  onExpand: func,
  handerClickNewFolder: func,
  defaultOpening: arrayOf(Object),
  processingFolder: arrayOf(Object)
}
