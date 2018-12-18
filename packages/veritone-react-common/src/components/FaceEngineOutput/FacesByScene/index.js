import React, { Component, Fragment } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';

import RecognizedFaceMatch from '../RecognizedFaceMatch';
import NoFacesFound from '../NoFacesFound';

import styles from './styles.scss';

class FacesByScene extends Component {
  static propTypes = {
    recognizedEntityObjects: arrayOf(
      shape({
        count: number,
        entity: shape({
          entityId: string,
          entityName: string,
          libraryId: string,
          profileImage: string
        }),
        entityId: string,
        fullName: string,
        profileImage: string,
        faces: arrayOf(
          shape({
            startTimeMs: number,
            stopTimeMs: number,
            object: shape({
              label: string,
              originalImage: string
            })
          })
        )
      })
    ),
    currentMediaPlayerTime: number.isRequired,
    onSelectEntity: func
  };

  render() {
    const {
      currentMediaPlayerTime,
      onSelectEntity,
      recognizedEntityObjects
    } = this.props;

    return (
      <div className={styles.facesByScene}>
        {!recognizedEntityObjects.length ? (
          <NoFacesFound />
        ) : (
          <Fragment>
            {recognizedEntityObjects.reduce((acc, entityObject) => {
              const entityCurrentlyInFrame = entityObject.faces.find(time => {
                return (
                  currentMediaPlayerTime >= time.startTimeMs &&
                  currentMediaPlayerTime <= time.stopTimeMs
                );
              });

              if (entityCurrentlyInFrame) {
                acc.push(
                  <RecognizedFaceMatch
                    key={`scene-view-recognized-entity-${
                      entityObject.entityId
                    }`}
                    entity={entityObject}
                    confidence={entityCurrentlyInFrame.confidence}
                    onViewDetailsClick={onSelectEntity}
                  />
                );
              }
              return acc;
            }, [])}
          </Fragment>
        )}
      </div>
    );
  }
}

export default FacesByScene;
