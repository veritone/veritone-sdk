import React, { Component } from 'react';
import {
  string,
  func,
  bool,
  number,
  shape,
  arrayOf,
  objectOf,
  oneOfType,
  object
} from 'prop-types';
import { storiesOf } from '@storybook/react';
import {
  withKnobs,
  boolean,
  number as knobNumber
} from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { isEmpty, find, cloneDeep } from 'lodash';
import { guid } from 'helpers/guid';

import EngineOutputNullState from '../EngineOutputNullState';

import styles from './story.styles.scss';

import FaceEngineOutput from './';

const faces = [
  {
    uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
    boundingPoly: [
      {
        x: 0.5,
        y: 0.2
      },
      {
        x: 0.7,
        y: 0.4
      }
    ]
  },
  {
    uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
    boundingPoly: [
      {
        x: 0.1,
        y: 0.2
      },
      {
        x: 0.5,
        y: 0.5
      }
    ]
  },
  {
    uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
    boundingPoly: [
      {
        x: 0.4,
        y: 0.2
      },
      {
        x: 0.8,
        y: 0.6
      }
    ]
  },
  {
    uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
    boundingPoly: [
      {
        x: 0.4,
        y: 0.1
      },
      {
        x: 0.9,
        y: 0.4
      }
    ]
  },
  {
    uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
    boundingPoly: [
      {
        x: 0.2,
        y: 0.5
      },
      {
        x: 0.5,
        y: 0.9
      }
    ]
  },
  {
    uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
    boundingPoly: [
      {
        x: 0.3,
        y: 0.4
      },
      {
        x: 0.8,
        y: 0.8
      }
    ]
  },
  {
    uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
    boundingPoly: [
      {
        x: 0.4,
        y: 0.3
      },
      {
        x: 0.8,
        y: 0.6
      }
    ]
  },
  {
    uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
    boundingPoly: [
      {
        x: 0.5,
        y: 0.6
      },
      {
        x: 0.8,
        y: 0.8
      }
    ]
  }
];

const entities = [
  {
    id: 'c36e8b95-6d46-4a5a-a272-8507319a5a54',
    name: 'Paul McCartney',
    libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
    library: {
      id: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
      name: 'Beatles'
    },
    profileImageUrl:
      'https://pbs.twimg.com/profile_images/806883889146957824/VbnEycIm_normal.jpg',
    jsondata: {
      name: 'Paul McCartney',
      middleName: 'Bob',
      age: 75,
      gender: 'Male',
      description:
        'A member of the beatles. I am typing this to test a long string that will be used in a description for this person or not.'
    }
  },
  {
    id: '1945a3ba-f0a3-411e-8419-78e31c73150a',
    name: 'Ringo Starr',
    libraryId: 'abc',
    library: {
      id: 'abc',
      name: 'Test Library 2'
    },
    profileImageUrl: null,
    jsondata: {}
  },
  {
    id: '8e35f28c-34aa-4ee3-8690-f62bf1a704fa',
    name: 'George Harrison',
    libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
    library: {
      id: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
      name: 'Beatles'
    },
    profileImageUrl:
      'http://www.slate.com/content/dam/slate/articles/arts/musicbox/2011/10/111004_MUSIC_harrisonFW.jpg.CROP.article250-medium.jpg',
    jsondata: {
      description: ''
    }
  },
  {
    id: '13595602-3a7f-48d3-bfde-2d029af479f6',
    name: 'Gomez Addams',
    libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
    library: {
      id: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
      name: 'Addams Family'
    },
    profileImage: null,
    jsondata: {}
  },
  {
    id: 'c1666e9f-9dc0-40f9-aece-0ec1bfeae29a',
    name: 'James Williams',
    libraryId: '123',
    library: {
      id: '123',
      name: 'Test Library'
    },
    profileImage: null,
    jsondata: {}
  }
];

const libraries = [
  {
    id: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
    name: 'Beatles'
  },
  {
    id: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
    name: 'Addams Family'
  },
  {
    id: '123',
    name: 'Test Library'
  },
  {
    id: 'abc',
    name: 'Test Library 2'
  }
];

const tdoLength = 100000,
  interval = 1000;

const faceObjects = genFaceObjects(0, tdoLength, interval, faces, entities);

class FaceEngineOutputStory extends Component {
  static propTypes = {
    editMode: bool,
    mediaPlayerPosition: number,
    onAddNewEntity: func,
    onFaceOccurrenceClicked: func,
    onRemoveFaceDetection: func,
    onUpdateFaceDetection: func,
    entities: arrayOf(
      shape({
        id: string,
        name: string,
        libraryId: string,
        profileImageUrl: string,
        jsondata: objectOf(oneOfType([string, number]))
      })
    ),
    faceObjects: arrayOf(object), //eslint-disable-line react/no-unused-prop-types
    showNullState: boolean.isRequired
  };

