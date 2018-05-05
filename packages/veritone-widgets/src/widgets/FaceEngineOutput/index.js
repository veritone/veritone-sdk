import React, { Component } from 'react';
import { connect } from 'react-redux';
import { util } from 'veritone-redux-common';

import * as mediaDetails from 'redux/modules/mediaDetails';
import rootSaga from 'redux/modules/mediaDetails/saga';

import Tabs, { Tab } from 'material-ui/Tabs';
import Icon from 'material-ui/Icon';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { find, isObject, isEmpty, get } from 'lodash';
import {
  shape,
  number,
  string,
  bool,
  arrayOf,
  func
} from 'prop-types';
import cx from 'classnames';

import noAvatar from 'images/no-avatar.png';
import EngineOutputHeader from '../EngineOutputHeader';
import NoFacesFound from './NoFacesFound';
import FaceGrid from './FaceGrid';
import EntityInformation from './EntityInformation';
import FacesByScene from './FacesByScene';
import FacesByFrame from './FacesByFrame';

import styles from './styles.scss';

const saga = util.reactReduxSaga.saga;

@saga(rootSaga)
@connect(
  state => ({
    engineResults: mediaDetails.engineResultsByEngineId(state),
    isFetchingEngineResults: mediaDetails.isFetchingEngineResults(state),
    libraries: mediaDetails.libraries(state),
    isFetchingLibraries: mediaDetails.isFetchingLibraries(state),
  }),
  { createNewEntity: mediaDetails.createNewEntity },
  null,
  { withRef: true }
)
export default class FaceEngineOutput extends Component {
  static propTypes = {
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
    ).isRequired,
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
    }),
    engines: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ).isRequired,
    entitySearchResults: arrayOf(
      shape({
        name: string.isRequired,
        libraryName: string.isRequired,
        profileImageUrl: string
      })
    ),
    libraries: arrayOf(
      shape({
        id: string,
        name: string
      })
    ).isRequired,
    selectedEngineId: string,
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
    activeTab: 'faceRecognition',
    detectedFaces: [],
    recognizedEntityObjects: [],
    recognizedEntityObjectMap: {},
    framesBySeconds: {},
    selectedEntity: null,
    viewMode: 'summary',
    dialogOpen: false,
    newEntity: {}
  };

  componentWillMount() {
    this.processFaces(
      this.props.data,
      this.props.libraries,
      this.props.entities
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entities || nextProps.libraries || nextProps.data) {
      this.processFaces(nextProps.data, nextProps.libraries, nextProps.entities);
    }
  }

  getFrameNamespaceForMatch = faceObj => {
    if (faceObj.object.boundingPoly) {
      return JSON.stringify(faceObj.object.boundingPoly);
    }
  };

  // Gets list of nearest seconds which the face/entity appears in (MS)
  getArrayOfSecondSpots = timeSlot => {
    let secondSpots = [];
    if (!isObject(timeSlot) || !timeSlot.startTimeMs || !timeSlot.stopTimeMs) {
      return secondSpots;
    }
    let timeCursor = timeSlot.startTimeMs - timeSlot.startTimeMs % 1000;
    while (timeCursor <= timeSlot.stopTimeMs) {
      secondSpots.push(timeCursor);
      timeCursor += 1000;
    }
    return secondSpots;
  };

  setRecognizedEntityObj = (recognizedEntityObj, faceObj) => {
    return {
      ...recognizedEntityObj,
      count: recognizedEntityObj.count + 1,
      timeSlots: [
        ...recognizedEntityObj.timeSlots,
        {
          stopTimeMs: faceObj.stopTimeMs,
          startTimeMs: faceObj.startTimeMs,
          originalImage: faceObj.object.uri,
          confidence: faceObj.object.confidence
        }
      ],
      stopTimeMs:
        recognizedEntityObj.stopTimeMs <= faceObj.stopTimeMs
          ? faceObj.stopTimeMs
          : recognizedEntityObj.stopTimeMs
    };
  };

  processFaces = (faceData, libraries, entities) => {
    const detectedFaceObjects = [];
    const recognizedEntityObjectMap = {};
    if (isEmpty(faceData)) {
      return;
    }

    const faceSeries = faceData.reduce((accumulator, faceSeries) => {
      if (!isEmpty(faceSeries.series)) {
        return [...accumulator, ...faceSeries.series];
      }

      return accumulator;
    }, []);

    const secondMap = {};
    const entitiesByLibrary = {};
    faceSeries.forEach(faceObj => {
      const entity = find(entities, { id: faceObj.object.entityId });
      if (entity && entity.name && libraries.length) {
        const library = find(libraries, { id: entity.libraryId });
        let recognizedEntityObj = {
          entityId: entity.id,
          libraryId: library.id,
          libraryName: library.name,
          fullName: entity.name,
          entity: {
            ...entity,
            libraryId: library.id,
            libraryName: library.name
          },
          profileImage: entity.profileImageUrl,
          count: 1,
          timeSlots: [
            {
              stopTimeMs: faceObj.stopTimeMs,
              startTimeMs: faceObj.startTimeMs,
              originalImage: faceObj.object.uri,
              confidence: faceObj.object.confidence
            }
          ],
          stopTimeMs: faceObj.stopTimeMs
        };
        if (recognizedEntityObjectMap[recognizedEntityObj.entityId]) {
          recognizedEntityObjectMap[
            entity.id
          ] = this.setRecognizedEntityObj(
            recognizedEntityObjectMap[recognizedEntityObj.entityId],
            faceObj
          );
        } else {
          recognizedEntityObjectMap[recognizedEntityObj.entityId] = recognizedEntityObj;
          entitiesByLibrary[recognizedEntityObj.libraryId] = {
            libraryId: recognizedEntityObj.libraryId,
            libraryName: recognizedEntityObj.libraryName,
            faces: [
              ...get(entitiesByLibrary[recognizedEntityObj.libraryId], 'faces', []),
              recognizedEntityObj
            ]
          }
        }

        // TODO: optimize this so that we aren't storing a map since this will probably get pretty big
        const matchNamespace = this.getFrameNamespaceForMatch(faceObj);
        if (matchNamespace) {
          const secondSpots = this.getArrayOfSecondSpots(faceObj);
          secondSpots.forEach(second => {
            if (!secondMap[second]) {
              secondMap[second] = {};
            }
            if (!secondMap[second][matchNamespace]) {
              secondMap[second][matchNamespace] = {
                startTimeMs: faceObj.startTimeMs,
                stopTimeMs: faceObj.stopTimeMs,
                originalImage: faceObj.object.uri,
                entities: [],
                boundingPoly: faceObj.object.boundingPoly
              };
            }

            const match = {
              confidence: faceObj.object.confidence,
              entityId: faceObj.object.entityId
            };

            secondMap[second][matchNamespace].entities.push(match);

            secondMap[second][matchNamespace].entities.sort((a, b) => {
              return b.confidence - a.confidence;
            });
          });
        }
      } else if (!faceObj.entityId) {
        detectedFaceObjects.push(faceObj);
      }
    });

    this.setState({
      detectedFaces: detectedFaceObjects,
      recognizedEntityObjectMap: recognizedEntityObjectMap,
      entitiesByLibrary: entitiesByLibrary,
      framesBySeconds: secondMap
    });
  };

  handleTabChange = (event, activeTab) => {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  };

  getLibraryById = id => {
    return this.props.libraries.find(library => library.id == id);
  };

  getEntityById = (library, entityId) => {
    return library.entities.find(e => e.entityId === entityId);
  };

  handleEntitySelect = entityId => evt => {
    if (this.state.recognizedEntityObjectMap[entityId]) {
      this.setState(prevState => {
        return {
          selectedEntity: {
            ...prevState.recognizedEntityObjectMap[entityId]
          }
        };
      });
    }
  };

  handleViewModeChange = evt => {
    this.setState({
      viewMode: evt.target.value,
      selectedEntity: null
    });
  };

  removeSelectedEntity = () => {
    this.setState({
      selectedEntity: null
    });
  };

  closeDialog = () => {
    this.setState({ dialogOpen: false });
  }

  saveNewEntity = () => {
    return this.props.createNewEntity(this.state.newEntity);
  }

  renderNewEntityModal = () => {
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
          />
          <TextField
            id="select-library"
            select
            label="Choose Library"
            value={this.state.currency}
            onChange={this.handleChange('currency')}
            margin="dense"
          >
            {this.props.isFetchingLibraries
              ? 'Loading...'
              : this.props.libraries.map(library => (
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
    const {
      enableEditMode,
      onAddNewEntity,
      entitySearchResults,
      className,
      onFaceOccurrenceClicked,
      currentMediaPlayerTime,
      onRemoveFaceDetection,
      onEditFaceDetection,
      onSearchForEntities,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClicked
    } = this.props;

    const { viewMode } = this.state;

    return (
      <div className={cx(styles.faceEngineOutput, className)}>
        <EngineOutputHeader
          title="Faces"
          engines={engines}
          selectedEngineId={selectedEngineId}
          onEngineChange={onEngineChange}
          onExpandClicked={onExpandClicked}
        >
          <Select
            autoWidth
            value={viewMode}
            onChange={this.handleViewModeChange}
            className={cx(styles.displayOptions)}
            MenuProps={{
              anchorOrigin: {
                horizontal: 'center',
                vertical: 'bottom'
              },
              transformOrigin: {
                horizontal: 'center'
              },
              getContentAnchorEl: null
            }}
          >
            <MenuItem value="summary" className={cx(styles.view)}>
              Summary
            </MenuItem>
            <MenuItem value="byFrame">By Frame</MenuItem>
            <MenuItem value="byScene">By Scene</MenuItem>
          </Select>
        </EngineOutputHeader>
        <Tabs
          value={this.state.activeTab}
          onChange={this.handleTabChange}
          indicatorColor="primary"
        >
          <Tab
            classes={{ root: styles.faceTab }}
            label="Face Recognition"
            value="faceRecognition"
          />
          <Tab
            classes={{ root: styles.faceTab }}
            label="Face Detection"
            value="faceDetection"
          />
        </Tabs>
        {this.state.activeTab === 'faceRecognition' && (
          <div className={styles.faceTabBody}>
            {this.state.selectedEntity
              ?
                <EntityInformation
                  entity={this.state.selectedEntity.entity}
                  count={this.state.selectedEntity.count}
                  timeSlots={this.state.selectedEntity.timeSlots}
                  onBackClicked={this.removeSelectedEntity}
                  onOccurrenceClicked={onFaceOccurrenceClicked}
                />
              : <FaceEntitiesView
                  viewMode={viewMode}
                  recognizedEntityObjectMap={this.state.recognizedEntityObjectMap}
                  currentMediaPlayerTime={currentMediaPlayerTime}
                  framesBySeconds={this.state.framesBySeconds}
                  onSelectEntity={this.handleEntitySelect}
                />
            }
          </div>
        )}
        {this.state.activeTab === 'faceDetection' && (
          <div className={styles.faceTabBody}>
            <FaceGrid
              faces={this.state.detectedFaces}
              enableEditMode={enableEditMode}
              viewMode={viewMode}
              onAddNewEntity={onAddNewEntity}
              entitySearchResults={entitySearchResults}
              onFaceOccurrenceClicked={onFaceOccurrenceClicked}
              onRemoveFaceDetection={onRemoveFaceDetection}
              onEditFaceDetection={onEditFaceDetection}
              onSearchForEntities={onSearchForEntities}
            />
          </div>
        )}
        {this.renderNewEntityModal()}
      </div>
    );
  }
}

export const FaceEntitiesView = ({
  viewMode,
  entitiesByLibrary,
  currentMediaPlayerTime,
  recognizedEntityObjectMap,
  framesBySeconds,
  handleEntitySelect
}) => {
  if (viewMode === 'summary') {
    return (
      isEmpty(entitiesByLibrary)
        ? <NoFacesFound />
        : <FacesByLibrary faceEntityLibraries={entitiesByLibrary} />
    )
  } else if (viewMode === 'byFrame') {
    return (
      <FacesByFrame
        currentMediaPlayerTime={currentMediaPlayerTime}
        recognizedEntityObjectMap={recognizedEntityObjectMap}
        framesBySeconds={framesBySeconds}
        onSelectEntity={handleEntitySelect}
      />
    )
  } else if (viewMode === 'byScene') {
    return (
      <FacesByScene
        currentMediaPlayerTime={currentMediaPlayerTime}
        recognizedEntityObjects={Object.values(recognizedEntityObjectMap)}
        onSelectEntity={handleEntitySelect}
      />
    );
  }

  return;
};

const FacesByLibrary = ({ faceEntityLibraries, handleEntitySelect }) => {
  return (
    <div>
      {Object.keys(faceEntityLibraries).map((key, index) => (
        <div key={`faces-by-library-${key}`}>
          <div className={styles.libraryName}>
            <Icon
              className={cx(styles.libraryIcon, 'icon-library-app')}
            />
            <span>
              {`Library: `}
              <strong>
                {faceEntityLibraries[key].libraryName}
              </strong>
            </span>
          </div>
          <div className={styles.entityCountContainer}>
            {faceEntityLibraries[key].faces.map((face, index) => (
              <Chip
                key={`face-${face.entityId}`}
                className={styles.entityCountChip}
                label={
                  <span>
                    {`${face.fullName} `}
                    <a>({face.count})</a>
                  </span>
                }
                avatar={
                  <Avatar
                    className={styles.faceAvatar}
                    src={face.profileImage || noAvatar}
                  />
                }
                onClick={handleEntitySelect(face.entityId)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

class NewFaceEntity extends React.Component {

  render() {
    
  }
}
