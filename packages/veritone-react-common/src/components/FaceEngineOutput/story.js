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
import { isEqual, isEmpty, find } from 'lodash';

import EngineOutputNullState from '../EngineOutputNullState';

import styles from './story.styles.scss';

import FaceEngineOutput from './';

class FaceEngineOutputStory extends Component {
  static propTypes = {
    editMode: bool,
    mediaPlayerPosition: number,
    onAddNewEntity: func,
    onFaceOccurrenceClicked: func,
    onRemoveFaceDetection: func,
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
    facesDetectedByUser: {},
    entitySearchResults: [],
    entities: this.props.entities,
    engineResultsByEngineId: {},
    fetchedEngineResults: {},
    engines: [
      {
        id: 'f44aa80e-4650-c55c-58e7-49c965019790',
        name: 'Temporal',
        status: 'completed'
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
        recognizedFaces[faceObj.object.entityId] = faceObj;
      }
    });

    return {
      unrecognizedFaces,
      recognizedFaces
    };
  }

  handleRemoveFaceDetection = face => {
    this.setState(prevState => ({
      unrecognizedFaces: prevState.unrecognizedFaces.filter(faceObj => {
        return !isEqual(face, faceObj);
      })
    }));
    this.props.onRemoveFaceDetection(face);
  };

  handleUpdateFace = (face, entity) => {
    this.setState(prevState => {
      return {
        faceEngineOutput: prevState.faceEngineOutput.map(output => {
          if (
            face.startTimeMs >= output.series[0].startTimeMs &&
            face.stopTimeMs <=
              output.series[output.series.length - 1].stopTimeMs
          ) {
            return {
              ...output,
              series: output.series.map(faceObj => {
                if (isEqual(face, faceObj)) {
                  return {
                    ...face,
                    object: {
                      ...face.object,
                      entityId: entity.id,
                      libraryId: entity.libraryId
                    }
                  };
                }
                return { ...faceObj };
              })
            };
          }
          return {
            ...output
          };
        }),
        modifiedFaces: [
          ...prevState.modifiedFaces,
          { ...face, modification: 'update' }
        ]
      };
    });
  };

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
      showNullState
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
        onRemoveFaceDetection={this.handleRemoveFaceDetection}
        onEditFaceDetection={this.handleUpdateFace}
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
          max: 6000,
          step: 1000
        })}
        showNullState={boolean('showNullState', false)}
        onAddNewEntity={action('Pop the add new entity modal')}
        onFaceOccurrenceClicked={action('Set the media player position')}
        onRemoveFaceDetection={action('Remove face detection')}
      />
    );
  });

const faceObjects = [
  {
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 2000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          boundingPoly: [
            {
              x: 0.5,
              y: 0.2
            }
          ]
        }
      },
      {
        startTimeMs: 1000,
        stopTimeMs: 4000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: '13595602-3a7f-48d3-bfde-2d029af479f6',
          libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
          boundingPoly: [
            {
              x: 0.1,
              y: 0.2
            }
          ],
          confidence: 0.81
        }
      },
      {
        startTimeMs: 1000,
        stopTimeMs: 4000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: '1945a3ba-f0a3-411e-8419-78e31c73150a',
          libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
          boundingPoly: [
            {
              x: 0.4,
              y: 0.2
            }
          ],
          confidence: 0.81
        }
      },
      {
        startTimeMs: 1000,
        stopTimeMs: 2000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: 'c36e8b95-6d46-4a5a-a272-8507319a5a54',
          libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
          boundingPoly: [
            {
              x: 0.3,
              y: 0.4
            }
          ],
          confidence: 0.9
        }
      },
      {
        startTimeMs: 2000,
        stopTimeMs: 3000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: '8e35f28c-34aa-4ee3-8690-f62bf1a704fa',
          libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
          boundingPoly: [
            {
              x: 0.2,
              y: 0.5
            }
          ],
          confidence: 0.86
        }
      },
      {
        startTimeMs: 3000,
        stopTimeMs: 4000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: 'c36e8b95-6d46-4a5a-a272-8507319a5a54',
          libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
          boundingPoly: [
            {
              x: 0.3,
              y: 0.4
            }
          ],
          confidence: 0.9
        }
      }
    ]
  },
  {
    series: [
      {
        startTimeMs: 4000,
        stopTimeMs: 6000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          boundingPoly: [
            {
              x: 0.4,
              y: 0.3
            }
          ]
        }
      },
      {
        startTimeMs: 5000,
        stopTimeMs: 6000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: '13595602-3a7f-48d3-bfde-2d029af479f6',
          libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
          boundingPoly: [
            {
              x: 0.5,
              y: 0.2
            }
          ],
          confidence: 0.94
        }
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
    libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
    library: {
      id: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
      name: 'Beatles'
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
    libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
    library: {
      id: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
      name: 'Addams Family'
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
  }
];
