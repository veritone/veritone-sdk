import React, { Component } from 'react';
import {
  shape,
  number,
  string,
  arrayOf,
  func,
  objectOf,
  oneOfType
} from 'prop-types';
import { find, isObject, get, forEach, pick } from 'lodash';
import EntityInformation from './EntityInformation';
import FacesByScene from './FacesByScene';
import FacesByFrame from './FacesByFrame';
import FacesByLibrary from './FacesByLibrary';

export default class FaceEntities extends Component {
  static propTypes = {
    viewMode: string,
    faces: shape({}),
    entities: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        libraryId: string.isRequired,
        profileImageUrl: string,
        jsondata: objectOf(oneOfType([string, number]))
      })
    ).isRequired,
    currentMediaPlayerTime: number,
    onSelectEntity: func,
    onFaceOccurrenceClicked: func
  }

  state = {
    selectedEntity: null,
    faceEntities: {},
    entitiesByLibrary: {},
    framesBySeconds: {}
  }

  componentWillMount() {
    this.setState(prevState => ({
      ...buildFaceDataPayload(this.props.faces, this.props.entities)
    }));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.viewMode !== this.props.viewMode) {
      this.setState(prevState => ({
        selectedEntity: null
      }));
    }
    if (nextProps.entities.length !== this.props.entities.length ||
      Object.keys(nextProps.faces).length !== Object.keys(this.props.faces).length)
    {
      this.setState(prevState => ({
        ...buildFaceDataPayload(this.props.faces, this.props.entities)
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
    const { viewMode, currentMediaPlayerTime } = this.props;
    const { faceEntities, selectedEntity } = this.state;

    if (selectedEntity) {
      return (
        <EntityInformation
          {...pick(
            faceEntities[selectedEntity],
            ['entity', 'count', 'timeSlots'])
          }
          onBackClicked={this.removeSelectedEntity}
          onOccurrenceClicked={this.props.onFaceOccurrenceClicked}
        />
      );
    }

    if (viewMode === 'summary') {
      return (
        <FacesByLibrary
          faceEntityLibraries={this.state.entitiesByLibrary}
          onSelectEntity={this.handleEntitySelect}
        />
      )
    } else if (viewMode === 'byFrame') {
      return (
        <FacesByFrame
          currentMediaPlayerTime={currentMediaPlayerTime}
          recognizedEntityObjectMap={faceEntities}
          framesBySeconds={this.state.framesBySeconds}
          onSelectEntity={this.handleEntitySelect}
        />
      )
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
    faceEntities: {},
    entitiesByLibrary: {},
    framesBySeconds: {}
  };

  // faces.forEach(faceObj => { // for each face object
  forEach(faces, (faceObj) => { // for each face object
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

      if (faceData.faceEntities[entity.id]) {
        faceData.faceEntities[entity.id] = setRecognizedEntityObj(
          faceData.faceEntities[entity.id],
          faceObj
        );
      } else {
        faceData.faceEntities[entity.id] = recognizedEntityObj;
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
