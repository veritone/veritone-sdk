import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { util } from 'veritone-redux-common';

import { MenuItem } from 'material-ui/Menu';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Select from 'material-ui/Select';
import { find, isObject, isEmpty, get, noop, pick, head } from 'lodash';
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

import {
  FaceEngineOutput
} from 'veritone-react-common';

import * as faceEngineOutput from '../../redux/modules/mediaDetails/faceEngineOutput';
import rootSaga from '../../redux/modules/mediaDetails/faceEngineOutput/saga';

const saga = util.reactReduxSaga.saga;
import widget from '../../shared/widget';

@saga(rootSaga)
@connect(
  (state, { selectedEngineId }) => ({
    // data: faceEngineOutput.getFaceDataByEngine(state, selectedEngineId),
    entities: faceEngineOutput.getEntities(state),
    faces: faceEngineOutput.getFaces(state, selectedEngineId),
    libraries: faceEngineOutput.getLibraries(state),
    isFetchingEngineResults: faceEngineOutput.isFetchingEngineResults(state),
    isFetchingLibraryEntities: faceEngineOutput.isFetchingEntities(state),
    isFetchingLibraries: faceEngineOutput.isFetchingLibraries(state)
  }),
  {
    fetchLibraries: faceEngineOutput.fetchLibraries,
    createEntity: faceEngineOutput.createEntity,
    updateEngineResult: faceEngineOutput.updateEngineResult
  },
  null,
  { withRef: true }
)
class FaceEngineOutputContainer extends Component {
  static propTypes = {
    tdo: shape({
      id: string,
      details: shape({
        veritoneProgram: shape({
          programId: string,
          programName: string,
          programImage: string,
          programLiveImage: string,
          signedProgramLiveImage: string
        })
      }),
      startDateTime: string,
      stopDateTime: string,
      security: shape({
        global: bool
      })
    }).isRequired,
    engines: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ).isRequired,
    selectedEngineId: string,
    data: arrayOf(
      shape({
        series: arrayOf(
          shape({
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            object: shape({
              label: string,
              uri: string
            })
          })
        )
      })
    ),
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
        libraryName: string.isRequired,
        profileImageUrl: string
      })
    ),
    onEngineChange: func,
    enableEditMode: bool,
    currentMediaPlayerTime: number,
    className: string,
    onFaceOccurrenceClicked: func,
    onRemoveFaceDetection: func,
    onEditFaceDetection: func,
    onSearchForEntities: func,
    onExpandClicked: func,
    isFetchingLibraries: bool
  };

  state = {
    selectedEntity: null, // selected unrecognized face object from which to create a new 'entity'
    dialogOpen: false,
    newEntity: {
      libraryId: '',
      name: '',
      profileImageUrl: ''
    },
    recognizedFaces: {},
    unrecognizedFaces: []
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.libraries.length && nextProps.libraries.length) {
      this.setNewEntityLibrary(head(nextProps.libraries).id)
    }

    if (!this.props.entities.length && nextProps.entities.length) {
      this.props.updateEngineResult(
        this.props.selectedEngineId,
        this.props.unrecognizedFaces
      )
    }
  }

  handleAddNewEntity = (selectedEntity) => {
    this.props.fetchLibraries({
      libraryType: 'people'
    });
    this.openDialog();
    this.setState({
      selectedEntity
    })
  }

  handleNewEntityLibraryChange = (e) => {
    this.setNewEntityLibrary(e.target.value);
  }

  setNewEntityLibrary = (libraryId) => {
    this.setState(prevState => ({
      newEntity: {
        ...prevState.newEntity,
        libraryId
      }
    }));
  }

  setNewEntityName = (e) => {
    e.persist();
    this.setState(prevState => ({
      newEntity: {
        ...prevState.newEntity,
        name: e.target.value
      }
    }));
  }

  openDialog = () => {
    this.setState({ dialogOpen: true });
  }

  closeDialog = () => {
    this.setState({ dialogOpen: false });
  }

  saveNewEntity = () => {
    const entity = {
      ...this.state.newEntity,
      profileImageUrl: this.state.selectedEntity.object.uri,
    };

    this.props.createEntity(entity, {
      selectedEngineId: this.props.selectedEngineId,
      selectedEntity: this.state.selectedEntity,
    });

    return this.closeDialog();
  }

  renderNewEntityModal = () => {
    const { isFetchingLibraries, libraries } = this.props;
    return (
      <Dialog
        open={this.state.dialogOpen}
        onClose={this.closeDialog}
        aria-labelledby="new-entity-title"
        disableBackdropClick
      >
        <DialogTitle id="new-entity-title">Add New</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Identify and help train face recognition engines to find this individual. You can view and add additional images in the Library application.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            required
            value={this.state.newEntity.name || ''}
            onChange={this.setNewEntityName}
          />
          <TextField
            id="select-library"
            select
            label="Choose Library"
            value={this.state.newEntity.libraryId || 'Loading...'}
              // libraries.length
              //   ? (this.state.newEntity.library || head(libraries).id)
              //   : isFetchingLibraries ? 'Loading...' : ''
            onChange={this.handleNewEntityLibraryChange}
            margin="dense"
            fullWidth
            required
            SelectProps={{
              MenuProps: {
                /* temporary fix to address scrolling issue discussed here: https://github.com/mui-org/material-ui/issues/10601 */
                PaperProps: {
                  style: {
                    transform: 'translate3d(0, 0, 0)'
                  }
                }
              }
            }}
          >
            {isFetchingLibraries
              ? <MenuItem value={'Loading...'}>
                  {'Loading...'}
                </MenuItem>
              : libraries.map(library => (
                <MenuItem key={library.id} value={library.id}>
                  {library.name}
                </MenuItem>
              ))
            }
          </TextField>
          {/* <Select
            id="select-library"
            label="Choose Library"
            value={this.state.newEntity.libraryId || 'Loading...'}
              // libraries.length
              //   ? (this.state.newEntity.library || head(libraries).id)
              //   : isFetchingLibraries ? 'Loading...' : ''
            onChange={this.handleNewEntityLibraryChange}
            margin="dense"
            fullWidth
            required
          >
            {isFetchingLibraries
              ? <option value={'Loading...'}>
                  {'Loading...'}
                </option>
              : libraries.map(library => (
                <option key={library.id} value={library.id}>
                  {library.name}
                </option>
              ))
            }
          </Select> */}
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
    )
  }

  render() {
    const faceEngineProps = pick(this.props, [
      'enableEditMode',
      'engines',
      'currentMediaPlayerTime',
      // 'unrecognizedFaces'
    ]);

    if (this.props.isFetchingEngineResults || this.props.isFetchingLibraryEntities) {
      return null;
    }

    return (
      <Fragment>
        <FaceEngineOutput
          {...this.props.faces}
          {...faceEngineProps}
          onAddNewEntity={this.handleAddNewEntity}
        />
        {this.renderNewEntityModal()}
      </Fragment>
    );
  }
}

// export default widget(FaceEngineOutputContainer);
export default FaceEngineOutputContainer;
