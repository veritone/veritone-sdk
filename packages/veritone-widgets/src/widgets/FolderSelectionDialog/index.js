import React from 'react';
import { isEmpty } from 'lodash';
import { bool, func, objectOf, any } from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import {CircularProgress, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, FormHelperText, FormControl, InputLabel, Input } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import WorkIcon from '@material-ui/icons/Work';
import FolderList from './FolderList';
import styles from './styles.scss';
import * as folderSelectionModule from '../../redux/modules/folderSelectionDialog';
import widget from '../../shared/widget';



@connect(
  (state) => ({
    rootFolder: folderSelectionModule.rootFolder(state),
    selectedFolder: folderSelectionModule.selectedFolder(state),
    loading: folderSelectionModule.loading(state),
    newFolder: folderSelectionModule.newFolder(state)
  }),
  {
    selectFolder: folderSelectionModule.selectFolder,
    getFolders: folderSelectionModule.getFolders,
    createFolder: folderSelectionModule.createFolder,
    resetNewFolder: folderSelectionModule.resetNewFolder,
  }
)

class FolderSelectionDialog extends React.Component {
  static propTypes = {
    open: bool,
    loading: bool,
    selectFolder: func,
    createFolder: func,
    selectedFolder: objectOf(any),
    getFolders: func,
    rootFolder: objectOf(any),
    newFolder: objectOf(any),
    onCancel: func,
    resetNewFolder: func,
    onSelect: func,
  };

  static defaultProps = {
    open: false,
  };

  state = {
    openNewFolder: false,
    newFolderName: "",
    error: true,
    errorMessage: "you can't create this many nested folders"
  }

  componentDidMount(){
    const { getFolders, resetNewFolder } = this.props
    // get root folder and subfolders of root if they exist
    getFolders();
    // clear the new folder just as safety check
    resetNewFolder();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // we don't want to close the new folder dialog if there is an error creating the new folder
    if (isEmpty(prevProps.newFolder.folder) && !isEmpty(this.props.newFolder.folder)){
      this.handleClickNewFolder()
    }
  }

  handleClickNewFolder = () => {
    // this opens and closes the new folder dialog
    const { selectFolder, selectedFolder, rootFolder, resetNewFolder } = this.props;
    // when opening newfolder dialog - default the folder selected to the root folder if they did not select one
    if(!selectedFolder.treeObjectId) {
      selectFolder(rootFolder);
    }
    // when closing new folder dialog - meaning previous state was open - reset everything to default state
    if (this.state.openNewFolder){
      resetNewFolder()
      this.setState({newFolderName: ""})
    }

    this.setState((prevState) => ({
      openNewFolder : !prevState.openNewFolder,
    }))
  }

  handleClick = () => {
    // set folder when they click on root folder
    const { selectFolder, rootFolder } = this.props;
    return selectFolder(rootFolder);
  }

  handleCancel = () => {
    // close the dialog
    this.props.onCancel();
  };

  onSelect = () => {
    // folder they have selected to add add data to will return the folder using onSelect and close the dialog
    const { rootFolder, selectedFolder, onSelect } = this.props
    // if they didn't choose a subfolder - the root folder will be selected
    let folderSelected = (!isEmpty(selectedFolder)) ? selectedFolder : rootFolder;
    onSelect(folderSelected);
    this.handleCancel();

  }

  onChange = (event) => {
    // set state for name of new folder -  prevents typing an empty space to begin
    let name  = event.target.value.replace(/^\s+/g, '')
    this.setState({
      newFolderName: name
    });
  }
;
  createNewFolder = () => {
    // creates new folder  - checks for empty name - if no folder name - we resetNewFolder with error to alert them
    // otherwise we create new folder
    // from redux createFolder(name, description, parentId, orderIndex, appType, folder) the other fields like description
    // and order index are here if we ever want to expand this
    const {createFolder, selectedFolder, resetNewFolder } = this.props;
    if (this.state.newFolderName){
      createFolder(this.state.newFolderName, "", selectedFolder.treeObjectId, 0, "cms", selectedFolder )
    } else {
      resetNewFolder(null, true, "Please enter a folder Name");
    }
  }

  renderLoader(){
    const { loading, newFolder} = this.props;
    if (loading || newFolder.loading) {
      return (
        <div className={styles.loadingContainer}>
          <CircularProgress size={50}/>
        </div>
      );
    }
  }

