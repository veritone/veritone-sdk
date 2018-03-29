import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import { find, isEqual, pick, isObject } from 'lodash';
import { shape, number, string, bool, arrayOf, func, oneOf } from 'prop-types';
import classNames from 'classnames';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import FaceGrid from './FaceGrid';
import EntityInformation from './EntityInformation';
import FacesByScene from './FacesByScene';
import FacesByFrame from './FacesByFrame';

import styles from './styles.scss';

@withMuiThemeProvider
class FaceEngineOutput extends Component {
  static propTypes = {
    faces: arrayOf(
      shape({
        startTimeMs: number,
        endTimeMs: number,
        object: shape({
          label: string,
          uri: string
        })
      })
    ).isRequired,
    libraries: arrayOf(
      shape({
        id: string,
        name: string,
        entities: arrayOf(
          shape({
            entityId: string,
            entityName: string,
            libraryId: string,
            profileImageUrl: string,
            jsondata: shape({
              description: string
            })
          })
        )
      })
    ).isRequired,
    entitySearchResults: arrayOf(
      shape({
        entityName: string,
        libraryName: string,
        profileImageUrl: string
      })
    ),
    enableEditMode: bool,
    mediaPlayerPosition: number,
    viewMode: oneOf(['byFrame', 'byScene']),
    onAddNewEntity: func,
    className: string,
    onFaceOccurrenceClicked: func
  };

  state = {
    activeTab: 'faceRecognition',
    detectedFaces: [],
    recognizedEntityObjects: [],
    recognizedEntityObjectMap: {},
    framesBySeconds: {},
    selectedEntity: null
  };

  componentWillMount() {
    this.processFaces(this.props.faces);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.viewMode !== this.props.viewMode) {
      this.setState({ selectedEntity: null });
    }
    if (!isEqual(nextProps.faces, this.props.faces)) {
      this.processFaces(this.props.faces);
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

  processFaces = faceData => {
    let detectedFaceObjects = [];
    let recognizedEntityObjects = [];
    let recognizedEntityObjectMap = {};
    if (!faceData || !faceData.length) {
      return;
    }
    let faceSeries = faceData.reduce((accumulator, faceSeries) => {
      if (faceSeries.series && faceSeries.series.length) {
        return [...accumulator, ...faceSeries.series];
      }
    }, []);

    // Reduce library array to an array of entities to assign to face objects
    let entities = this.props.libraries.reduce((accumulator, library) => {
      return accumulator.concat(library.entities);
    }, []);

    let secondMap = {};
    faceSeries.forEach(faceObj => {
      faceObj.entity = find(entities, { entityId: faceObj.entityId });
      if (faceObj.entity && faceObj.entity.entityName) {
        faceObj.entity.library = pick(
          find(this.props.libraries, { id: faceObj.entity.libraryId }),
          ['id', 'name']
        );
        let face = {
          entityId: faceObj.entityId,
          libraryId: faceObj.entity.library.id,
          libraryName: faceObj.entity.library.name,
          fullName: faceObj.entity.entityName,
          entity: faceObj.entity,
          profileImage: faceObj.entity.profileImageUrl,
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
        let flag = true;
        recognizedEntityObjects.forEach(function checkDuplicate(
          elem,
          index,
          array
        ) {
          if (elem.entityId === face.entityId) {
            elem.count++;
            let timeStamp = {
              stopTimeMs: faceObj.stopTimeMs,
              startTimeMs: faceObj.startTimeMs,
              originalImage: faceObj.object.uri,
              confidence: faceObj.object.confidence
            };
            elem.timeSlots.push(timeStamp);
            elem.stopTimeMs =
              elem.stopTimeMs <= faceObj.stopTimeMs
                ? faceObj.stopTimeMs
                : elem.stopTimeMs;
            flag = false;
          }
        });
        if (flag) {
          recognizedEntityObjectMap[face.entityId] = face;
          recognizedEntityObjects.push(face);
        }
      } else if (!faceObj.entityId) {
        let face = {
          originalImage: faceObj.object.uri,
          startTimeMs: faceObj.startTimeMs,
          stopTimeMs: faceObj.stopTimeMs
        };
        detectedFaceObjects.push(face);
      }

      let matchNamespace = this.getFrameNamespaceForMatch(faceObj);
      if (matchNamespace) {
        let secondSpots = this.getArrayOfSecondSpots(faceObj);
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

          let match = {
            confidence: faceObj.object.confidence
          };
          if (faceObj.entityId) {
            match.entityId = faceObj.entityId;
          }

          secondMap[second][matchNamespace].entities.push(match);

          secondMap[second][matchNamespace].entities.sort((a, b) => {
            return b.confidence - a.confidence;
          });
        });
      }
    });

    this.setState({
      detectedFaces: detectedFaceObjects,
      recognizedEntityObjects: recognizedEntityObjects,
      recognizedEntityObjectMap: recognizedEntityObjectMap,
      framesBySeconds: secondMap
    });
  };

  handleTabChange = (event, activeTab) => {
    if (activeTab !== this.state.activetab) {
      this.setState({ activeTab });
    }
  };

  getLibraryById = id => {
    return this.props.libraries.find(library => library.id == id);
  };

  getEntity = (library, entityId) => {
    return library.entities.find(e => e.entityId === entityId);
  };

  handleEntitySelect = entityId => {
    if (this.state.recognizedEntityObjectMap[entityId]) {
      this.setState({
        selectedEntity: {
          ...this.state.recognizedEntityObjectMap[entityId]
        }
      });
    }
  };

  removeSelectedEntity = () => {
    this.setState({
      selectedEntity: null
    });
  };

  render() {
    let {
      enableEditMode,
      viewMode,
      onAddNewEntity,
      entitySearchResults,
      className,
      onFaceOccurrenceClicked,
      mediaPlayerPosition
    } = this.props;

    return (
      <div className={classNames(styles.faceEngineOutput, className)}>
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
            {this.state.selectedEntity && (
              <EntityInformation
                selectedEntity={this.state.selectedEntity}
                onBackClicked={this.removeSelectedEntity}
                onOccurrenceClicked={onFaceOccurrenceClicked}
              />
            )}
            {viewMode === 'byFrame' &&
              !this.state.selectedEntity && (
                <FacesByFrame
                  mediaPlayerPosition={mediaPlayerPosition}
                  recognizedEntityObjectMap={
                    this.state.recognizedEntityObjectMap
                  }
                  framesBySeconds={this.state.framesBySeconds}
                  onSelectEntity={this.handleEntitySelect}
                />
              )}
            {viewMode === 'byScene' &&
              !this.state.selectedEntity && (
                <FacesByScene
                  mediaPlayerPosition={mediaPlayerPosition}
                  recognizedEntityObjects={this.state.recognizedEntityObjects}
                  onSelectEntity={this.handleEntitySelect}
                />
              )}
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
            />
          </div>
        )}
      </div>
    );
  }
}

export default FaceEngineOutput;
