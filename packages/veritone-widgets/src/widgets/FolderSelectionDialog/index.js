import React from 'react';
import { bool, func, objectOf, any } from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Grid, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@material-ui/core';

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
    subFolderList: folderSelectionModule.subFolderList(state)
  }),
  {
    selectFolder: folderSelectionModule.selectFolder,
    getFolders: folderSelectionModule.getFolders,
    createFolder: folderSelectionModule.createFolder,
    getAllSubFolders: folderSelectionModule.getAllSubFolders
  },
  null,
  { withRef: true }
)

class FolderSelectionDialog extends React.Component {
  static propTypes = {
    open: bool,
    selectFolder: func,
    subFolderList: objectOf(any),
    createFolder: func,
    selectedFolder: objectOf(any),
    getFolders: func,
    rootFolder: objectOf(any),
    getAllSubFolders: func,
    onCancel: func,
  };

  static defaultProps = {
    open: false,
  };

  state = {
    openNewFolder: false,
    newFolderName: "",
  }

  componentDidMount(){
    this.props.getFolders();
  }

  handleClickNewFolder = () => {
    const { selectFolder, selectedFolder, rootFolder } = this.props;
    if(!selectedFolder.treeObjectId) {
      selectFolder(rootFolder);
    }

    this.setState((prevState) => ({
      openNewFolder : !prevState.openNewFolder,
    }))


  }

  handleClick = () => {
    const { selectFolder, rootFolder } = this.props;
    selectFolder(rootFolder);

  }

  handleCancel = () => {
    this.props.onCancel();

  };

  onChange = (event) => {
    this.setState({
      newFolderName: event.target.value
    });
  }
;
  createNewFolder = () => {
    const {createFolder, selectedFolder } = this.props;
    if (this.state.newFolderName){
      createFolder(this.state.newFolderName, "", selectedFolder.treeObjectId, 0, "cms", selectedFolder )
    } else {
      alert("Please enter a folder name");
    }

    this.handleClickNewFolder();


  }

  renderSubFolders() {
    let {subFolderList, rootFolder} = this.props;

    let property  = rootFolder.treeObjectId;

    let records = subFolderList[property]

    if (records){
      return <FolderList list={records}/>;
    }
  }


  render() {
    const { rootFolder, selectedFolder} = this.props;


    if(!rootFolder) {
      return <div/>;
    }

    return (
      <React.Fragment >
        <Dialog className={styles.folderPicker} fullWidth maxWidth="md" open={this.props.open}>
          <Grid container justify="space-between" alignItems="center">
            <DialogTitle className={styles.dialogTitle}>Select Folder</DialogTitle>
            <CloseIcon className={styles.closeIcon} onClick = {this.handleCancel} />
          </Grid>
          <Typography className={styles.dialogSubTitle} variant="subheading">Choose a folder below to organize this data.</Typography>
          <DialogContent  className={styles.dialogContent} >
            <Grid className ={cx(styles.rootfolder, rootFolder.treeObjectId === selectedFolder.treeObjectId && styles.selected)} onClick={this.handleClick} container >
              <Grid item container alignContent = "center" alignItems = "center">
                <WorkIcon  className={styles.workIcon} />
                <Typography variant="title" >My Organization</Typography>
              </Grid>
              <Grid   item container alignContent="center" alignItems="center">
                <Typography className ={styles.saveText} variant="title" >Save to Root Level</Typography>
              </Grid>
            </Grid>
            <ul>
              {this.renderSubFolders()}
            </ul>
          </DialogContent>
          <DialogActions  style = {{minHeight: "80px", marginRight: "16px", marginLeft: "16px"}}>
            <Grid container direction = "row" justify="space-between" xs={12}>
              <Grid item container justify="flex-start" alignContent = "center"  xs={3}>
                <Button className = {cx(styles.button, styles.buttonNewFolder)} variant="outlined" color="primary"  onClick = {this.handleClickNewFolder} size="large">
                  <Typography className = {styles.newFolderButton}>New Folder</Typography>
                </Button>
              </Grid>
              <Grid item container justify="flex-end" alignContent = "center"  xs={9}>
                <Button  className = {styles.button} onClick = {this.handleCancel} size="large">
                  <Typography className = {styles.cancelButton} >Cancel</Typography>
                </Button>
                <Button className = {cx(styles.button, styles.buttonSelect)} variant="contained" size="large" color="primary">
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
          <Typography className={styles.dialogSubTitle} variant="body2">Create folder within <span className={styles.folderNameSelected}>{selectedFolder.name}</span>. If you want to select a different folder click "Cancel" below and select a different folder.</Typography>
          <DialogContent>
            <div style={{paddingTop: "10px", paddingBottom: "20px"}}>
              <div style={{
                transform: 'translate(10px, -10px) scale(0.75)',
                fontSize: '17px',
                color: 'rgba(0, 0, 0, 0.54)',
                position: 'absolute',
                paddingRight:'5px',
                paddingLeft: '2px',
                backgroundColor:'#fff'
              }}
              >
                Folder Name
              </div>
              <div
                style={{
                  border: '1px solid #515154',
                  padding: '18.5px 14px',
                  borderRadius: '7px',
                }}
              >
                <input value={this.state.newFolderName} onChange = {this.onChange}/>
              </div>
            </div>
            <Grid container justify="flex-end" alignContent = "center">
              <Button  className = {styles.button} onClick = {this.handleClickNewFolder} size="large">
                <Typography className = {styles.cancelButton} >Cancel</Typography>
              </Button>
              <Button className = {cx(styles.button, styles.buttonSelect)} onClick = {this.createNewFolder}variant="contained" size="large" color="primary">
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

