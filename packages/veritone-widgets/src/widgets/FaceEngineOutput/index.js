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
import { find, isObject, isEmpty, get, noop, omit, head } from 'lodash';
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
    // data: faceEngineOutput.engineResultsByEngineId(state, selectedEngineId),
    // entities: faceEngineOutput.libraryEntities(state),
    libraries: faceEngineOutput.libraries(state),
    isFetchingEngineResults: faceEngineOutput.isFetchingEngineResults(state),
    isFetchingLibraryEntities: faceEngineOutput.isFetchingLibraryEntities(state),
    isFetchingLibraries: faceEngineOutput.isFetchingLibraries(state)
  }),
  { fetchLibraries: faceEngineOutput.fetchLibraries },
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
    selectedEntity: null,
    dialogOpen: false,
    newEntity: {}
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.libraries.length && nextProps.libraries.length) {
      this.setNewEntityLibrary(head(nextProps.libraries).id)
    }
  }

  handleAddNewEntity = (faceEntity) => {
    console.log('faceEntity:', faceEntity)
    this.props.fetchLibraries({
      libraryType: 'people'
    });
    this.openDialog();
  }

  handleNewEntityLibraryChange = (e) => {
    this.setNewEntityLibrary(e.target.value);
  }

  setNewEntityLibrary = (libraryId) => {
    this.setState(prevState => ({
      newEntity: {
        ...prevState.newEntity,
        library: libraryId
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
    console.log('this.state.newEntity:', this.state.newEntity)
    // return this.props.createNewEntity(this.state.newEntity);
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
            value={this.state.newEntity.library || 'Loading...'}
              // libraries.length
              //   ? (this.state.newEntity.library || head(libraries).id)
              //   : isFetchingLibraries ? 'Loading...' : ''
            onChange={this.handleNewEntityLibraryChange}
            margin="dense"
            fullWidth
            required
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
    const faceEngineProps = omit(this.props, [
      'isFetchingEngineResults',
      'isFetchingLibraryEntities',
      'tdo'
    ]);

    if (this.props.isFetchingEngineResults || this.props.isFetchingLibraryEntities) {
      return null;
    }

    return (
      <Fragment>
        <FaceEngineOutput
          {...faceEngineProps}
          onAddNewEntity={this.handleAddNewEntity}
          enableEditMode
        />
        {this.renderNewEntityModal()}
      </Fragment>
    );
  }
}

// export default widget(FaceEngineOutputContainer);
export default FaceEngineOutputContainer;
