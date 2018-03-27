import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import { groupBy, find, isEqual, pick } from 'lodash';
import { shape, number, string, bool, arrayOf, func } from 'prop-types';
import classNames from 'classnames';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import noAvatar from 'images/no-avatar.png';
import Chip from '../Chip';
import Avatar from '../Avatar';
import FaceGrid from './FaceGrid';
import EntityInformation from './EntityInformation';
import FacesByScene from './FacesByScene';

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
    viewMode: string,
    onAddNewEntity: func,
    className: string,
    onFaceOccurrenceClicked: func
  };

  state = {
    activeTab: 'faceRecognition',
    detectedFaces: [],
    recognizedEntityObjects: [],
    recognizedEntityObjectMap: {},
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

    faceSeries.forEach(faceObj => {
      faceObj.entity = find(entities, { entityId: faceObj.entityId });
      if (faceObj.entity && faceObj.entity.entityName) {
        faceObj.entity.library = pick(
          find(this.props.libraries, { id: faceObj.entity.libraryId }),
          ['id', 'name']
        );
        let face = {
          entityId: faceObj.entityId,
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
    });

    // Loop through and map by library. This may become depricated because it
    // wont be accurate now that we aren't getting all the data at once.
    let entitiesByLibrary = {};
    recognizedEntityObjects &&
      recognizedEntityObjects.forEach(function highLightedFaces(currentFace) {
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
      entitiesByLibrary: entitiesByLibrary
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

  handleEntitySelect = (entity, evt) => {
    this.setState({
      selectedEntity: {
        ...entity
      }
    });
  };

  renderEntityChips = (facesGroupedByEnity, library) => {
    return Object.keys(facesGroupedByEnity).map(entityId => {
      let entity = this.getEntity(library, entityId);
      return (
        <Chip
          onClick={this.handleEntityClick(entity)}
          key={'entity-' + entityId}
          label={
            <span>
              {entity.entityName}{' '}
              <a>({facesGroupedByEnity[entityId].length})</a>
            </span>
          }
          classes={{
            root: styles.entityCountChip
          }}
          avatar={<Avatar src={entity.profileImageUrl || noAvatar} size={40} />}
        />
      );
    });
  };

  renderSummaryEntityBoxes = recognizedFaces => {
    return Object.keys(recognizedFaces).map(libraryId => {
      let library = this.getLibraryById(libraryId);
      let facesGroupedByEnity = groupBy(recognizedFaces[libraryId], 'entityId');
      if (library) {
        return (
          <div key={'library-' + library.id}>
            <div className={styles.libraryName}>
              <i className="icon-library-app" />&nbsp;
              <span>
                Library: <strong>{library.name}</strong>
              </span>
            </div>
            <div className={styles.entityCountContainer}>
              {this.renderEntityChips(facesGroupedByEnity, library)}
            </div>
          </div>
        );
      }
      return null;
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
          <Tab label="Face Recognition" value="faceRecognition" />
          <Tab label="Face Detection" value="faceDetection" />
        </Tabs>
        {this.state.activeTab === 'faceRecognition' && (
          <div className={styles.faceTab}>
            {this.state.selectedEntity && (
              <EntityInformation
                selectedEntity={this.state.selectedEntity}
                onBackClicked={this.removeSelectedEntity}
                onOccurrenceClicked={onFaceOccurrenceClicked}
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
          <div className={styles.faceTab}>
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
