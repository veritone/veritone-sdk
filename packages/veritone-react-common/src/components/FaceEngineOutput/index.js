import React, { Component } from 'react';
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
  func,
  objectOf,
  oneOfType
} from 'prop-types';
import cx from 'classnames';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import noAvatar from 'images/no-avatar.png';
import EngineOutputHeader from '../EngineOutputHeader';
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
    libraries: arrayOf(
      shape({
        id: string,
        name: string
      })
    ).isRequired,
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
        libraryName: string.isRequired,
        profileImageUrl: string
      })
    ),
    enableEditMode: bool,
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

  componentWillMount() {
    this.processFaces(
      this.props.data,
      this.props.libraries,
      this.props.entities
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entities || nextProps.libraries || nextProps.data) {
      this.processFaces(
        nextProps.data,
        nextProps.libraries,
        nextProps.entities
      );
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
          recognizedEntityObjectMap[entity.id] = this.setRecognizedEntityObj(
            recognizedEntityObjectMap[recognizedEntityObj.entityId],
            faceObj
          );
        } else {
          recognizedEntityObjectMap[
            recognizedEntityObj.entityId
          ] = recognizedEntityObj;
          entitiesByLibrary[recognizedEntityObj.libraryId] = {
            libraryId: recognizedEntityObj.libraryId,
            libraryName: recognizedEntityObj.libraryName,
            faces: [
              ...get(
                entitiesByLibrary[recognizedEntityObj.libraryId],
                'faces',
                []
              ),
              recognizedEntityObj
            ]
          };
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

  render() {
    let {
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
    let { viewMode } = this.state;

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
                                  Library:{' '}
                                  <strong>
                                    {
                                      this.state.entitiesByLibrary[key]
                                        .libraryName
                                    }
                                  </strong>
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
                  recognizedEntityObjects={Object.values(
                    this.state.recognizedEntityObjectMap
                  )}
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
