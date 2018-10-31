import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { util, modules } from 'veritone-redux-common';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent/SnackbarContent';
import { pick, get, isArray, isObject } from 'lodash';
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
import AddNewEntityDialog from './EntityDialogs/AddNewEntity';
import AddToAnExistingEntityDialog from './EntityDialogs/AddToExisting';

const { engineResults: engineResultsModule } = modules;

const saga = util.reactReduxSaga.saga;

@saga(rootSaga)
@connect(
  (state, { tdo, selectedEngineId }) => ({
    faces: faceEngineOutput.getFaces(state, selectedEngineId, tdo.id),
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
      tdo.id,
      selectedEngineId
    ),
    savingFaceEdits: faceEngineOutput.getSavingFaceEdits(state),
    error: faceEngineOutput.getError(state),
    editModeEnabled: faceEngineOutput.getEditModeEnabled(state),
    bulkEditActionItems: faceEngineOutput.getBulkEditActionItems(state),
    activeTab: faceEngineOutput.getActiveTab(state)
  }),
  {
    fetchEngineResults: engineResultsModule.fetchEngineResults,
    createEntity: faceEngineOutput.createEntity,
    addDetectedFace: faceEngineOutput.addDetectedFace,
    fetchEntitySearchResults: faceEngineOutput.fetchEntitySearchResults,
    removeFaces: faceEngineOutput.removeFaces,
    openConfirmationDialog: faceEngineOutput.openConfirmationDialog,
    closeConfirmationDialog: faceEngineOutput.closeConfirmationDialog,
    cancelFaceEdits: faceEngineOutput.cancelFaceEdits,
    clearEngineResultsByEngineId:
      engineResultsModule.clearEngineResultsByEngineId,
    onEditButtonClick: faceEngineOutput.editFaceButtonClick,
    saveFaceEdits: faceEngineOutput.saveFaceEdits,
    closeErrorSnackbar: faceEngineOutput.closeErrorSnackbar,
    toggleEditMode: faceEngineOutput.toggleEditMode,
    selectFaceObjects: faceEngineOutput.selectFaceObjects,
    removeSelectedFaceObjects: faceEngineOutput.removeSelectedFaceObjects,
    setActiveTab: faceEngineOutput.setActiveTab,
    onAddNewEntity: faceEngineOutput.openAddEntityDialog,
    closeAddEntityDialog: faceEngineOutput.closeAddEntityDialog,
    onAddToExistingEntity: faceEngineOutput.openAddToExistingEntityDialog,
    closeAddToExistingEntityDialog:
      faceEngineOutput.closeAddToExistingEntityDialog
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
    isFetchingEngineResults: bool,
    isFetchingEntities: bool,
    isFetchingLibraries: bool,
    isSearchingEntities: bool,
    disableEdit: func,
    fetchEngineResults: func,
    fetchEntitySearchResults: func,
    addDetectedFace: func,
    removeFaces: func,
    createEntity: func,
    showConfirmationDialog: bool,
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
    toggleEditMode: func,
    selectFaceObjects: func,
    removeSelectedFaceObjects: func,
    activeTab: string,
    onAddNewEntity: func,
    closeAddEntityDialog: func,
    closeAddToExistingEntityDialog: func
  };

  state = {
    showFaceDetectionDoneSnack: false,
    faceDetectionDoneEntity: null
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      faces: { unrecognizedFaces }
    } = nextProps;

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
    if (this.props.editModeEnabled) {
      this.props.toggleEditMode();
    }
  }

  handleSearchEntities = searchText => {
    this.props.fetchEntitySearchResults('people', searchText);
  };

  handleRemoveFaces = faceObjects => {
    this.props.removeFaces(this.props.selectedEngineId, faceObjects);
  };

  handleFaceUpdates = (updatedFaces, entity) => {
    if (isArray(updatedFaces)) {
      this.props.addDetectedFace(
        this.props.selectedEngineId,
        updatedFaces,
        entity
      );
    } else if (isObject(updatedFaces)) {
      this.props.addDetectedFace(
        this.props.selectedEngineId,
        [updatedFaces],
        entity
      );
    }

    this.showFaceDetectionDoneSnack(entity);
    this.props.closeAddEntityDialog();
    this.props.closeAddToExistingEntityDialog();
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
    this.props.clearEngineResultsByEngineId(
      tdo.id,
      this.props.selectedEngineId
    );
    this.props.fetchEngineResults({
      engineId: this.props.selectedEngineId,
      tdo: tdo,
      startOffsetMs: 0,
      stopOffsetMs:
        Date.parse(tdo.stopDateTime) - Date.parse(tdo.startDateTime),
      ignoreUserEdited: !showUserEdited
    });
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
      toggleEditMode
    } = this.props;

    cancelFaceEdits();
    toggleEditMode();
    closeConfirmationDialog();
  };

  handleDialogConfirm = () => {
    const { closeConfirmationDialog } = this.props;

    this.onSaveEdits();
    closeConfirmationDialog();
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
            {`${entityName} has been added to the face recognition tab.`}
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
      'disableEditButton',
      'bulkEditActionItems',
      'activeTab',
      'setActiveTab',
      'moreMenuItems',
      'onAddNewEntity',
      'onAddToExistingEntity'
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
          onSearchForEntities={this.handleSearchEntities}
          onEditFaceDetection={this.handleFaceUpdates}
          onRemoveFaces={this.handleRemoveFaces}
          showingUserEditedOutput={this.props.isDisplayingUserEditedOutput}
          onToggleUserEditedOutput={this.handleToggleEditedOutput}
          onSelectFaces={this.props.selectFaceObjects}
          onUnselectFaces={this.props.removeSelectedFaceObjects}
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
        <AddNewEntityDialog
          onSubmit={this.handleFaceUpdates}
          onCancel={this.props.closeAddEntityDialog}
        />
        <AddToAnExistingEntityDialog
          onSubmit={this.handleFaceUpdates}
          onClose={this.props.closeAddToExistingEntityDialog}
        />
        {this.renderFaceDetectionDoneSnackbar()}
        <AlertDialog
          open={this.props.showConfirmationDialog}
          titleLabel="Unsaved Changes"
          content="Would you like to save the changes?"
          cancelButtonLabel="Discard"
          approveButtonLabel="Save"
          onCancel={this.handleDialogCancel}
          onApprove={this.handleDialogConfirm}
        />
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
