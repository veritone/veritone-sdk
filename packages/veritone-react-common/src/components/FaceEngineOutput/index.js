import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import Icon from 'material-ui/Icon';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { find, isEqual, pick, isObject, isEmpty } from 'lodash';
import { shape, number, string, bool, arrayOf, func, oneOf } from 'prop-types';
import cx from 'classnames';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import noAvatar from 'images/no-avatar.png';
import NoFacesFound from './NoFacesFound';
import FaceGrid from './FaceGrid';
import EntityInformation from './EntityInformation';
import FacesByScene from './FacesByScene';
import FacesByFrame from './FacesByFrame';

import styles from './styles.scss';

@withMuiThemeProvider
class FaceEngineOutput extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        series: arrayOf(
          shape({
            startTimeMs: number,
            endTimeMs: number,
            object: shape({
              label: string,
              uri: string
            })
          })
        )
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
    currentMediaPlayerTime: number,
    viewMode: oneOf(['summary', 'byFrame', 'byScene']),
    onAddNewEntity: func,
    className: string,
    onFaceOccurrenceClicked: func,
    onRemoveFaceDetection: func,
    onEditFaceDetection: func,
    onSearchForEntities: func
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
    this.processFaces(this.props.data);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.viewMode !== this.props.viewMode) {
      this.setState({ selectedEntity: null });
    }
    if (!isEqual(nextProps.data, this.props.data)) {
      this.processFaces(nextProps.data);
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
      } else {
        return accumulator;
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
              confidence: faceObj.object.confidence,
              entityId: faceObj.entityId
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

    // Loop through faces and namespace by library
    let entitiesByLibrary = {};
    recognizedEntityObjects &&
      recognizedEntityObjects.forEach(currentFace => {
        let library = currentFace.entity.library;
        if (library && library.id && !entitiesByLibrary[library.id]) {
          entitiesByLibrary[library.id] = {
            library: library,
            faces: [currentFace]
          };
        } else if (library && library.id) {
          entitiesByLibrary[library.id].faces.push(currentFace);
        }
      });

    this.setState({
      detectedFaces: detectedFaceObjects,
      recognizedEntityObjects: recognizedEntityObjects,
      recognizedEntityObjectMap: recognizedEntityObjectMap,
      entitiesByLibrary: entitiesByLibrary,
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

  handleEntitySelect = entityId => evt => {
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
      currentMediaPlayerTime,
      onRemoveFaceDetection,
      onEditFaceDetection,
      onSearchForEntities
    } = this.props;

    return (
      <div className={cx(styles.faceEngineOutput, className)}>
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
                entity={this.state.selectedEntity.entity}
                count={this.state.selectedEntity.count}
                timeSlots={this.state.selectedEntity.timeSlots}
                onBackClicked={this.removeSelectedEntity}
                onOccurrenceClicked={onFaceOccurrenceClicked}
              />
            )}
            {viewMode === 'summary' &&
              !this.state.selectedEntity && (
                <div>
                  {isEmpty(this.state.entitiesByLibrary) ? (
                    <NoFacesFound />
                  ) : (
                    <div>
                      {Object.keys(this.state.entitiesByLibrary).map(
                        (key, index) => {
                          let library = this.state.entitiesByLibrary[key]
                            .library;
                          return (
                            <div key={'faces-by-libary-' + key}>
                              <div className={styles.libraryName}>
                                <Icon
                                  className={cx(
                                    styles.libraryIcon,
                                    'icon-library-app'
                                  )}
                                />
                                <span>
                                  Library: <strong>{library.name}</strong>
                                </span>
                              </div>
                              <div className={styles.entityCountContainer}>
                                {this.state.entitiesByLibrary[key].faces.map(
                                  (face, index) => {
                                    return (
                                      <Chip
                                        key={'face-' + face.entityId}
                                        className={styles.entityCountChip}
                                        label={
                                          <span>
                                            {face.fullName}{' '}
                                            <a>({face.count})</a>
                                          </span>
                                        }
                                        avatar={
                                          <Avatar
                                            className={styles.faceAvatar}
                                            src={
                                              face.profileImage
                                                ? face.profileImage
                                                : noAvatar
                                            }
                                          />
                                        }
                                        onClick={this.handleEntitySelect(
                                          face.entityId
                                        )}
                                      />
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              )}
            {viewMode === 'byFrame' &&
              !this.state.selectedEntity && (
                <FacesByFrame
                  currentMediaPlayerTime={currentMediaPlayerTime}
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
                  currentMediaPlayerTime={currentMediaPlayerTime}
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

export default FaceEngineOutput;
