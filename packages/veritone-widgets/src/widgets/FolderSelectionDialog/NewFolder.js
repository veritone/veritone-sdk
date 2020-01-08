import React from 'react';
import { isEmpty } from 'lodash';
import { bool, func, string, shape, number, any } from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import {
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  FormHelperText,
  FormControl,
  InputLabel,
  Input
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/styles';
import styles from './styles';
import * as folderSelectionModule from '../../redux/modules/folderSelectionDialog';

@withStyles(styles)
@connect(
  state => ({
    rootFolder: folderSelectionModule.rootFolder(state),
    selectedFolder: folderSelectionModule.selectedFolder(state),
    newFolder: folderSelectionModule.newFolder(state)
  }),
  {
    selectFolder: folderSelectionModule.selectFolder,
    createFolder: folderSelectionModule.createFolder,
    resetNewFolder: folderSelectionModule.resetNewFolder
  }
)
export default class NewFolder extends React.Component {
  static propTypes = {
    rootFolderType: string,
    open: bool,
    createFolder: func,
    selectFolder: func,
    selectedFolder: shape({
      id: string,
      treeObjectId: string,
      orderIndex: number,
      name: string,
      description: string,
      modifiedDateTime: string,
      status: string,
      ownerId: string,
      typeId: number,
      parent: shape({
        treeObjectId: string
      }),

      childFolders: shape({
        count: number
      })
    }),
    rootFolder: shape({
      id: string,
      name: string,
      treeObjectId: string,
      organizationId: string,
      ownerId: string,
      typeId: number,
      orderIndex: number,
      childFolders: shape({
        count: number
      })
    }),
    newFolder: shape({
      loading: bool,
      error: bool,
      errorMessage: string,
      folder: shape({
        id: string,
        treeObjectId: string,
        orderIndex: number,
        name: string,
        description: string,
        modifiedDateTime: string,
        status: string,
        parent: shape({
          treeObjectId: string
        }),

        childFolders: shape({
          count: number
        })
      })
    }),
    cancel: func,
    resetNewFolder: func,
    classes: shape({ any }),
  };

  static defaultProps = {
    open: false
  };

  state = {
    newFolderName: ''
  };

  componentDidMount() {
    const {
      selectFolder,
      selectedFolder,
      rootFolder,
      resetNewFolder
    } = this.props;
    // when opening newfolder dialog - default the folder selected to the root folder if they did not select one
    if (!selectedFolder.treeObjectId) {
      selectFolder(rootFolder);
    }
    resetNewFolder();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { cancel } = this.props;
    // we don't want to close the new folder dialog if there is an error creating the new folder
    if (
      isEmpty(prevProps.newFolder.folder) &&
      !isEmpty(this.props.newFolder.folder)
    ) {
      cancel();
    }
  }

  handleCancel = () => {
    // close the dialog
    const { cancel } = this.props;
    cancel();
  };

  onChange = event => {
    // set state for name of new folder -  prevents typing an empty space to begin
    let name = event.target.value.replace(/^\s+/g, '');
    this.setState({
      newFolderName: name
    });
  };

  createNewFolder = () => {
    // creates new folder  - checks for empty name - if no folder name - we resetNewFolder with error to alert them
    // otherwise we create new folder
    // from redux createFolder(name, description, parentId, orderIndex, appType, folder) the other fields like description
    // and order index are here if we ever want to expand this
    const { createFolder, selectedFolder, resetNewFolder, rootFolderType } = this.props;
    if (this.state.newFolderName) {
      createFolder(
        this.state.newFolderName,
        '',
        selectedFolder.id,
        0,
        rootFolderType,
        selectedFolder
      );
    } else {
      resetNewFolder(null, true, 'Please enter a folder Name');
    }
  };

  renderLoader() {
    const { newFolder, classes } = this.props;
    if (newFolder.loading) {
      return (
        <div className={classes.loadingContainer}>
          <CircularProgress size={50} />
        </div>
      );
    }
  }

  render() {
    const { selectedFolder, newFolder, classes } = this.props;
    const errorMessage = newFolder.errorMessage;
    const error = newFolder.error;
    const loadingNewFolder = newFolder.loading;
    const selectedFolderName = selectedFolder.parent
      ? selectedFolder.name
      : 'My Organization';

    return (
      <Dialog
        className={classes.folderPicker}
        fullWidth
        maxWidth="md"
        open={this.props.open}
      >
        {this.renderLoader()}
        <Grid container justify="space-between" alignItems="center">
          <DialogTitle className={classes.dialogTitle}>New Folder</DialogTitle>
          <CloseIcon className={classes.closeIcon} onClick={this.handleCancel} />
        </Grid>
        <Typography className={classes.dialogSubTitle} variant="body2">
          Create folder within{' '}
          <span className={classes.folderNameSelected}>
            {selectedFolderName}
          </span>. If you want to select a different folder click
          &quot;Cancel&quot; below and select a different folder.
        </Typography>
        <DialogContent>
          <FormControl
            error={error}
            aria-describedby="name-error-text"
            fullWidth
          >
            <InputLabel>Folder Name</InputLabel>
            <Input value={this.state.newFolderName} onChange={this.onChange} />
            <FormHelperText>{errorMessage}</FormHelperText>
          </FormControl>
          <Grid container justify="flex-end" alignContent="center">
            <Button
              className={classes.button}
              onClick={this.handleCancel}
              size="large"
            >
              <Typography className={classes.cancelButton}>Cancel</Typography>
            </Button>
            <Button
              disabled={loadingNewFolder}
              className={cx(classes.button, classes.buttonSelect)}
              onClick={this.createNewFolder}
              variant="contained"
              size="large"
              color="primary"
            >
              <Typography className={classes.selectButton}>Create</Typography>
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}
