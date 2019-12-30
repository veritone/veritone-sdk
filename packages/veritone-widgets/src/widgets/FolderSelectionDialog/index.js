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
  DialogActions,
  Typography,
  Button
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import WorkIcon from '@material-ui/icons/Work';
import { withStyles } from '@material-ui/styles';
import FolderList from './FolderList';
import NewFolder from './NewFolder';
import styles from './styles';
import * as folderSelectionModule from '../../redux/modules/folderSelectionDialog';
import widget from '../../shared/widget';

@withStyles(styles)
@connect(
  state => ({
    rootFolder: folderSelectionModule.rootFolder(state),
    selectedFolder: folderSelectionModule.selectedFolder(state),
    loading: folderSelectionModule.loading(state),
    newFolder: folderSelectionModule.newFolder(state)
  }),
  {
    selectFolder: folderSelectionModule.selectFolder,
    getFolders: folderSelectionModule.getFolders
  }
)
class FolderSelectionDialog extends React.Component {
  static propTypes = {
    rootFolderType: string,
    open: bool,
    loading: bool,
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
    getFolders: func,
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
    onCancel: func,
    onSelect: func,
    classes: shape({ any }),
  };

  static defaultProps = {
    open: false,
    rootFolderType: ''
  };

  state = {
    openNewFolder: false
  };

  componentDidMount() {
    const { getFolders, rootFolderType } = this.props;
    // get root folder and subfolders of root if they exist
    getFolders(rootFolderType);
  }

  openNewFolderDialog = () => {
    this.setState({ openNewFolder: true });
  };

  closeNewFolderDialog = () => {
    this.setState({ openNewFolder: false });
  };

  handleClick = () => {
    // set folder when they click on root folder
    const { selectFolder, rootFolder } = this.props;
    return selectFolder(rootFolder);
  };

  handleCancel = () => {
    // close the dialog
    this.props.onCancel();
  };

  onSelect = () => {
    // folder they have selected to add add data to will return the folder using onSelect and close the dialog
    const { rootFolder, selectedFolder, onSelect } = this.props;
    // if they didn't choose a subfolder - the root folder will be selected
    let folderSelected = !isEmpty(selectedFolder) ? selectedFolder : rootFolder;
    onSelect(folderSelected);
    this.handleCancel();
  };

  renderLoader() {
    const { loading, classes } = this.props;
    if (loading) {
      return (
        <div className={classes.loadingContainer}>
          <CircularProgress size={50} />
        </div>
      );
    }
  }

  render() {
    const { rootFolder, selectedFolder, loading, rootFolderType, classes } = this.props;
    const rootId = rootFolder.treeObjectId;
    const selectedId = selectedFolder.treeObjectId;
    const idsMatch = rootId === selectedId;

    if (!loading && isEmpty(rootFolder)) {
      return (
        <Dialog
          className={classes.folderPicker}
          fullWidth
          maxWidth="md"
          open={this.props.open}
        >
          <Grid container justify="space-between" alignItems="center">
            <DialogTitle className={classes.dialogTitle}>
              Select Folder
            </DialogTitle>
            <CloseIcon
              className={classes.closeIcon}
              onClick={this.handleCancel}
            />
          </Grid>
          <Typography className={classes.dialogSubTitle} variant="subtitle1">
            Oops - Something went Wrong! Your folders could not be loaded.
          </Typography>
        </Dialog>
      );
    }

    return (
      <React.Fragment>
        <Dialog
          className={classes.folderPicker}
          fullWidth
          maxWidth="md"
          open={this.props.open}
        >
          {this.renderLoader()}
          <Grid container justify="space-between" alignItems="center">
            <DialogTitle className={classes.dialogTitle}>
              Select Folder
            </DialogTitle>
            <CloseIcon
              className={classes.closeIcon}
              onClick={this.handleCancel}
            />
          </Grid>
          <Typography className={classes.dialogSubTitle} variant="subtitle1">
            Choose a folder below to organize this data.
          </Typography>
          <DialogContent className={classes.dialogContent}>
            <Grid
              className={cx(classes.rootfolder, idsMatch && classes.selected)}
              onClick={this.handleClick}
              container
            >
              <Grid item container alignContent="center" alignItems="center">
                <WorkIcon className={classes.workIcon} />
                <Typography variant="h6">My Organization</Typography>
              </Grid>
              <Grid item container alignContent="center" alignItems="center">
                <Typography className={classes.saveText} variant="h6">
                  Save to Root Level
                </Typography>
              </Grid>
            </Grid>
            <ul>
              <FolderList listId={rootId} />
            </ul>
          </DialogContent>
          <DialogActions
            style={{
              minHeight: '80px',
              marginRight: '16px',
              marginLeft: '16px'
            }}
          >
            <Grid container direction="row" justify="space-between">
              <Grid
                item
                container
                justify="flex-start"
                alignContent="center"
                xs={3}
              >
                <Button
                  className={cx(classes.button, classes.buttonNewFolder)}
                  variant="outlined"
                  color="primary"
                  onClick={this.openNewFolderDialog}
                  size="large"
                >
                  <Typography className={classes.newFolderButton}>
                    New Folder
                  </Typography>
                </Button>
              </Grid>
              <Grid
                item
                container
                justify="flex-end"
                alignContent="center"
                xs={9}
              >
                <Button
                  className={classes.button}
                  onClick={this.handleCancel}
                  size="large"
                >
                  <Typography className={classes.cancelButton}>
                    Cancel
                  </Typography>
                </Button>
                <Button
                  className={cx(classes.button, classes.buttonSelect)}
                  onClick={this.onSelect}
                  variant="contained"
                  size="large"
                  color="primary"
                >
                  <Typography className={classes.selectButton}>
                    Select
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
        {this.state.openNewFolder ? (
          <NewFolder
            rootFolderType={rootFolderType}
            open={this.state.openNewFolder}
            cancel={this.closeNewFolderDialog}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

class FolderSelectionDialogWidgetComponent extends React.Component {
  static propTypes = {
    onCancel: func
  };

  state = {
    open: false
  };

  open = () => {
    this.setState({
      open: true
    });
  };

  handleCancel = () => {
    this.props.onCancel();
    this.setState({
      open: false
    });
  };

  render() {
    return (
      <FolderSelectionDialog
        open={this.state.open}
        {...this.props}
        onCancel={this.handleCancel}
      />
    );
  }
}

const FolderSelectionDialogWidget = widget(
  FolderSelectionDialogWidgetComponent
);

export { FolderSelectionDialog as default, FolderSelectionDialogWidget };
