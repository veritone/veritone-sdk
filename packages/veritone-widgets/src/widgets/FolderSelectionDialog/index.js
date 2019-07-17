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
import PublishIcon from '@material-ui/icons/Publish';
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
              <DialogTitle >Select Folder</DialogTitle>
              <CloseIcon onClick = {this.handleCancel} style={{marginRight: "20px"}}/>
            </Grid>
            <DialogContent  style = {{ border: "2px solid #eee", marginRight: "20px", marginLeft: "20px", padding: "0 0 0 0"}} >
              <Grid className ={cx(styles.rootfolder, rootFolder.treeObjectId === selectedFolder && styles.selected)} onClick={this.handleClick} container spacing={0}>
                <Grid item container alignContent = "center" alignItems = "center">
                  <WorkIcon   style ={{color: "#2195F3", margin: "10px"}} />
                  <Typography variant="title" >My Organization</Typography>
                </Grid>
                <Grid  style ={{ marginLeft: "13px"}} item container alignContent="center" alignItems="center">
                  <PublishIcon   style ={{ margin: "10px"}}/>
                  <Typography variant="body2" >Save to Root Level</Typography>
                </Grid>
              </Grid> 
              
              <FolderList list={folderList}/>
            </DialogContent> 
            <DialogActions>
              <Button onClick = {this.handleCancel} size="large" color="primary">
                CANCEL
              </Button>
              <Button  size="large" color="primary">
                SELECT
              </Button>
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

