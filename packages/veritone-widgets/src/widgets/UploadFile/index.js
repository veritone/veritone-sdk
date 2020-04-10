import React, { Fragment } from 'react';
import { noop } from 'lodash';
import { bool, func, oneOf, number, string, arrayOf, shape } from 'prop-types';
import { connect } from 'react-redux';
import { withPropsOnChange } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import {
  FilePicker as FilePickerComponent,
  FileProgressDialog,
  UploadFileOverview
} from 'veritone-react-common';

import * as filePickerModule from '../../redux/modules/uploadFile';
import { guid } from '../../shared/util';
import widget from '../../shared/widget';

import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { withStyles } from '@material-ui/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloudUpload from '@material-ui/icons/CloudUpload';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import Grid from "@material-ui/core/Grid";

import styles from './styles.scss';
import ListFileUpload from './listFile';
import EditFileUpload from './editFile';
import ListEngine from './listEngine';
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" className={styles.title}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={styles.iconClose} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: 10,
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: 10,
  },
}))(MuiDialogActions);

@withStyles(styles)
// provide id prop on mount
@withPropsOnChange([], ({ id }) => ({
  id: id || guid()
}))
@connect(
  (state, { id }) => ({
    open: filePickerModule.isOpen(state, id),
    pickerState: filePickerModule.state(state, id),
    percentByFiles: filePickerModule.percentByFiles(state, id),
    success: filePickerModule.didSucceed(state, id),
    error: filePickerModule.didError(state, id),
    warning: filePickerModule.didWarn(state, id),
    statusMessage: filePickerModule.statusMessage(state, id),
    isShowListFile: filePickerModule.isShowListFile(state, id),
    uploadResult: filePickerModule.uploadResult(state, id),
    checkedFile: filePickerModule.checkedFile(state, id),
    isShowEditFileUpload: filePickerModule.isShowEditFileUpload(state, id)
  }),
  {
    pick: filePickerModule.pick,
    endPick: filePickerModule.endPick,
    abortRequest: filePickerModule.abortRequest,
    uploadRequest: filePickerModule.uploadRequest,
    retryRequest: filePickerModule.retryRequest,
    retryDone: filePickerModule.retryDone,
    onSelectionChange: filePickerModule.onSelectionChange,
    removeFileUpload: filePickerModule.removeFileUpload,
    showEditFileUpload: filePickerModule.showEditFileUpload,
    hideEditFileUpload: filePickerModule.hideEditFileUpload
  },
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    // allow widget version of FilePicker to override uploadRequest
    uploadRequest: ownProps.uploadRequest || dispatchProps.uploadRequest,
    retryRequest: ownProps.retryRequest || dispatchProps.retryRequest,
    retryDone: ownProps.retryDone || dispatchProps.retryDone,
    abortRequest: ownProps.abortRequest || dispatchProps.abortRequest
  })
)

class FilePicker extends React.Component {
  static propTypes = {
    id: string.isRequired,
    open: bool,
    pick: func,
    endPick: func,
    abortRequest: func,
    uploadRequest: func,
    retryRequest: func,
    retryDone: func,
    pickerState: oneOf(['selecting', 'uploading', 'complete']),
    percentByFiles: arrayOf(shape({
      key: string.isRequired,
      value: shape({
        name: string,
        size: number,
        type: string,
        percent: number
      }).isRequired
    })),
    success: bool,
    error: bool,
    warning: bool,
    statusMessage: string,
    renderButton: func,
    onPickCancelled: func,
    onPick: func,
    height: number,
    width: number
  };

  static defaultProps = {
    open: false,
    onPickCancelled: noop,
    onPick: noop,
    percentByFiles: [],
    height: 450,
    width: 600
  };
  state = {
    openUpload: false,
    activeStep: 0,
    skipped: new Set(),
    currentScreen: 'overviewUpload',
    uploadResultSelected: [],
    libraries: [
      'libraries'
    ],
    engines: [
      {
        title: 'TRANSCRIPTION',
        des: 'Convert the spoken word into readable text'
      },
      {
        title: 'SENTIMENT',
        des: 'Infer the sentiment or emotion being emitted in media'
      },
      {
        title: 'FINGERPRINT',
        des: 'Find the same audio by using audio fingerprints'
      },
      {
        title: 'FACIAL DETECTION',
        des: 'Detect and Identify multiple faces within rich media content'
      },
      {
        title: 'TRANSCRIPTION',
        des: 'Convert the spoken word into readable text'
      },
      {
        title: 'SENTIMENT',
        des: 'Infer the sentiment or emotion being emitted in media'
      },
      {
        title: 'FINGERPRINT',
        des: 'Find the same audio by using audio fingerprints'
      },
      {
        title: 'FACIAL DETECTION',
        des: 'Detect and Identify multiple faces within rich media content'
      },
    ]
  }

