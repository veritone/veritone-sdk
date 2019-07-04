import React from 'react';
import { get } from 'lodash';
import { bool, objectOf, any } from 'prop-types';
// import { connect } from 'react-redux';
// import { withPropsOnChange } from 'recompose';
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
// import styles from './styles.scss';
//import * as filePickerModule from '../../redux/modules/filePicker';
// import { guid } from '../../shared/util';
import widget from '../../shared/widget';
// import { yellow } from '@material-ui/core/colors';

// provide id prop on mount
// @withPropsOnChange([], ({ id }) => ({
//   id: id || guid()
// }))
// @connect(
//   (state, { id }) => ({
//     open: filePickerModule.isOpen(state, id),
//     pickerState: filePickerModule.state(state, id),
//     percentByFiles: filePickerModule.percentByFiles(state, id),
//     success: filePickerModule.didSucceed(state, id),
//     error: filePickerModule.didError(state, id),
//     warning: filePickerModule.didWarn(state, id),
//     statusMessage: filePickerModule.statusMessage(state, id)
//   }),
//   {
//     pick: filePickerModule.pick,
//     endPick: filePickerModule.endPick,
//     abortRequest: filePickerModule.abortRequest,
//     uploadRequest: filePickerModule.uploadRequest,
//     retryRequest: filePickerModule.retryRequest,
//     retryDone: filePickerModule.retryDone
//   },
//   (stateProps, dispatchProps, ownProps) => ({
//     ...ownProps,
//     ...stateProps,
//     ...dispatchProps,
//     // allow widget version of FilePicker to override uploadRequest
//     uploadRequest: ownProps.uploadRequest || dispatchProps.uploadRequest,
//     retryRequest: ownProps.retryRequest || dispatchProps.retryRequest,
//     retryDone: ownProps.retryDone || dispatchProps.retryDone,
//     abortRequest: ownProps.abortRequest || dispatchProps.abortRequest
//   })
// )
class FolderSelectionDialog extends React.Component {
  static propTypes = {
    //id: string.isRequired,
    open: bool,
    data: objectOf(any)
  };

  static defaultProps = {
    open: true,
  };

  handleClick = () => {
   
    console.log(this.props)
  }
  
 

  render() {
    console.log("props", this.props)
    const { data } = this.props;
    console.log(data);
    let list = get(data, `data.createRootFolders[0].childFolders.records`)
   
    return (
     
          <Dialog  fullWidth="md" maxWidth="md" open={this.props.open}>
            <Grid container justify="space-between" alignItems="center">
              <DialogTitle >Select Folder</DialogTitle>
              <CloseIcon style={{marginRight: "20px"}}/>
            </Grid>
            <DialogContent  style = {{ border: "2px solid #eee", marginRight: "20px", marginLeft: "20px", padding: "0 0 0 0 "}} >
              <Grid onClick={this.handleClick} container spacing={0}>
                <Grid  item container  alignContent="center" alignItems="center" >
                  <WorkIcon   style ={{color: "#2195F3", margin: "10px"}}/>
                  <Typography variant="title" >My Organization</Typography>
                </Grid>
                <Grid  style ={{ marginLeft: "13px"}} item container alignContent="center" alignItems="center" >
                  <PublishIcon   style ={{ margin: "10px"}}/>
                  <Typography variant="body2" >Save to Root Level</Typography>
                </Grid>
              </Grid> 
              
              <FolderList list={list}/>
            </DialogContent> 
            <DialogActions>
              <Button size="large" color="primary">
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

const FolderSelectionDialogWidget = widget(FolderSelectionDialog);

export { FolderSelectionDialogWidget};

