import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { util, modules } from 'veritone-redux-common';

import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent/SnackbarContent';
import { pick, head, get } from 'lodash';
import {
  shape,
  number,
  string,
  bool,
  arrayOf,
  func,
  objectOf,
  oneOfType,
  node
} from 'prop-types';
import styles from './styles.scss';
import { FaceEngineOutput, AlertDialog } from 'veritone-react-common';

import * as faceEngineOutput from '../../redux/modules/mediaDetails/faceEngineOutput';
import rootSaga from '../../redux/modules/mediaDetails/faceEngineOutput/saga';

const { engineResults: engineResultsModule } = modules;

const saga = util.reactReduxSaga.saga;

@saga(rootSaga)
@connect(
  (state, { selectedEngineId }) => ({
    faces: faceEngineOutput.getFaces(state, selectedEngineId),
    entities: faceEngineOutput.getEntities(state),
    libraries: faceEngineOutput.getLibraries(state),
    entitySearchResults: faceEngineOutput.getEntitySearchResults(state),
    isFetchingEngineResults: engineResultsModule.isFetchingEngineResults(state),
    isFetchingEntities: faceEngineOutput.isFetchingEntities(state),
    isFetchingLibraries: faceEngineOutput.isFetchingLibraries(state),
    isSearchingEntities: faceEngineOutput.isSearchingEntities(state),
    showConfirmationDialog: faceEngineOutput.showConfirmationDialog(state),
    pendingUserEdits: faceEngineOutput.pendingUserEdits(
      state,
      selectedEngineId
    ),
    isDisplayingUserEditedOutput: engineResultsModule.isDisplayingUserEditedOutput(
      state,
      selectedEngineId
    ),
    savingFaceEdits: faceEngineOutput.getSavingFaceEdits(state),
    error: faceEngineOutput.getError(state),
    confirmationType: faceEngineOutput.getConfirmationType(state),
    editModeEnabled: faceEngineOutput.getEditModeEnabled(state)
  }),
  {
    fetchEngineResults: engineResultsModule.fetchEngineResults,
    fetchLibraries: faceEngineOutput.fetchLibraries,
    createEntity: faceEngineOutput.createEntity,
    addDetectedFace: faceEngineOutput.addDetectedFace,
    fetchEntitySearchResults: faceEngineOutput.fetchEntitySearchResults,
    removeDetectedFace: faceEngineOutput.removeDetectedFace,
    openConfirmationDialog: faceEngineOutput.openConfirmationDialog,
    closeConfirmationDialog: faceEngineOutput.closeConfirmationDialog,
    cancelFaceEdits: faceEngineOutput.cancelFaceEdits,
    clearEngineResultsByEngineId:
      engineResultsModule.clearEngineResultsByEngineId,
    onEditButtonClick: faceEngineOutput.editFaceButtonClick,
    saveFaceEdits: faceEngineOutput.saveFaceEdits,
    closeErrorSnackbar: faceEngineOutput.closeErrorSnackbar,
    toggleEditMode: faceEngineOutput.toggleEditMode
  },
  null,
  { withRef: true }
)
class FaceEngineOutputContainer extends Component {
  static propTypes = {
    tdo: shape({
      id: string,
      startDateTime: string,
      stopDateTime: string
    }).isRequired,
    engines: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ).isRequired,
    selectedEngineId: string,
    faces: shape({
      recognizedFaces: shape({
        startTimeMs: number,
        stopTimeMs: number,
        object: shape({
          label: string,
          uri: string,
          entityId: string,
          libraryId: string
        })
      }),
      unrecognizedFaces: arrayOf(
        shape({
          startTimeMs: number.isRequired,
          stopTimeMs: number.isRequired,
          object: shape({
            label: string,
            uri: string
          })
        })
      )
    }),
    entities: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        libraryId: string.isRequired,
        library: shape({
          id: string,
          name: string
        }),
        profileImageUrl: string,
        jsondata: objectOf(oneOfType([string, number]))
      })
    ),
    entitySearchResults: arrayOf(
      shape({
        name: string.isRequired,
        library: shape({
          id: string,
          name: string.isRequired
        }),
        profileImageUrl: string
      })
    ),
    libraries: arrayOf(
      shape({
        id: string,
        name: string
      })
    ),
    onEngineChange: func,
    onRestoreOriginalClick: func,
    editModeEnabled: bool,
    currentMediaPlayerTime: number,
    className: string,
    onFaceOccurrenceClicked: func,
    onRemoveFaceDetection: func,
    onEditFaceDetection: func,
    onSearchForEntities: func,
    onExpandClicked: func,
    outputNullState: node,
    fetchLibraries: func,
    isFetchingEngineResults: bool,
    isFetchingEntities: bool,
    isFetchingLibraries: bool,
    isSearchingEntities: bool,
    disableEdit: func,
    fetchEngineResults: func,
    fetchEntitySearchResults: func,
    addDetectedFace: func,
    removeDetectedFace: func,
    createEntity: func,
    showConfirmationDialog: bool,
    confirmationType: string,
    cancelFaceEdits: func,
    openConfirmationDialog: func,
    closeConfirmationDialog: func,
    pendingUserEdits: bool,
    isDisplayingUserEditedOutput: bool,
    clearEngineResultsByEngineId: func,
    moreMenuItems: arrayOf(node),
    showEditButton: bool,
    onEditButtonClick: func,
    disableEditButton: bool,
    saveFaceEdits: func,
    savingFaceEdits: bool,
    error: string,
    closeErrorSnackbar: func,
    toggleEditMode: func
  };

  state = {
    currentlyEditedFace: null, // selected unrecognized face object from which to create a new 'entity'
    dialogOpen: false,
    newEntity: {
      libraryId: '',
      name: ''
    },
    showFaceDetectionDoneSnack: false,
    faceDetectionDoneEntity: null
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      faces: { unrecognizedFaces }
    } = nextProps;

    // set the first library as default (for `New Entity` form)
    if (!this.props.libraries.length && nextProps.libraries.length) {
      this.setNewEntityLibrary(head(nextProps.libraries).id);
    }

    // disable editing if they are no unrecognized faces
    if (
      this.props.isFetchingEngineResults &&
      !nextProps.isFetchingEngineResults &&
      !unrecognizedFaces.length
    ) {
      this.props.disableEdit(true);
    }

    // fetch engine results when user changes engine
    if (nextProps.selectedEngineId !== this.props.selectedEngineId) {
      const tdo = this.props.tdo;
      this.props.clearEngineResultsByEngineId(nextProps.selectedEngineId);
      this.props.fetchEngineResults({
        engineId: nextProps.selectedEngineId,
        tdo: this.props.tdo,
        startOffsetMs: 0,
        stopOffsetMs:
          Date.parse(tdo.stopDateTime) - Date.parse(tdo.startDateTime),
        ignoreUserEdited: false
      });
    }
  }

  componentWillUnmount() {
    if(this.props.editModeEnabled) {
      this.props.toggleEditMode();
    }
  }

  handleSearchEntities = searchText => {
    this.props.fetchEntitySearchResults('people', searchText);
  };

  handleFaceDetectionEntitySelect = (currentlyEditedFace, selectedEntity) => {
    this.props.addDetectedFace(
      this.props.selectedEngineId,
      currentlyEditedFace,
      selectedEntity
    );

    this.showFaceDetectionDoneSnack(selectedEntity);
  };

  openDialog = () => {
    this.setState({ dialogOpen: true });
  };
  closeDialog = () => {
    this.setState({
      dialogOpen: false
    });
  };

  handleAddNewEntity = currentlyEditedFace => {
    if (!this.props.libraries.length) {
      this.props.fetchLibraries({
        libraryType: 'people'
      });
    }

    this.openDialog();
    this.setState({
      currentlyEditedFace
    });
  };

  handleNewEntityLibraryChange = e => {
    this.setNewEntityLibrary(e.target.value);
  };

  handleRemoveFaceDetection = faceObj => {
    this.props.removeDetectedFace(this.props.selectedEngineId, faceObj);
  };

  setNewEntityLibrary = libraryId => {
    this.setState(prevState => ({
      newEntity: {
        ...prevState.newEntity,
        libraryId
      }
    }));
  };

  setNewEntityName = e => {
    e.persist();
    this.setState(prevState => ({
      newEntity: {
        ...prevState.newEntity,
        name: e.target.value
      }
    }));
  };

  clearNewEntityForm = () => {
    this.setState(prevState => ({
      newEntity: {
        libraryId: '',
        name: ''
      }
    }));
  };

  saveNewEntity = () => {
    const entity = {
      ...this.state.newEntity,
      profileImageUrl: this.state.currentlyEditedFace.object.uri
    };

    this.props.createEntity(
      { entity },
      {
        selectedEngineId: this.props.selectedEngineId,
        faceObj: this.state.currentlyEditedFace
      }
    );

    this.showFaceDetectionDoneSnack(entity);

    return this.closeDialog();
  };

  showFaceDetectionDoneSnack = entity => {
    this.setState({
      showFaceDetectionDoneSnack: true,
      faceDetectionDoneEntity: entity
    });
  };

  closeFaceDetectionDoneSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      showFaceDetectionDoneSnack: false,
      faceDetectionDoneEntity: null
    });
  };

  handleToggleEditedOutput = showUserEdited => {
    const tdo = this.props.tdo;
    this.props.clearEngineResultsByEngineId(this.props.selectedEngineId);
    this.props.fetchEngineResults({
      engineId: this.props.selectedEngineId,
      tdo: tdo,
      startOffsetMs: 0,
      stopOffsetMs:
        Date.parse(tdo.stopDateTime) - Date.parse(tdo.startDateTime),
      ignoreUserEdited: !showUserEdited
    });
  };

  renderAddNewEntityModal = () => {
    const { isFetchingLibraries, libraries } = this.props;
    return (
      <Dialog
        open={this.state.dialogOpen}
        onClose={this.closeDialog}
        aria-labelledby="new-entity-title"
        disableBackdropClick
        onExited={this.clearNewEntityForm}
        classes={{
          paper: styles.editNewEntityDialogPaper
        }}
      >
        <DialogTitle
          id="new-entity-title"
          classes={{
            root: styles.dialogTitle
          }}
        >
          <div className={styles.dialogTitleLabel}>Add New</div>
          <IconButton
            onClick={this.closeDialog}
            aria-label="Close"
            classes={{
              root: styles.closeButton
            }}
          >
            <Icon className="icon-close-exit" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            classes={{
              root: styles.dialogHintText
            }}
          >
            Identify and help train face recognition engines to find this
            individual. You can view and add additional images in the Library
            application.
          </DialogContentText>
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label="Name"
            fullWidth
            required
            classes={{
              root: styles.inputField
            }}
            value={this.state.newEntity.name || ''}
            onChange={this.setNewEntityName}
          />
          <TextField
            id="select-library"
            select
            label="Choose Library"
            margin="normal"
            fullWidth
            required
            classes={{
              root: styles.inputField
            }}
            value={
              this.state.newEntity.libraryId ||
              (libraries.length ? libraries[0].id : 'Loading...')
            }
            onChange={this.handleNewEntityLibraryChange}
            SelectProps={{
              MenuProps: {
                /* temporary fix to address scrolling issue discussed here: https://github.com/mui-org/material-ui/issues/10601 */
                PaperProps: {
                  style: {
                    transform: 'translate3d(0, 0, 0)',
                    fontSize: '14px'
                  }
                }
              },
              classes: {
                root: styles.librarySelect
              }
            }}
          >
            {isFetchingLibraries ? (
              <MenuItem
                value={'Loading...'}
                classes={{
                  root: styles.librarySelectMenuItem
                }}
              >
                {'Loading...'}
              </MenuItem>
            ) : (
              libraries.map(library => (
                <MenuItem
                  key={library.id}
                  value={library.id}
                  classes={{
                    root: styles.librarySelectMenuItem
                  }}
                >
                  {library.name}
                </MenuItem>
              ))
            )}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={this.saveNewEntity} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  handleEngineChange = engineId => {
    this.props.onEngineChange(engineId);
  };

  onSaveEdits = () => {
    const {
      tdo,
      selectedEngineId,
      toggleEditMode,
      saveFaceEdits,
      fetchEngineResults
    } = this.props;
    saveFaceEdits(tdo.id, selectedEngineId).then(res => {
      fetchEngineResults({
        engineId: selectedEngineId,
        tdo: tdo,
        startOffsetMs: 0,
        stopOffsetMs:
          Date.parse(tdo.stopDateTime) - Date.parse(tdo.startDateTime),
        ignoreUserEdited: false
      });
      toggleEditMode();
      return res;
    });
  };

  handleDialogCancel = () => {
    const {
      closeConfirmationDialog,
      cancelFaceEdits,
      confirmationType,
      toggleEditMode
    } = this.props;

    if (confirmationType === 'saveEdits') {
      cancelFaceEdits();
      toggleEditMode();
    }
    closeConfirmationDialog();
  };

  handleDialogConfirm = () => {
    const {
      closeConfirmationDialog,
      cancelFaceEdits,
      confirmationType
    } = this.props;

    if (confirmationType === 'saveEdits') {
      this.onSaveEdits();
    } else if (confirmationType === 'cancelEdits') {
      cancelFaceEdits();
    }
    closeConfirmationDialog();
  };

  renderConfirmationDialog = () => {
    let alertTitle = 'Unsaved Changes';
    let alertDescription = 'This action will reset your changes.';
    let cancelButtonLabel = 'Cancel';
    let approveButtonLabel = 'Continue';
    const { showConfirmationDialog, confirmationType } = this.props;

    if (confirmationType === 'saveEdits') {
      alertTitle = 'Save Changes?';
      alertDescription = 'Would you like to save the changes?';
      cancelButtonLabel = 'Discard';
      approveButtonLabel = 'Save';
    }

    return (
      <AlertDialog
        open={showConfirmationDialog}
        title={alertTitle}
        content={alertDescription}
        cancelButtonLabel={cancelButtonLabel}
        approveButtonLabel={approveButtonLabel}
        onCancel={this.handleDialogCancel}
        onApprove={this.handleDialogConfirm}
      />
    );
  };

  checkEditState = () => {
    if (this.props.editModeEnabled && this.props.pendingUserEdits) {
      this.props.openConfirmationDialog('saveEdits');
    } else {
      this.props.toggleEditMode();
    }
  };

  renderFaceDetectionDoneSnackbar = () => {
    const { showFaceDetectionDoneSnack, faceDetectionDoneEntity } = this.state;
    const entityName = get(faceDetectionDoneEntity, 'name', '');

    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showFaceDetectionDoneSnack}
        autoHideDuration={3000}
        onClose={this.closeFaceDetectionDoneSnack}
        message={
          <span className={styles.faceDetectionDoneSnackbarContentText}>
            {`${entityName} has been added as a person for this file`}
          </span>
        }
      />
    );
  };

  render() {
    const faceEngineProps = pick(this.props, [
      'engines',
      'entities',
      'currentMediaPlayerTime',
      'entitySearchResults',
      'selectedEngineId',
      'onFaceOccurrenceClicked',
      'isSearchingEntities',
      'onRestoreOriginalClick',
      'outputNullState',
      'disableEditButton'
    ]);

    if (this.props.isFetchingEngineResults || this.props.isFetchingEntities) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress size={80} color="primary" thickness={1} />
        </div>
      );
    }

    return (
      <Fragment>
        <FaceEngineOutput
          {...this.props.faces}
          {...faceEngineProps}
          editMode={this.props.editModeEnabled}
          onEditButtonClick={this.props.toggleEditMode}
          showEditButton={
            this.props.showEditButton && !this.props.editModeEnabled
          }
          onEngineChange={this.handleEngineChange}
          onAddNewEntity={this.handleAddNewEntity}
          onSearchForEntities={this.handleSearchEntities}
          onEditFaceDetection={this.handleFaceDetectionEntitySelect}
          onRemoveFaceDetection={this.handleRemoveFaceDetection}
          showingUserEditedOutput={this.props.isDisplayingUserEditedOutput}
          onToggleUserEditedOutput={this.handleToggleEditedOutput}
          moreMenuItems={this.props.moreMenuItems}
        />
        {this.props.editModeEnabled && (
          <div className={styles.actionButtonsEditMode}>
            <Button
              className={styles.actionButtonEditMode}
              onClick={this.checkEditState}
              disabled={this.props.savingFaceEdits}
            >
              CANCEL
            </Button>
            <Button
              className={styles.actionButtonEditMode}
              onClick={this.onSaveEdits}
              disabled={
                !this.props.pendingUserEdits || this.props.savingFaceEdits
              }
              variant="contained"
              color="primary"
            >
              SAVE
            </Button>
          </div>
        )}
        {this.renderAddNewEntityModal()}
        {this.renderConfirmationDialog()}
        {this.renderFaceDetectionDoneSnackbar()}
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={!!this.props.error}
          autoHideDuration={5000}
          onClose={this.props.closeErrorSnackbar}
        >
          <SnackbarContent
            className={styles.errorSnackbar}
            message={
              <span className={styles.snackbarMessageText}>
                {this.props.error}
              </span>
            }
          />
        </Snackbar>
      </Fragment>
    );
  }
}

export default FaceEngineOutputContainer;