  handlePick = () => {
    this.props.pick(this.props.id);
    this.setState({ currentScreen: 'selectFile' })
  };

  cancel = () => {
    this.props.endPick(this.props.id);
    this.props.onPickCancelled();
    this.setState({ currentScreen: 'overviewUpload' })
  };

  onFilesSelected = files => {
    this.props.uploadRequest(this.props.id, files, this.props.onPick);
  };

  renderPickerDialog = () => {
    return (
      <Dialog open={this.props.open}>
        <FilePickerComponent
          {...this.props}
          onRequestClose={this.cancel}
          onPickFiles={this.onFilesSelected}
        />
      </Dialog>
    );
  };

  handleRetryDone = () => {
    const {
      id,
      onPick,
      retryDone
    } = this.props;
    retryDone && retryDone(id, onPick);
  };

  handleRetry = () => {
    const {
      id,
      retryRequest,
      onPick
    } = this.props;
    retryRequest && retryRequest(id, onPick);
  };

  handleAbort = fileKey => {
    const { id, abortRequest } = this.props;
    abortRequest && abortRequest(id, fileKey);
  }

  renderProgressDialog = () => {
    let completeStatus = {
      [this.props.success]: 'success',
      [this.props.error]: 'failure',
      [this.props.warning]: 'warning'
    }[true];

    return (
      <Dialog open={this.props.open}>
        <FileProgressDialog
          height={this.props.height}
          width={this.props.width}
          onClose={this.cancel}
          percentByFiles={this.props.percentByFiles}
          progressMessage={this.props.statusMessage}
          handleAbort={this.handleAbort}
          retryRequest={this.handleRetry}
          onRetryDone={this.handleRetryDone}
          completeStatus={completeStatus}
        />
      </Dialog>
    );
  };
  handleOpen = () => {
    this.setState({
      openUpload: true
    })
  }

  handleClose = () => {
    this.setState({
      openUpload: false
    })
  };

  getSteps = () => {
    return ['File Upload', 'Processing', 'Content Templates', 'Customize'];
  }
  isStepOptional = step => {
    return step === 1;
  };
  handleNext = () => {
    const { skipped, activeStep } = this.state;
    let newSkipped = skipped;
    this.setState(prevActiveStep => ({
      ...prevActiveStep,
      activeStep: activeStep + 1,
      skipped: newSkipped
    }))
  };
  handleBack = () => {
    const { activeStep } = this.state;
    this.setState(prevActiveStep => ({
      ...prevActiveStep,
      activeStep: activeStep - 1
    }))
  };

