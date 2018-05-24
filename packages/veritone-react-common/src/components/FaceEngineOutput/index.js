import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { find, isObject, get } from 'lodash';
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
import cx from 'classnames';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import EngineOutputHeader from '../EngineOutputHeader';
import FaceGrid from './FaceGrid';
import EntityInformation from './EntityInformation';
import FacesByScene from './FacesByScene';
import FacesByFrame from './FacesByFrame';
import FacesByLibrary from './FacesByLibrary';

import styles from './styles.scss';

@withMuiThemeProvider
class FaceEngineOutput extends Component {
  static propTypes = {
    // data: arrayOf(
    //   shape({
    //     series: arrayOf(
    //       shape({
    //         startTimeMs: number.isRequired,
    //         stopTimeMs: number.isRequired,
    //         object: shape({
    //           label: string,
    //           uri: string
    //         })
    //       })
    //     )
    //   })
    // ).isRequired,
    // libraries: arrayOf(
    //   shape({
    //     id: string,
    //     name: string
    //   })
    // ).isRequired,
    entities: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        libraryId: string.isRequired,
        profileImageUrl: string,
        jsondata: objectOf(oneOfType([string, number]))
      })
    ).isRequired,
    engines: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ).isRequired,
    selectedEngineId: string,
    onEngineChange: func,
    entitySearchResults: arrayOf(
      shape({
        name: string.isRequired,
        // libraryName: string.isRequired,
        library: shape({
          id: string,
          name: string.isRequired
        }),
        profileImageUrl: string
      })
    ),
    editMode: bool,
    currentMediaPlayerTime: number,
    onAddNewEntity: func,
    className: string,
    onFaceOccurrenceClicked: func,
    onRemoveFaceDetection: func,
    onEditFaceDetection: func,
    onSearchForEntities: func,
    onExpandClicked: func
  };

  state = {
    activeTab: 'faceRecognition',
    detectedFaces: [],
    recognizedEntityObjects: [],
    recognizedEntityObjectMap: {},
    framesBySeconds: {},
    selectedEntity: null,
    viewMode: 'summary'
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
    // if (this.state.recognizedEntityObjectMap[entityId]) {
    if (this.props.recognizedFaces[entityId]) {
      console.log('face:', this.props.recognizedFaces[entityId])
      this.setState(prevState => ({
        selectedEntity: {
          // ...prevState.recognizedEntityObjectMap[entityId]
          ...this.props.recognizedFaces[entityId]
        }
      }));
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

  render() {
    const {
      editMode,
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
              :
              <FaceEntitiesView
                viewMode={viewMode}
                faces={this.props.recognizedFaces}
                entities={this.props.entities}
                currentMediaPlayerTime={currentMediaPlayerTime}
                onSelectEntity={this.handleEntitySelect}
              />
            }
          </div>
        )}
        {this.state.activeTab === 'faceDetection' && (
          <div className={styles.faceTabBody}>
            <FaceGrid
              faces={this.props.unrecognizedFaces}
              editMode={editMode}
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
      </div>
    );
  }
}

export const FaceEntitiesView = ({
  viewMode,
  entities,
  faces,
  currentMediaPlayerTime,
  onSelectEntity
}) => {

  function setRecognizedEntityObj(recognizedEntityObj, faceObj) {
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

  function getFrameNamespaceForMatch(faceObj) {
    return faceObj.object.boundingPoly
      ? JSON.stringify(faceObj.object.boundingPoly)
      : null
  };

  // Gets list of nearest seconds which the face/entity appears in (MS)
  function getArrayOfSecondSpots(timeSlot) {
    const secondSpots = [];

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

  function buildFaceDataPayload(faces, entities) {
    const faceData = {
      recognizedFaces: {},
      entitiesByLibrary: {},
      framesBySeconds: {}
    };

    faces.forEach(faceObj => { // for each face object
      // locate entity that the face object belongs to
      const entity = find(entities, { id: faceObj.object.entityId });

      if (entity) {
        // try to locate library entity that contains the face object
        const libraryEntity = find(entities, { libraryId: entity.libraryId });
        // build object for library entity for "recognized" face
        const recognizedEntityObj = {
          entityId: entity.id,
          libraryId: libraryEntity.libraryId,
          libraryName: libraryEntity.library.name,
          fullName: entity.name,
          entity: {
            ...entity,
            libraryId: libraryEntity.libraryId,
            libraryName: libraryEntity.library.name
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

        if (faceData.recognizedFaces[entity.id]) {
          faceData.recognizedFaces[entity.id] = setRecognizedEntityObj(
            faceData.recognizedFaces[entity.id],
            faceObj
          );
        } else {
          faceData.recognizedFaces[entity.id] = recognizedEntityObj;
          faceData.entitiesByLibrary[libraryEntity.libraryId] = {
            libraryId: libraryEntity.libraryId,
            libraryName: recognizedEntityObj.libraryName,
            faces: [
              ...get(
                faceData.entitiesByLibrary[libraryEntity.libraryId],
                'faces',
                []
              ),
              recognizedEntityObj
            ]
          };
        }

        const matchNamespace = getFrameNamespaceForMatch(faceObj);

        if (matchNamespace) {
          const secondSpots = getArrayOfSecondSpots(faceObj);

          secondSpots.forEach(second => {
            if (!faceData.framesBySeconds[second]) {
              faceData.framesBySeconds[second] = {};
            }
            if (!faceData.framesBySeconds[second][matchNamespace]) {
              faceData.framesBySeconds[second][matchNamespace] = {
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

            faceData.framesBySeconds[second][matchNamespace].entities.push(match);
            faceData.framesBySeconds[second][matchNamespace].entities.sort((a, b) => {
              return b.confidence - a.confidence;
            });
          });
        }
      }
    });

    return faceData;
  }

  const faceData = buildFaceDataPayload(faces, entities);

  if (viewMode === 'summary') {
    return (
      <FacesByLibrary
        faceEntityLibraries={faceData.entitiesByLibrary}
        onSelectEntity={onSelectEntity}
      />
    )
  } else if (viewMode === 'byFrame') {
    return (
      <FacesByFrame
        currentMediaPlayerTime={currentMediaPlayerTime}
        recognizedEntityObjectMap={faceData.recognizedFaces}
        framesBySeconds={faceData.framesBySeconds}
        onSelectEntity={onSelectEntity}
      />
    )
  } else if (viewMode === 'byScene') {
    return (
      <FacesByScene
        currentMediaPlayerTime={currentMediaPlayerTime}
        recognizedEntityObjects={Object.values(faceData.recognizedFaces)}
        onSelectEntity={onSelectEntity}
      />
    );
  }

  return;
};

export default FaceEngineOutput;
