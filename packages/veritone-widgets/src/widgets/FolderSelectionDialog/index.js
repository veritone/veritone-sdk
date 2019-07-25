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
    getFolders();
    resetNewFolder();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (isEmpty(prevProps.newFolder.folder) && !isEmpty(this.props.newFolder.folder)){
      this.handleClickNewFolder()
    }
  }

  handleClickNewFolder = () => {
    const { selectFolder, selectedFolder, rootFolder, resetNewFolder } = this.props;
    if(!selectedFolder.treeObjectId) {
      selectFolder(rootFolder);
    }
    if (this.state.openNewFolder){
      resetNewFolder()
      this.setState({newFolderName: ""})
    }
    this.setState((prevState) => ({
      openNewFolder : !prevState.openNewFolder,
    }))
  }

  handleClick = () => {
    const { selectFolder, rootFolder } = this.props;
    return selectFolder(rootFolder);
  }

  handleCancel = () => {
    this.props.onCancel();
  };

  onSelect = () => {
    const { rootFolder, selectedFolder, onSelect } = this.props
    let folderSelected = (!isEmpty(selectedFolder)) ? selectedFolder : rootFolder;
    onSelect(folderSelected);
    this.handleCancel();

  }

  onChange = (event) => {
    let name  = event.target.value.replace(/^\s+/g, '')
    this.setState({
      newFolderName: name
    });
  }
;
  createNewFolder = () => {
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
    const { rootFolder, selectedFolder, newFolder} = this.props;
    const errorMessage = newFolder.errorMessage;
    const error = newFolder.error;
    const loadingNewFolder = newFolder.loading
    const rootId  = rootFolder.treeObjectId;
    const selectedId = selectedFolder.treeObjectId

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

        <Dialog className={styles.folderPicker} fullWidth maxWidth="md" open={this.state.openNewFolder}>
          <Grid container justify="space-between" alignItems="center">
            <DialogTitle className={styles.dialogTitle}>New Folder</DialogTitle>
            <CloseIcon className={styles.closeIcon} onClick={this.handleClickNewFolder}/>
          </Grid>
          <Typography className={styles.dialogSubTitle} variant="body2">Create folder within <span className={styles.folderNameSelected}>{selectedFolder.name}</span>. If you want to select a different folder click &quot;Cancel&quot; below and select a different folder.</Typography>
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

