import React, { Component } from 'react';
import { string, func, bool, number, shape, arrayOf } from 'prop-types';
import { storiesOf } from '@storybook/react';
import { boolean, number as knobNumber, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { isEqual } from 'lodash';

import styles from './story.styles.scss';

import FaceEngineOutput from './';

class FaceEngineOutputStory extends Component {
  static propTypes = {
    enableEditMode: bool,
    mediaPlayerPosition: number,
    onAddNewEntity: func,
    viewMode: string,
    onFaceOccurrenceClicked: func,
    onRemoveFaceDetection: func,
    className: string,
    faceEngineOutput: arrayOf(
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
    ).isRequired
  };

  state = {
    faceEngineOutput: this.props.faceEngineOutput,
    modifiedFaces: [],
    entitySearchResults: []
  };

  handleRemoveFaceDetection = face => {
    this.setState({
      faceEngineOutput: this.state.faceEngineOutput.map(output => {
        if (
          face.startTimeMs >= output.series[0].startTimeMs &&
          face.stopTimeMs <= output.series[output.series.length - 1].stopTimeMs
        ) {
          return {
            ...output,
            series: output.series.filter(faceObj => !isEqual(face, faceObj))
          };
        }
        return {
          ...output
        };
      }),
      modifiedFaces: [
        ...this.state.modifiedFaces,
        { ...face, modification: 'delete' }
      ]
    });
    this.props.onRemoveFaceDetection(face);
  };

  handleUpdateFace = (face, entity) => {
    this.setState({
      faceEngineOutput: this.state.faceEngineOutput.map(output => {
        if (
          face.startTimeMs >= output.series[0].startTimeMs &&
          face.stopTimeMs <= output.series[output.series.length - 1].stopTimeMs
        ) {
          return {
            ...output,
            series: output.series.map(faceObj => {
              if (
                face.startTimeMs === faceObj.startTimeMs &&
                face.stopTimeMs === faceObj.stopTimeMs &&
                isEqual(face.object.boundingPoly, faceObj.object.boundingPoly)
              ) {
                return {
                  ...face,
                  entityId: entity.entityId,
                  libraryId: entity.libraryId
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
        ...this.state.modifiedFaces,
        { ...face, modification: 'update' }
      ]
    });
  };

  searchForEntities = searchQuery => {
    if (searchQuery && searchQuery.length) {
      let entities = this.props.libraries.reduce((accumulator, library) => {
        return [...accumulator, ...library.entities];
      }, []);
      let searchRegex = new RegExp(searchQuery, 'gi');
      this.setState({
        entitySearchResults: entities.filter(entity => {
          return entity.entityName.match(searchRegex);
        })
      });
    } else {
      this.setState({
        entitySearchResults: []
      });
    }
  };

  render() {
    let {
      libraries,
      enableEditMode,
      mediaPlayerPosition,
      onAddNewEntity,
      viewMode,
      onFaceOccurrenceClicked,
      className
    } = this.props;

    return (
      <FaceEngineOutput
        data={this.state.faceEngineOutput}
        libraries={libraries}
        enableEditMode={enableEditMode}
        entitySearchResults={this.state.entitySearchResults}
        className={className}
        mediaPlayerPosition={mediaPlayerPosition}
        onAddNewEntity={onAddNewEntity}
        viewMode={viewMode}
        onFaceOccurrenceClicked={onFaceOccurrenceClicked}
        onRemoveFaceDetection={this.handleRemoveFaceDetection}
        onEditFaceDetection={this.handleUpdateFace}
        onSearchForEntities={this.searchForEntities}
      />
    );
  }
}

storiesOf('FaceEngineOutput', module).add('Base', () => {
  return (
    <FaceEngineOutputStory
      faceEngineOutput={faceObjects}
      libraries={libraries}
      enableEditMode={boolean('enableEditMode', false)}
      className={styles.outputViewRoot}
      mediaPlayerPosition={knobNumber('mediaPlayerPosition', 0, {
        range: true,
        min: 0,
        max: 6000,
        step: 1000
      })}
      onAddNewEntity={action('Pop the add new entity modal')}
      viewMode={select(
        'viewMode',
        {
          summary: 'Summary',
          byFrame: 'by Frame',
          byScene: 'by Scene'
        },
        'summary'
      )}
      onFaceOccurrenceClicked={action('Set the media player position')}
      onRemoveFaceDetection={action('Remove face detection')}
    />
  );
});

let faceObjects = [
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
        stopTimeMs: 3000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          boundingPoly: [
            {
              x: 0.1,
              y: 0.4
            }
          ]
        }
      },
      {
        startTimeMs: 1000,
        stopTimeMs: 4000,
        entityId: '13595602-3a7f-48d3-bfde-2d029af479f6',
        libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
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
        entityId: '1945a3ba-f0a3-411e-8419-78e31c73150a',
        libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
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
        startTimeMs: 2000,
        stopTimeMs: 3000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          boundingPoly: [
            {
              x: 0.2,
              y: 0.6
            }
          ]
        }
      },
      {
        startTimeMs: 2000,
        stopTimeMs: 3000,
        entityId: '8e35f28c-34aa-4ee3-8690-f62bf1a704fa',
        libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          boundingPoly: [
            {
              x: 0.1,
              y: 0.2
            }
          ],
          confidence: 0.86
        }
      },
      {
        startTimeMs: 3000,
        stopTimeMs: 4000,
        entityId: 'c36e8b95-6d46-4a5a-a272-8507319a5a54',
        libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          boundingPoly: [
            {
              x: 0.1,
              y: 0.2
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
        entityId: '13595602-3a7f-48d3-bfde-2d029af479f6',
        libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          boundingPoly: [
            {
              x: 0.1,
              y: 0.2
            }
          ],
          confidence: 0.94
        }
      }
    ]
  }
];

let libraries = [
  {
    id: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
    name: 'Beatles',
    entities: [
      {
        entityId: 'c36e8b95-6d46-4a5a-a272-8507319a5a54',
        entityName: 'Paul McCartney',
        libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
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
        entityId: '1945a3ba-f0a3-411e-8419-78e31c73150a',
        entityName: 'Ringo Starr',
        libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
        profileImageUrl: null,
        jsondata: {}
      },
      {
        entityId: '8e35f28c-34aa-4ee3-8690-f62bf1a704fa',
        entityName: 'George Harrison',
        libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
        profileImageUrl:
          'https://prod-veritone-library.s3.amazonaws.com/f1297e1c-9c20-48fa-a8fd-46f1e6d62c43/8e35f28c-34aa-4ee3-8690-f62bf1a704fa/profile-1514492325832.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJUCF3BCNMSE5YZEQ%2F20180326%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180326T234640Z&X-Amz-Expires=900&X-Amz-Signature=7222a63cb831c34be639407ce6206df011853a7f01d7b020b101661152efcbb4&X-Amz-SignedHeaders=host',
        jsondata: {
          description: ''
        }
      }
    ]
  },
  {
    id: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
    name: 'Addams Family',
    entities: [
      {
        entityId: '13595602-3a7f-48d3-bfde-2d029af479f6',
        entityName: 'Gomez Addams',
        libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
        profileImage: null,
        jsondata: {}
      },
      {
        entityId: 'c1666e9f-9dc0-40f9-aece-0ec1bfeae29a',
        entityName: 'James Williams',
        libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
        profileImage: null,
        jsondata: {}
      }
    ]
  }
];
