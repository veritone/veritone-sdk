import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { util } from 'veritone-redux-common';

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
import { pick, head, get } from 'lodash';
import {
  shape,
  number,
  string,
  bool,
  arrayOf,
  func,
  objectOf,
  oneOfType
} from 'prop-types';
import styles from './styles.scss';
import {
  FaceEngineOutput,
  withMuiThemeProvider,
  AlertDialog
} from 'veritone-react-common';

import * as faceEngineOutput from '../../redux/modules/mediaDetails/faceEngineOutput';
import rootSaga from '../../redux/modules/mediaDetails/faceEngineOutput/saga';

const saga = util.reactReduxSaga.saga;

@saga(rootSaga)
@connect(
  (state, { selectedEngineId }) => ({
    faces: faceEngineOutput.getFaces(state, selectedEngineId),
    entities: faceEngineOutput.getEntities(state),
    libraries: faceEngineOutput.getLibraries(state),
    entitySearchResults: faceEngineOutput.getEntitySearchResults(state),
    isFetchingEngineResults: faceEngineOutput.isFetchingEngineResults(state),
    isFetchingEntities: faceEngineOutput.isFetchingEntities(state),
    isFetchingLibraries: faceEngineOutput.isFetchingLibraries(state),
    isSearchingEntities: faceEngineOutput.isSearchingEntities(state),
    showConfirmationDialog: faceEngineOutput.showConfirmationDialog(state),
    confirmationAction: faceEngineOutput.confirmationAction(state),
    pendingUserEdits: faceEngineOutput.pendingUserEdits(state, selectedEngineId)
  }),
  {
    fetchEngineResults: faceEngineOutput.fetchEngineResults,
    fetchLibraries: faceEngineOutput.fetchLibraries,
    createEntity: faceEngineOutput.createEntity,
    addDetectedFace: faceEngineOutput.addDetectedFace,
    fetchEntitySearchResults: faceEngineOutput.fetchEntitySearchResults,
    removeDetectedFace: faceEngineOutput.removeDetectedFace,
    openConfirmationDialog: faceEngineOutput.openConfirmationDialog,
    closeConfirmationDialog: faceEngineOutput.closeConfirmationDialog,
    cancelFaceEdits: faceEngineOutput.cancelFaceEdits
  },
  null,
  { withRef: true }
)
@withMuiThemeProvider
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
    editMode: bool,
    currentMediaPlayerTime: number,
    className: string,
    onFaceOccurrenceClicked: func,
    onRemoveFaceDetection: func,
    onEditFaceDetection: func,
    onSearchForEntities: func,
    onExpandClicked: func,
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
    confirmationAction: func,
    cancelFaceEdits: func,
    openConfirmationDialog: func,
    closeConfirmationDialog: func,
    pendingUserEdits: bool
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
      this.props.fetchEngineResults({
        selectedEngineId: nextProps.selectedEngineId,
        tdo: this.props.tdo
      });
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

  openDialog = () => {
    this.setState({ dialogOpen: true });
  };

  closeDialog = () => {
    this.setState({
      dialogOpen: false
    });
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

  showFaceDetectionDoneSnack = (entity) => {
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
    if (this.props.editMode && this.props.pendingUserEdits) {
      this.props.openConfirmationDialog(() => {
        this.props.cancelFaceEdits();
        this.props.onEngineChange(engineId);
        this.props.closeConfirmationDialog();
      });
    } else {
      this.props.onEngineChange(engineId);
    }
  };

  renderConfirmationDialog = () => {
    const alertTitle = 'Unsaved Changes';
    const alertDescription = 'This action will reset your changes.';
    const cancelButtonLabel = 'Cancel';
    const approveButtonLabel = 'Continue';

    const {
      showConfirmationDialog,
      closeConfirmationDialog,
      confirmationAction
    } = this.props;

    return (
      <AlertDialog
        open={showConfirmationDialog}
        title={alertTitle}
        content={alertDescription}
        cancelButtonLabel={cancelButtonLabel}
        approveButtonLabel={approveButtonLabel}
        onCancel={closeConfirmationDialog}
        onApprove={confirmationAction}
      />
    );
  };

  renderFaceDetectionDoneSnackbar = () => {
    const {
      showFaceDetectionDoneSnack,
      faceDetectionDoneEntity
    } = this.state;
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
      'editMode',
      'engines',
      'entities',
      'currentMediaPlayerTime',
      'entitySearchResults',
      'selectedEngineId',
      'onFaceOccurrenceClicked',
      'isSearchingEntities'
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
          onEngineChange={this.handleEngineChange}
          onAddNewEntity={this.handleAddNewEntity}
          onSearchForEntities={this.handleSearchEntities}
          onEditFaceDetection={this.handleFaceDetectionEntitySelect}
          onRemoveFaceDetection={this.handleRemoveFaceDetection}
        />
        {this.renderAddNewEntityModal()}
        {this.renderConfirmationDialog()}
        {this.renderFaceDetectionDoneSnackbar()}
      </Fragment>
    );
  }
}

export default FaceEngineOutputContainer;