  state = {
    unrecognizedFaces: [],
    recognizedFaces: {},
    entitySearchResults: [],
    entities: this.props.entities,
    engines: [
      {
        id: 'f44aa80e-4650-c55c-58e7-49c965019790',
        name: 'Temporal',
        status: 'completed',
        category: { categoryType: 'dummy' }
      }
    ],
    selectedEngineId: 'f44aa80e-4650-c55c-58e7-49c965019790'
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const unrecognizedFaces = [];
    const recognizedFaces = {};
    // flatten data series for currently selected engine
    const faceSeries = nextProps.faceObjects.reduce(
      (accumulator, faceSeries) => {
        if (!isEmpty(faceSeries.series)) {
          return [...accumulator, ...faceSeries.series];
        }
        return accumulator;
      },
      []
    );

    faceSeries.forEach(faceObj => {
      // for each face object
      // locate entity that the face object belongs to
      const entity = find(entities, { id: faceObj.object.entityId });

      if (
        !faceObj.object.entityId ||
        !entities.length ||
        !entity ||
        !entity.name
      ) {
        unrecognizedFaces.push(faceObj);
      } else {
        if (!recognizedFaces[faceObj.object.entityId]) {
          recognizedFaces[faceObj.object.entityId] = [];
        }
        recognizedFaces[faceObj.object.entityId].push(faceObj);
      }
    });

    return {
      unrecognizedFaces,
      recognizedFaces
    };
  }

  searchForEntities = searchQuery => {
    if (searchQuery && searchQuery.length) {
      const searchRegex = new RegExp(searchQuery, 'gi');
      this.setState(currentState => ({
        entitySearchResults: this.props.entities.filter(entity => {
          return entity.name.match(searchRegex);
        })
      }));
    } else {
      this.setState({
        entitySearchResults: []
      });
    }
  };

  render() {
    const {
      editMode,
      mediaPlayerPosition,
      onAddNewEntity,
      onFaceOccurrenceClicked,
      showNullState,
      onRemoveFaceDetection,
      onUpdateFaceDetection
    } = this.props;

    return (
      <FaceEngineOutput
        unrecognizedFaces={this.state.unrecognizedFaces}
        recognizedFaces={this.state.recognizedFaces}
        className={styles.outputViewRoot}
        entities={this.props.entities}
        currentMediaPlayerTime={mediaPlayerPosition}
        engines={this.state.engines}
        onEngineChange={this.handleSelectEngine}
        selectedEngineId={this.state.selectedEngineId}
        onExpandClick={this.toggleExpandedMode}
        onFaceOccurrenceClicked={onFaceOccurrenceClicked}
        editMode={editMode}
        entitySearchResults={this.state.entitySearchResults}
        onAddNewEntity={onAddNewEntity}
        onRemoveFaceDetection={onRemoveFaceDetection}
        onEditFaceDetection={onUpdateFaceDetection}
        onSearchForEntities={this.searchForEntities}
        outputNullState={
          showNullState && (
            <EngineOutputNullState
              engineStatus="failed"
              engineName="fakeEngine"
              onRunProcess={action('Run process')}
            />
          )
        }
      />
    );
  }
}

storiesOf('FaceEngineOutput', module)
  .addDecorator(withKnobs)
  .add('Base', () => {
    return (
      <FaceEngineOutputStory
        faceObjects={faceObjects}
        libraries={libraries}
        entities={entities}
        editMode={boolean('editMode', false)}
        mediaPlayerPosition={knobNumber('mediaPlayerPosition', 0, {
          range: true,
          min: 0,
          max: tdoLength,
          step: interval
        })}
        showNullState={boolean('showNullState', false)}
        onAddNewEntity={action('Pop the add new entity modal')}
        onFaceOccurrenceClicked={action('Set the media player position')}
        onRemoveFaceDetection={action('Remove face detection')}
        onUpdateFaceDetection={action('Update face detection')}
      />
    );
  });

function genFaceObjects(startTime, stopTime, timeInterval, faces, entities) {
  const series = [];
  const numEntries = Math.ceil((stopTime - startTime) / timeInterval);
  for (let entryIndex = 0; entryIndex < numEntries; entryIndex++) {
    const entryStartTime = startTime + entryIndex * timeInterval;
    const randomFaceIndex = Math.round(Math.random() * (faces.length - 1));
    const faceItem = cloneDeep(faces[randomFaceIndex]);
    const isEntity = Math.floor(Math.random() * 5) === 0;
    if (isEntity) {
      const randomEntityIndex = Math.round(
        Math.random() * (entities.length - 1)
      );
      faceItem.entityId = entities[randomEntityIndex].id;
      faceItem.libraryId = entities[randomEntityIndex].libraryId;
      faceItem.confidence = Math.round(Math.random() * 1000) / 1000;
    }
    series.push({
      startTimeMs: entryStartTime,
      stopTimeMs: entryStartTime + Math.floor(Math.random() * 5000),
      guid: guid(),
      object: { ...faceItem, type: 'face' }
    });
  }

  return [
    {
      startTimeMs: startTime,
      stopTimeMs: stopTime,
      status: 'success',
      series: series
    }
  ];
}
