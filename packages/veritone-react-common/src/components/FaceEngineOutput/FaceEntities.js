import React, { Component, Fragment } from 'react';
import {
  shape,
  number,
  string,
  arrayOf,
  func,
  objectOf,
  oneOfType,
  bool
} from 'prop-types';
import { find, isObject, get, reduce, pick, findIndex } from 'lodash';
import cx from 'classnames';
import Icon from '@material-ui/core/Icon';
import EntityInformation from './EntityInformation';
import FacesByScene from './FacesByScene';
import FacesByFrame from './FacesByFrame';
import FacesByLibrary from './FacesByLibrary';

import styles from './styles.scss';

export default class FaceEntities extends Component {
  static propTypes = {
    editMode: bool,
    viewMode: string,
    faces: objectOf(
      arrayOf(
        shape({
          startTimeMs: number.isRequired,
          stopTimeMs: number.isRequired,
          object: shape({
            label: string,
            uri: string,
            confidence: number,
            type: string,
            entityId: string.isRequired,
            libraryId: string.isRequired
          })
        })
      )
    ).isRequired,
    entities: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        libraryId: string.isRequired,
        library: shape({
          id: string.isRequired,
          name: string.isRequired
        }),
        profileImageUrl: string,
        jsondata: objectOf(oneOfType([string, number]))
      })
    ).isRequired,
    currentMediaPlayerTime: number,
    onSelectEntity: func,
    onFaceOccurrenceClicked: func
  };

  state = {
    selectedEntity: null,
    faceEntities: {},
    entitiesByLibrary: {},
    framesBySeconds: {}
  };

  UNSAFE_componentWillMount() {
    this.setState(prevState => ({
      ...buildFaceDataPayload(this.props.faces, this.props.entities)
    }));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.viewMode !== this.props.viewMode) {
      this.setState(prevState => ({
        selectedEntity: null
      }));
    }
    if (
      nextProps.entities.length !== this.props.entities.length ||
      Object.keys(nextProps.faces).length !==
        Object.keys(this.props.faces).length
    ) {
      this.setState(prevState => ({
        ...buildFaceDataPayload(nextProps.faces, nextProps.entities)
      }));
    }
  }

  handleEntitySelect = entityId => {
    if (this.state.faceEntities[entityId]) {
      this.setState(prevState => ({
        selectedEntity: entityId
      }));
    }
  };

  removeSelectedEntity = () => {
    this.setState({
      selectedEntity: null
    });
  };

  render() {
    const { viewMode, currentMediaPlayerTime, editMode } = this.props;
    const { faceEntities, selectedEntity } = this.state;

    if (selectedEntity && faceEntities[selectedEntity]) {
      return (
        <EntityInformation
          {...pick(faceEntities[selectedEntity], ['entity', 'count', 'faces'])}
          onBackClicked={this.removeSelectedEntity}
          onOccurrenceClicked={this.props.onFaceOccurrenceClicked}
        />
      );
    }

    if (viewMode === 'summary') {
      return (
        <Fragment>
          {editMode && (
            <div className={styles.cantEditWarning}>
              <Icon
                className={cx('icon-info-panel', styles.cantEditInfoIcon)}
              />
              <span>
                <span className={styles.boldNoteText}> Note: </span>Recognized
                faces can not be edited currently
              </span>
            </div>
          )}
          <FacesByLibrary
            faceEntityLibraries={this.state.entitiesByLibrary}
            onSelectEntity={this.handleEntitySelect}
          />
        </Fragment>
      );
    } else if (viewMode === 'byFrame') {
      return (
        <FacesByFrame
          currentMediaPlayerTime={currentMediaPlayerTime}
          recognizedEntityObjectMap={faceEntities}
          framesBySeconds={this.state.framesBySeconds}
          onSelectEntity={this.handleEntitySelect}
        />
      );
    } else if (viewMode === 'byScene') {
      return (
        <FacesByScene
          currentMediaPlayerTime={currentMediaPlayerTime}
          recognizedEntityObjects={Object.values(faceEntities)}
          onSelectEntity={this.handleEntitySelect}
        />
      );
    }
  }
}

function setRecognizedEntityObj(recognizedEntityObj, faceObj) {
  return {
    ...recognizedEntityObj,
    count: recognizedEntityObj.count + 1,
    faces: [...recognizedEntityObj.faces, faceObj],
    stopTimeMs:
      recognizedEntityObj.stopTimeMs <= faceObj.stopTimeMs
        ? faceObj.stopTimeMs
        : recognizedEntityObj.stopTimeMs
  };
}

function getFrameNamespaceForMatch(faceObj) {
  return faceObj.object.boundingPoly
    ? JSON.stringify(faceObj.object.boundingPoly)
    : null;
}

// Gets list of nearest seconds which the face/entity appears in (MS)
function getArrayOfSecondSpots(face) {
  const secondSpots = [];

  if (!isObject(face) || !face.startTimeMs || !face.stopTimeMs) {
    return secondSpots;
  }

  let timeCursor = face.startTimeMs - face.startTimeMs % 1000;

  while (timeCursor <= face.stopTimeMs) {
    secondSpots.push(timeCursor);
    timeCursor += 1000;
  }

  return secondSpots;
}

function buildFaceDataPayload(faces, entities) {
  const payload = {
    faceEntities: {},
    entitiesByLibrary: {},
    framesBySeconds: {}
  };

  const faceData = reduce(
    faces,
    (result, faceObjects) => {
      // for each face object
      faceObjects.forEach(faceObj => {
        if (result.faceEntities[faceObj.object.entityId]) {
          const entityObj = setRecognizedEntityObj(
            result.faceEntities[faceObj.object.entityId],
            faceObj
          );
          result.faceEntities[faceObj.object.entityId] = entityObj;

          const entityIdx = findIndex(
            result.entitiesByLibrary[entityObj.libraryId].faces,
            { entityId: entityObj.entityId }
          );
          result.entitiesByLibrary[entityObj.libraryId].faces[
            entityIdx
          ] = entityObj;
        } else {
          // locate entity that the face object belongs to
          const entity = find(entities, { id: faceObj.object.entityId });

          if (entity) {
            // try to locate library entity that contains the face object
            const libraryEntity = find(entities, {
              libraryId: entity.libraryId
            });
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
              faces: [faceObj],
              stopTimeMs: faceObj.stopTimeMs
            };

            result.faceEntities[entity.id] = recognizedEntityObj;
            result.entitiesByLibrary[recognizedEntityObj.libraryId] = {
              libraryId: recognizedEntityObj.libraryId,
              libraryName: recognizedEntityObj.libraryName,
              faces: [
                ...get(
                  result.entitiesByLibrary[recognizedEntityObj.libraryId],
                  'faces',
                  []
                ),
                recognizedEntityObj
              ]
            };
          }
        }

        const matchNamespace = getFrameNamespaceForMatch(faceObj);

        if (matchNamespace) {
          const secondSpots = getArrayOfSecondSpots(faceObj);

          secondSpots.forEach(second => {
            if (!result.framesBySeconds[second]) {
              result.framesBySeconds[second] = {};
            }
            if (!result.framesBySeconds[second][matchNamespace]) {
              result.framesBySeconds[second][matchNamespace] = {
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

            result.framesBySeconds[second][matchNamespace].entities.push(match);
            result.framesBySeconds[second][matchNamespace].entities.sort(
              (a, b) => {
                return b.confidence - a.confidence;
              }
            );
          });
        }
      });

      return result;
    },
    payload
  );

  return faceData;
}
