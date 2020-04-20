import React, { Fragment } from 'react';
import { noop, debounce } from 'lodash';
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
import * as uploadFileAction from '../../redux/modules/uploadFile/actions';
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
import Forward from '@material-ui/icons/Forward';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import Security from '@material-ui/icons/Security';
import Save from '@material-ui/icons/Save';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import styles from './styles';
import ListFileUpload from './listFile';
import EditFileUpload from './editFile';
import ListEngine from './listEngine';
import SaveTemplate from './saveTemplate';

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography {...other}>
      <Typography variant="h6" className={classes.title}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.iconClose} onClick={onClose}>
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
    isShowEditFileUpload: filePickerModule.isShowEditFileUpload(state, id),
    engineCategories: filePickerModule.engineCategories(state, id),
    librariesByCategories: filePickerModule.librariesByCategories(state, id),
    engineByCategories: filePickerModule.engineByCategories(state, id),
    currentEngineCategory: filePickerModule.currentEngineCategory(state, id),
    enginesSelected: filePickerModule.enginesSelected(state, id),
    isShowModalSaveTemplate: filePickerModule.isShowModalSaveTemplate(state, id),
    templates: filePickerModule.templates(state, id)
  }),
  {
    pick: uploadFileAction.pick,
    endPick: uploadFileAction.endPick,
    abortRequest: uploadFileAction.abortRequest,
    uploadRequest: uploadFileAction.uploadRequest,
    retryRequest: uploadFileAction.retryRequest,
    retryDone: uploadFileAction.retryDone,
    onSelectionChange: uploadFileAction.onSelectionChange,
    removeFileUpload: uploadFileAction.removeFileUpload,
    showEditFileUpload: uploadFileAction.showEditFileUpload,
    hideEditFileUpload: uploadFileAction.hideEditFileUpload,
    fetchEngineCategories: uploadFileAction.fetchEngineCategories,
    fetchLibraries: uploadFileAction.fetchLibraries,
    onChangeEngine: uploadFileAction.onChangeEngine,
    addEngine: uploadFileAction.addEngine,
    removeEngine: uploadFileAction.removeEngine,
    searchEngine: uploadFileAction.searchEngine,
    showModalSaveTemplate: uploadFileAction.showModalSaveTemplate,
    hideModalSaveTemplate: uploadFileAction.hideModalSaveTemplate,
    saveTemplate: uploadFileAction.saveTemplate,
    fetchTemplates: uploadFileAction.fetchTemplates,
    onChangeTemplate: uploadFileAction.onChangeTemplate
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
    width: number,
    fetchEngineCategories: func
  };

  static defaultProps = {
    open: false,
    onPickCancelled: noop,
    onPick: noop,
    percentByFiles: [],
    height: 450,
    width: 600
  };
  constructor(props) {
    super(props);
    this.onChangeTemplateName = debounce(this.onChangeTemplateName, 500);
  }
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
    ],
    showAdvancedCognitive: false,
    templateName: '',
    currentTemplate: 0
  }

  componentDidMount() {
    const { id, fetchEngineCategories, fetchLibraries, fetchTemplates } = this.props;
    // fetchEngineCategories(id);
    fetchLibraries(id);
    fetchTemplates(id);
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
    const { classes } = this.props;
    return (
      <Fragment>
        <div className={classes.uploadHeader}>
          <div className={classes.iconUploadBody}>
            <CloudUpload />
          </div>
          <div className={classes.titleUpload} onClick={this.handlePick} >
            Upload Media
          </div>
          <div className={classes.titleSelect}>
            Select Video, Audio, Image, or Text files to upload
          </div>
        </div>
        <div className={classes.uploadFoolter}>
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
  handleShowAdvancedCognitive = () => {
    const { showAdvancedCognitive } = this.state;
    this.setState({ showAdvancedCognitive: !showAdvancedCognitive })
  }
  handleChangeEngine = event => {
    const { id, onChangeEngine } = this.props;
    onChangeEngine(id, event.target.value);
  }

  renderLogoEngine = (src, showSecurity, type) => {
    const { classes } = this.props;
    return (
      <div className={type === 'header' ? classes.iconHeaderEngines : type === 'content' ? classes.iconContentEngines : classes.iconHeaderSelectedEngines}>
        {
          showSecurity && (
            <Security />
          )
        }
        {
          src && (
            <img
              src={src}
              width="100"
              height="50"
            />
          )
        }
      </div>
    )
  }
  handleAddEngine = (event) => {
    const { id, addEngine } = this.props;
    const engineId = event.currentTarget.getAttribute('data-id');
    addEngine(id, engineId);
  }
  handleRemoveEngine = (event) => {
    const engineId = event.currentTarget.getAttribute('data-id');
    const { id, removeEngine } = this.props;
    removeEngine(id, engineId)
  }
  handleSearchEngine = (event) => {
    const { id, searchEngine } = this.props;
    const engineName = event.target.value;
    searchEngine(id, engineName);
  }
  handleShowModalSaveTemplate = (event) => {
    const { id, showModalSaveTemplate } = this.props;
    showModalSaveTemplate(id, true);
  }
  handleHideModalSaveTemplate = (event) => {
    const { id, hideModalSaveTemplate } = this.props;
    hideModalSaveTemplate(id, false);
  }
  handleSaveTemplate = (event) => {
    const { templateName } = this.state;
    const { id, saveTemplate } = this.props;
    saveTemplate(id, templateName);
  }
  hanldeOnChangeTemPlate = (event) => {
    this.onChangeTemplateName(event.target.value)
  }
  onChangeTemplateName = (templateName) => {
    this.setState({ templateName })
  }
  handleChangeTemplates = event => {
    const templateId  = event.target.value;
    const { id, onChangeTemplate } = this.props;
    this.setState({ currentTarget: templateId });
    onChangeTemplate(id, templateId)
  }
  render() {
    const pickerComponent = {
      overview: this.overviewUploadFile,
      selecting: this.renderPickerDialog,
      uploading: this.renderProgressDialog,
      complete: this.listFile
    }[this.props.pickerState]();
    const steps = this.getSteps();
    const { classes, isShowListFile, uploadResult, checkedFile, isShowEditFileUpload, engineCategories, librariesByCategories, engineByCategories, currentEngineCategory, enginesSelected, isShowModalSaveTemplate, templates } = this.props;
    const { activeStep, uploadResultSelected, libraries, engines, showAdvancedCognitive, templateName, currentTemplate } = this.state;
    console.log('isShowListFile', isShowListFile)
    return (
      <Fragment>
        <Dialog fullScreen open={this.state.openUpload} onClose={this.handleClose}>
          <DialogTitle onClose={this.handleClose} style={{ background: '#1976d2' }}>
            Upload
          </DialogTitle>
          <DialogContent dividers className={classes.dialogContent}>
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

            {
              activeStep === 0 && (
                <div className={classes.mainUpload}>
                  <div className={classes.mainUploadHeader}>
                    <List>
                      <ListItem className={classes.iconUploadHeader}>
                        <ListItemIcon>
                          <CloudUpload />
                        </ListItemIcon>
                        <ListItemText primary="Upload Media" />
                        {
                          isShowListFile && (
                            <ListItemSecondaryAction>
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
                          )
                        }
                      </ListItem>
                    </List>
                  </div>
                  <div className={classes.mainUploadBody}>
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

            {
              activeStep === 1 && (
                <div>
                  {
                    !showAdvancedCognitive ? (
                      <div>
                        <Grid container spacing={3} style={{ marginTop: 10 }}>
                          <Grid item xs={8}>
                            <Typography component="p" className={classes.titleProcessing}>
                              Simple Cognitive Workflow
                           </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography component="p" className={classes.showAdvanced} onClick={this.handleShowAdvancedCognitive}>
                              Show Advanced Cognitive Workflow
                            </Typography>
                          </Grid>
                        </Grid>

                        <Typography
                          color="textSecondary"
                          gutterBottom
                        >
                          Build a workflow by selecting from the classes of cognition below to extract, analyze and discovery valuable insight on your ingested files.
                        </Typography>
                        <Grid container spacing={3} style={{ marginTop: 10 }}>
                          {
                            engineCategories.map(item => {
                              return (
                                <Grid item xs={3}>
                                  <ListEngine title={item.name} des={item.description} libraries={librariesByCategories[item.id]} icon={item.iconClass} />
                                </Grid>
                              )
                            })
                          }

                        </Grid>
                      </div>
                    ) : (
                        <Fragment>
                          <Grid container spacing={3} style={{ marginTop: 10 }}>
                            <Grid item xs={8}>
                              <Typography component="p" className={classes.titleProcessing}>
                                Advanced Cognitive Workflow
                           </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography component="p" className={classes.showAdvanced} onClick={this.handleShowAdvancedCognitive}>
                                Show Simple Cognitive Workflow
                            </Typography>
                            </Grid>
                          </Grid>

                          <Typography
                            color="textSecondary"
                            gutterBottom
                          >
                            Build out the exact workflow you need by selecting from available categories and engines on the left and adding them to your new workflow on the right.
                        </Typography>

                          <Grid container spacing={3} style={{ marginTop: 10 }}>
                            <Grid item xs={5} className={classes.availableEngines}>
                              <FormControl className={classes.formEngines}>
                                <InputLabel shrink className={classes.titleFormSelectEngine}>
                                  Available Engines
                              </InputLabel>
                                <Select
                                  value={currentEngineCategory}
                                  onChange={this.handleChangeEngine}
                                  displayEmpty
                                >
                                  {
                                    engineCategories.map(item => {
                                      return (
                                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                      )
                                    })
                                  }
                                </Select>
                              </FormControl>
                              <FormControl className={classes.formEngines}>
                                <TextField label="Search by Engine name" onChange={this.handleSearchEngine} />
                              </FormControl>
                              <Paper variant="outlined" square className={classes.listEngines}>
                                {
                                  engineByCategories && engineByCategories[currentEngineCategory].filter(item => !enginesSelected.some(engine => engine.engineIds.includes(item.id))).map(item => {
                                    return (
                                      <Card className={classes.cardEngines}>
                                        <CardHeader
                                          key={item.id}
                                          avatar={
                                            item.logoPath || item.deploymentModel === 'FullyNetworkIsolated' ?
                                              this.renderLogoEngine(item.logoPath, item.deploymentModel === 'FullyNetworkIsolated', 'header') :
                                              null
                                          }
                                          action={
                                            <IconButton className={classes.iconAddEngines} data-id={item.id} onClick={this.handleAddEngine}>
                                              <AddCircleOutline />
                                            </IconButton>
                                          }
                                          title={
                                            !item.logoPath && (
                                              <Typography component="p" className={classes.titleHeaderEngines}>
                                                {item.name}
                                              </Typography>
                                            )
                                          }
                                          className={classes.cardHeaderEngines}
                                        />

                                        <CardContent className={classes.cardContentEngines}>
                                          {
                                            this.renderLogoEngine(item.logoPath, item.deploymentModel === 'FullyNetworkIsolated', 'content')
                                          }
                                          {
                                            !item.logoPath && (
                                              <Typography component="p" className={classes.titleContentEngines}>
                                                {item.name}
                                              </Typography>
                                            )
                                          }
                                          <Typography component="p" className={classes.desContentEngines}>
                                            {item.description}
                                          </Typography>
                                          <Typography component="p" className={classes.ratingEngines}>
                                            Rating
                                        </Typography>
                                          <Typography component="p" className={classes.priceEngines}>
                                            {`Price: $${item.price / 100}/hour`}
                                          </Typography>
                                        </CardContent>
                                      </Card>
                                    )
                                  })
                                }
                              </Paper>
                            </Grid>
                            <Grid item xs={2} className={classes.iconSelectedEngines}>
                              <Forward />
                            </Grid>
                            <Grid item xs={5} className={classes.selectedEngines}>
                              <div className={classes.contentSelectedEngine}>
                                <FormControl className={classes.formEngines}>
                                  <InputLabel shrink className={classes.titleFormSelectEngine}>
                                    Your Selected Engines
                              </InputLabel>
                                  <Select
                                    value={currentTemplate}
                                    displayEmpty
                                    onChange={this.handleChangeTemplates}
                                  >
                                     <MenuItem value={0}>{'Select Existing Template'}</MenuItem>
                                    {
                                      templates.map(item => {
                                        return (
                                          <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                        )
                                      })
                                    }
                                  </Select>
                                </FormControl>
                                <IconButton className={classes.iconSaveTemplate} onClick={this.handleShowModalSaveTemplate} >
                                  <Save />
                                </IconButton>

                              </div>

                              <Paper variant="outlined" square className={classes.listSelectedEngines}>
                                {
                                  enginesSelected && enginesSelected.map(item => {
                                    return (
                                      <Fragment>
                                        <Typography component="p" className={classes.titleCategorySelected}>
                                          {item.categoryName}
                                        </Typography>
                                        {
                                          item.engineIds.map(engine => {
                                            const engineFilter = engineByCategories[item.categoryId].find(item => item.id === engine);
                                            return (
                                              <Card className={classes.cardEngines}>
                                                <CardHeader
                                                  key={engine}
                                                  avatar={
                                                    engineFilter.logoPath || engineFilter.deploymentModel === 'FullyNetworkIsolated' ?
                                                      this.renderLogoEngine(engineFilter.logoPath, engineFilter.deploymentModel === 'FullyNetworkIsolated', 'selected') :
                                                      null
                                                  }
                                                  action={
                                                    <IconButton data-id={engineFilter.id} onClick={this.handleRemoveEngine}>
                                                      <CloseIcon />
                                                    </IconButton>
                                                  }
                                                  title={
                                                    !engineFilter.logoPath && (
                                                      <Typography component="p" className={classes.titleHeaderEngines}>
                                                        {engineFilter.name}
                                                      </Typography>
                                                    )
                                                  }
                                                  className={classes.cardHeaderEngines}
                                                />

                                                <CardContent className={classes.cardContentEngines}>
                                                  <Typography component="p" color="textSecondary">
                                                    {engineFilter.description}
                                                  </Typography>

                                                  <Typography component="p" >
                                                    {`Price: $${engineFilter.price / 100}/hour`}
                                                  </Typography>
                                                </CardContent>
                                              </Card>
                                            )
                                          })
                                        }

                                      </Fragment>
                                    )
                                  })
                                }
                              </Paper>
                            </Grid>

                          </Grid>
                        </Fragment>
                      )
                  }
                </div>

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
        <SaveTemplate
          open={isShowModalSaveTemplate}
          handleSave={this.handleSaveTemplate}
          handleClose={this.handleHideModalSaveTemplate}
          onChange={this.hanldeOnChangeTemPlate}
        />

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
