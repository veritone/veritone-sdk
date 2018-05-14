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
    // data: faceEngineOutput.getEngineResultsByEngineId(state, selectedEngineId),
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
    createEntitySuccess: faceEngineOutput.createEntitySuccess
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
    newEntity: {},
    recognizedFaces: {},
    unrecognizedFaces: []
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.libraries.length && nextProps.libraries.length) {
      this.setNewEntityLibrary(head(nextProps.libraries).id)
    }
  }

  // processFaces = (faceData, entities) => { 
  //   if (isEmpty(faceData)) {
  //     return;
  //   }

  //   // const detectedFaceObjects = [];
  //   // const recognizedEntityObjectMap = {};
  //   const recognizedFaces = {};
  //   const unrecognizedFaces = [];

  //   // flatten   data series for currently selected engine
  //   const faceSeries = faceData.reduce((accumulator, faceSeries) => {
  //     if (!isEmpty(faceSeries.series)) {
  //       return [...accumulator, ...faceSeries.series];
  //     }

  //     return accumulator;
  //   }, []);

  //   const secondMap = {};
  //   const entitiesByLibrary = {};

  //   faceSeries.forEach(faceObj => { // for each face object
  //     // locate entity that the face object belongs to
  //     const entity = find(entities, { id: faceObj.object.entityId });

  //     if (!faceObj.entityId || !entities.length || !entity || !entity.name) {
  //       unrecognizedFaces.push(faceObj);
  //     } else {
  //       // try to locate library entity that contains the face object
  //       const libraryEntity = find(entities, { libraryId: entity.libraryId });
  //       // build object for library entity for "recognized" face
  //       const recognizedEntityObj = {
  //         entityId: entity.id,
  //         libraryId: libraryEntity.libraryId,
  //         // libraryName: libraryEntity.name,
  //         libraryName: libraryEntity.library.name,
  //         fullName: entity.name,
  //         // entity: {
  //         //   ...entity,
  //         //   libraryId: libraryEntity.libraryId,
  //         //   libraryName: libraryEntity.library.name
  //         // },
  //         profileImage: entity.profileImageUrl,
  //         count: 1,
  //         timeSlots: [
  //           {
  //             stopTimeMs: faceObj.stopTimeMs,
  //             startTimeMs: faceObj.startTimeMs,
  //             originalImage: faceObj.object.uri,
  //             confidence: faceObj.object.confidence
  //           }
  //         ],
  //         stopTimeMs: faceObj.stopTimeMs
  //       };

  //       // if (recognizedFaces[recognizedEntityObj.entityId]) {
  //       if (recognizedFaces[entity.id]) {
  //         recognizedFaces[entity.id] = this.setRecognizedEntityObj(
  //           // recognizedFaces[recognizedEntityObj.entityId],
  //           recognizedFaces[entity.id],
  //           faceObj
  //         );
  //       } else {
  //         // recognizedFaces[recognizedEntityObj.entityId] = recognizedEntityObj;
  //         recognizedFaces[entity.id] = recognizedEntityObj;
  //         // entitiesByLibrary[recognizedEntityObj.libraryId] = {
  //         entitiesByLibrary[libraryEntity.libraryId] = {
  //           // libraryId: recognizedEntityObj.libraryId,
  //           libraryId: libraryEntity.libraryId,
  //           libraryName: recognizedEntityObj.libraryName,
  //           faces: [
  //             ...get(
  //               // entitiesByLibrary[recognizedEntityObj.libraryId],
  //               entitiesByLibrary[libraryEntity.libraryId],
  //               'faces',
  //               []
  //             ),
  //             recognizedEntityObj
  //           ]
  //         };
  //       }

  //       // TODO: optimize this so that we aren't storing a map since this will probably get pretty big
  //       const matchNamespace = this.getFrameNamespaceForMatch(faceObj);
  //       if (matchNamespace) {
  //         const secondSpots = this.getArrayOfSecondSpots(faceObj);
  //         secondSpots.forEach(second => {
  //           if (!secondMap[second]) {
  //             secondMap[second] = {};
  //           }
  //           if (!secondMap[second][matchNamespace]) {
  //             secondMap[second][matchNamespace] = {
  //               startTimeMs: faceObj.startTimeMs,
  //               stopTimeMs: faceObj.stopTimeMs,
  //               originalImage: faceObj.object.uri,
  //               entities: [],
  //               boundingPoly: faceObj.object.boundingPoly
  //             };
  //           }

  //           const match = {
  //             confidence: faceObj.object.confidence,
  //             entityId: faceObj.object.entityId
  //           };

  //           secondMap[second][matchNamespace].entities.push(match);

  //           secondMap[second][matchNamespace].entities.sort((a, b) => {
  //             return b.confidence - a.confidence;
  //           });
  //         });
  //       }
  //     }

  //     // } else if (!faceObj.entityId) {
  //     //   // detectedFaceObjects.push(faceObj);
  //     //   unrecognizedFaces.push(faceObj);
  //     // }
  //   });

  //   console.log('unrecognizedFaces:', unrecognizedFaces)
  //   console.log('recognizedFaces:', recognizedFaces);
  //   console.log('entitiesByLibrary:', entitiesByLibrary);
  //   console.log('framesBySeconds:', secondMap);

  //   this.setState({
  //     // detectedFaces: detectedFaceObjects,
  //     unrecognizedFaces,
  //     // recognizedEntityObjectMap: recognizedEntityObjectMap,
  //     recognizedFaces,
  //     entitiesByLibrary: entitiesByLibrary,
  //     framesBySeconds: secondMap
  //   });
  // };

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

  // getFrameNamespaceForMatch = faceObj => {
  //   if (faceObj.object.boundingPoly) {
  //     return JSON.stringify(faceObj.object.boundingPoly);
  //   }
  // };

  // // Gets list of nearest seconds which the face/entity appears in (MS)
  // getArrayOfSecondSpots = timeSlot => {
  //   const secondSpots = [];

  //   if (!isObject(timeSlot) || !timeSlot.startTimeMs || !timeSlot.stopTimeMs) {
  //     return secondSpots;
  //   }

  //   let timeCursor = timeSlot.startTimeMs - timeSlot.startTimeMs % 1000;

  //   while (timeCursor <= timeSlot.stopTimeMs) {
  //     secondSpots.push(timeCursor);
  //     timeCursor += 1000;
  //   }

  //   return secondSpots;
  // };

  // setRecognizedEntityObj = (recognizedEntityObj, faceObj) => {
  //   return {
  //     ...recognizedEntityObj,
  //     count: recognizedEntityObj.count + 1,
  //     timeSlots: [
  //       ...recognizedEntityObj.timeSlots,
  //       {
  //         stopTimeMs: faceObj.stopTimeMs,
  //         startTimeMs: faceObj.startTimeMs,
  //         originalImage: faceObj.object.uri,
  //         confidence: faceObj.object.confidence
  //       }
  //     ],
  //     stopTimeMs:
  //       recognizedEntityObj.stopTimeMs <= faceObj.stopTimeMs
  //         ? faceObj.stopTimeMs
  //         : recognizedEntityObj.stopTimeMs
  //   };
  // };

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
    // return this.props.createEntity(
    return this.props.createEntitySuccess(
      this.state.newEntity,
      {
        selectedEngineId: this.props.selectedEngineId,
        selectedEntity: this.state.selectedEntity,
      }
    );
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
      'tdo',
      'faces'
    ]);

    if (this.props.isFetchingEngineResults || this.props.isFetchingLibraryEntities) {
      return null;
    }

    return (
      <Fragment>
        <FaceEngineOutput
          {...faceEngineProps}
          {...this.props.faces}
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