  overviewUploadFile = () => {
    return (
      <Fragment>
        <div className={styles['upload-header']}>
          <div className={styles['icon-upload-body']}>
            <CloudUpload />
          </div>
          <div className={styles['title-upload']} onClick={this.handlePick} >
            Upload Media
          </div>
          <div className={styles['title-select']}>
            Select Video, Audio, Image, or Text files to upload
          </div>
        </div>
        <div className={styles['upload-foolter']}>
          <span>Recommended file formats:</span>
          <span>.mp4, .mp3, .jpg, and .png</span>
        </div>
      </Fragment>
    )
  }
  listFile = () => {
    return <Fragment />
  }
  handleToggle = (event) => {
    const key = event.currentTarget.getAttribute('data-key');
    const type = event.currentTarget.getAttribute('data-type');
    const { id, onSelectionChange } = this.props;
    onSelectionChange(id, Number(key), type);
  }
  handleRemoveFile = () => {
    const { id, removeFileUpload, checkedFile } = this.props;
    removeFileUpload(id, checkedFile);
  }
  handleEditFile = () => {
    const { id, showEditFileUpload, checkedFile, uploadResult } = this.props;
    const uploadResultSelected = uploadResult.filter((item, key) => checkedFile.includes(key));
    this.setState({ uploadResultSelected })
    showEditFileUpload(id);
  }
  handleCloseEditFileUpload = () => {
    const { id, hideEditFileUpload } = this.props;
    hideEditFileUpload(id);
  }
  render() {
    const pickerComponent = {
      overview: this.overviewUploadFile,
      selecting: this.renderPickerDialog,
      uploading: this.renderProgressDialog,
      complete: this.listFile
    }[this.props.pickerState]();
    const steps = this.getSteps();
    const { classes, isShowListFile, uploadResult, checkedFile, isShowEditFileUpload } = this.props;
    const { activeStep, uploadResultSelected, libraries, engines } = this.state;
    console.log('isShowListFile', isShowListFile)
    return (
      <Fragment>
        <Dialog fullScreen open={this.state.openUpload} onClose={this.handleClose}>
          <DialogTitle onClose={this.handleClose} style={{ background: '#1976d2' }}>
            Upload
          </DialogTitle>
          <DialogContent dividers>
            <div className={classes.root}>
              <Stepper activeStep={this.state.activeStep}>
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </div>

            <div className={styles.main}>
              {
                activeStep === 0 && (
                  <div>
                    <div className={styles['main-header']}>
                      <List>
                        <ListItem className={styles['icon-upload-header']}>
                          <ListItemIcon>
                            <CloudUpload />
                          </ListItemIcon>
                          <ListItemText primary="Upload Media" />
                          <ListItemSecondaryAction className={styles['action-upload-header']}>
                            <IconButton onClick={this.handlePick}>
                              <Add />
                            </IconButton>
                            <IconButton onClick={this.handleEditFile} disabled={!checkedFile.length}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={this.handleRemoveFile} disabled={!checkedFile.length}>
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </div>
                    <div className={styles['main-body']}>
                      {
                        pickerComponent
                      }
                      {
                        isShowListFile &&
                        <ListFileUpload
                          data={uploadResult}
                          checked={checkedFile}
                          handleToggle={this.handleToggle}
                          indeterminate={checkedFile.length && checkedFile.length < uploadResult.length}
                          checkedAll={checkedFile.length}
                        />
                      }
                    </div>
                  </div>
                )
              }
            </div>
            {
              activeStep === 1 && (
                <Grid container spacing={3} style={{ marginTop: 10 }}>
                  {
                    engines.map(item => {
                      return (
                        <Grid item xs={3}>
                          <ListEngine title={item.title} des={item.des} libraries={libraries} />
                        </Grid>
                      )
                    })
                  }

                </Grid>
              )
            }




          </DialogContent>
          <DialogActions>
            <Button
              disabled={activeStep === 0}
              onClick={this.handleBack}
              className={classes.button}
            >
              Back
              </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={this.handleNext}
              className={classes.button}
              disabled={!uploadResult.length}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </DialogActions>
        </Dialog>

        <EditFileUpload
          open={isShowEditFileUpload}
          title={'Edit Media'}
          handleClose={this.handleCloseEditFileUpload}
          data={uploadResultSelected}
        />
        {/* 
<UploadFileOverview title={'Upload Media'} handlePick={this.handlePick} /> */}
        {this.props.renderButton &&
          this.props.renderButton({ handlePickFiles: this.handlePick, handleOpenModal: this.handleOpen })}
      </Fragment>
    );
  }
}

@connect(
  null,
  {
    pick: filePickerModule.pick,
    endPick: filePickerModule.endPick,
    uploadRequest: filePickerModule.uploadRequest,
    retryRequest: filePickerModule.retryRequest,
    retryDone: filePickerModule.retryDone,
    abortRequest: filePickerModule.abortRequest
  },
  null,
  { forwardRef: true }
)
class FilePickerWidgetComponent extends React.Component {
  static propTypes = {
    _widgetId: string.isRequired,
    pick: func.isRequired,
    endPick: func.isRequired,
    uploadRequest: func.isRequired,
    retryRequest: func.isRequired,
    retryDone: func.isRequired,
    abortRequest: func.isRequired
  };

  pickCallback = noop;
  componentPickCallback = noop;

  pick = (callback = noop) => {
    this.pickCallback = callback;
    this.props.pick(this.props._widgetId);
  };

  cancel = () => {
    this.props.endPick(this.props._widgetId);
    this.callCancelledCallback();
  };

  callCancelledCallback = () => {
    this.pickCallback(null, { cancelled: true });
  };

  handleUploadRequest = (id, files) => {
    this.props.uploadRequest(id, files, this.pickCallback);
  };

  handleRetryRequest = id => {
    this.props.retryRequest(id, this.pickCallback);
  }

  handleRetryDone = id => {
    this.props.retryDone(id, this.pickCallback);
  }

  render() {
    return (
      <FilePicker
        id={this.props._widgetId}
        {...this.props}
        uploadRequest={this.handleUploadRequest}
        retryRequest={this.handleRetryRequest}
        retryDone={this.handleRetryDone}
        onPickCancelled={this.callCancelledCallback}
      />
    );
  }
}

const FilePickerWidget = widget(FilePickerWidgetComponent);
export { FilePicker as default, FilePickerWidget };