  render() {
    const { rootFolder, selectedFolder, newFolder, loading} = this.props;
    const errorMessage = newFolder.errorMessage;
    const error = newFolder.error;
    const loadingNewFolder = newFolder.loading
    const rootId  = rootFolder.treeObjectId;
    const selectedId = selectedFolder.treeObjectId

    if (!loading && !isEmpty(rootFolder)) {
      return (
        <Dialog className={styles.folderPicker} fullWidth maxWidth="md" open={this.props.open}>
          <Grid container justify="space-between" alignItems="center">
            <DialogTitle className={styles.dialogTitle}>Select Folder</DialogTitle>
            <CloseIcon className={styles.closeIcon} onClick = {this.handleCancel} />
          </Grid>
          <Typography className={styles.dialogSubTitle} variant="subheading">Oops - Something went Wrong! Your folders could not be loaded.</Typography>
        </Dialog>
      );
    }

    return (
      <React.Fragment >
        <Dialog className={styles.folderPicker} fullWidth maxWidth="md" open={this.props.open}>
          {this.renderLoader()}
          <Grid container justify="space-between" alignItems="center">
            <DialogTitle className={styles.dialogTitle}>Select Folder</DialogTitle>
            <CloseIcon className={styles.closeIcon} onClick = {this.handleCancel} />
          </Grid>
          <Typography className={styles.dialogSubTitle} variant="subheading">Choose a folder below to organize this data.</Typography>
          <DialogContent  className={styles.dialogContent} >
            <Grid className ={cx(styles.rootfolder, rootId === selectedId && styles.selected)} onClick={this.handleClick} container >
              <Grid item container alignContent = "center" alignItems = "center">
                <WorkIcon  className={styles.workIcon} />
                <Typography variant="title" >My Organization</Typography>
              </Grid>
              <Grid   item container alignContent="center" alignItems="center">
                <Typography className ={styles.saveText} variant="title" >Save to Root Level</Typography>
              </Grid>
            </Grid>
            <ul>
              <FolderList listId={rootId}/>
            </ul>
          </DialogContent>
          <DialogActions  style = {{minHeight: "80px", marginRight: "16px", marginLeft: "16px"}}>
            <Grid container direction = "row" justify="space-between">
              <Grid item container justify="flex-start" alignContent = "center"  xs={3}>
                <Button className = {cx(styles.button, styles.buttonNewFolder)} variant="outlined" color="primary"  onClick = {this.handleClickNewFolder} size="large">
                  <Typography className = {styles.newFolderButton}>New Folder</Typography>
                </Button>
              </Grid>
              <Grid item container justify="flex-end" alignContent = "center"  xs={9}>
                <Button  className = {styles.button} onClick = {this.handleCancel} size="large">
                  <Typography className = {styles.cancelButton} >Cancel</Typography>
                </Button>
                <Button className = {cx(styles.button, styles.buttonSelect)} onClick={this.onSelect} variant="contained" size="large" color="primary">
                  <Typography className={styles.selectButton} >Select</Typography>
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
        {/*new folder dialog*/}
        <Dialog className={styles.folderPicker} fullWidth maxWidth="md" open={this.state.openNewFolder}>
          <Grid container justify="space-between" alignItems="center">
            <DialogTitle className={styles.dialogTitle}>New Folder</DialogTitle>
            <CloseIcon className={styles.closeIcon} onClick={this.handleClickNewFolder}/>
          </Grid>
          <Typography className={styles.dialogSubTitle} variant="body2">Create folder within <span className={styles.folderNameSelected}>{(selectedFolder.parent) ? selectedFolder.name : "My Organization"}</span>. If you want to select a different folder click &quot;Cancel&quot; below and select a different folder.</Typography>
          <DialogContent>
            <FormControl
              error = {error}
              aria-describedby="name-error-text" fullWidth>
              <InputLabel>Folder Name</InputLabel>
              <Input  value={this.state.newFolderName} onChange={this.onChange} />
              <FormHelperText>{errorMessage}</FormHelperText>
            </FormControl>
            <Grid container justify="flex-end" alignContent = "center">
              <Button  className = {styles.button} onClick = {this.handleClickNewFolder} size="large">
                <Typography className = {styles.cancelButton} >Cancel</Typography>
              </Button>
              <Button disabled = {loadingNewFolder} className = {cx(styles.button, styles.buttonSelect)} onClick = {this.createNewFolder}variant="contained" size="large" color="primary">
                <Typography className={styles.selectButton} >Create</Typography>
              </Button>
            </Grid>
          </DialogContent>
        </Dialog>
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


const FolderSelectionDialogWidget = widget(FolderSelectionDialogWidgetComponent);

export { FolderSelectionDialog as default,  FolderSelectionDialogWidget};

