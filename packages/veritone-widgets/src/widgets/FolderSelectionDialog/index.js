import React from 'react';
import { bool, func, object, objectOf, any, arrayOf, string} from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
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
    folderList: folderSelectionModule.folderList(state),
    
  }),
  {
    selectFolder: folderSelectionModule.selectFolder,
    getFolders: folderSelectionModule.getFolders
  },
  null,
  { withRef: true }
)

class FolderSelectionDialog extends React.Component {
  static propTypes = {
    open: bool,
    selectFolder: func,
    selectedFolder: string,
    getFolders: arrayOf(object),
    rootFolder: objectOf(any),
    onCancel: func,
    folderList: arrayOf(object)
  };

  static defaultProps = {
    open: false,
  };
  
  componentDidMount(){
    this.props.getFolders();
  }

  handleClick = () => {
    const { selectFolder, rootFolder } = this.props;
    selectFolder(rootFolder.treeObjectId);

  }
  
  handleCancel = () => {
    this.props.onCancel();
   
  };

  render() {
    console.log(this.props)
    const { rootFolder, selectedFolder, folderList } = this.props;
    
    
    if(!rootFolder) {
      return <div/>;
    }

    return (
     
          <Dialog  fullWidth="md" maxWidth="md" open={this.props.open}>
            <Grid container justify="space-between" alignItems="center">
              <DialogTitle className={styles.dialogTitle}>Select Folder</DialogTitle>
              <CloseIcon className={styles.closeIcon} onClick = {this.handleCancel} />
            </Grid>
            <Typography className={styles.dialogSubTitle} variant="body">Choose a folder below to organize this data.</Typography>
            <DialogContent  className={styles.dialogContent} >
              <Grid className ={cx(styles.rootfolder, rootFolder.treeObjectId === selectedFolder && styles.selected)} onClick={this.handleClick} container >
                <Grid item container alignContent = "center" alignItems = "center">
                  <WorkIcon  className={styles.workIcon} />
                  <Typography variant="title" >My Organization</Typography>
                </Grid>
                <Grid   item container alignContent="center" alignItems="center">
                  <Typography className ={styles.saveText} variant="title" >Save to Root Level</Typography>
                </Grid>
              </Grid> 
              <ul>
                <FolderList list={folderList}/>
              </ul>
            </DialogContent> 
            <DialogActions  style = {{minHeight: "80px", marginRight: "16px", marginLeft: "16px"}}>
              <Grid container direction = "row" justify="space-between" xs={12}>
                <Grid item container justify="flex-start" alignContent = "center"  xs={3}>
                  <Button className = {cx(styles.button, styles.buttonNewFolder)} variant="outlined" color="primary"  onClick = {this.handleCancel} size="large">
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

