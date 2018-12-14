import React, { Component } from 'react';
import { number, objectOf, shape, string, func, arrayOf } from 'prop-types';
import NoFacesFound from '../NoFacesFound';
import FaceFrameContainer from '../FaceFrameContainer';

import styles from './styles.scss';

class FacesByFrame extends Component {
  static propTypes = {
    recognizedEntityObjectMap: objectOf(
      shape({
        count: number,
        entityId: string,
        fullName: string,
        profileImage: string,
        stopTimeMs: number
      })
    ),
    framesBySeconds: objectOf(
      objectOf(
        shape({
          startTimeMs: number,
          stopTimeMs: number,
          originalImage: string,
          entities: arrayOf(
            shape({
              confidence: number,
              entityId: string
            })
          ),
          boundingPoly: arrayOf(objectOf(number))
        })
      )
    ),
    currentMediaPlayerTime: number,
    onSelectEntity: func
  };

  render() {
    const {
      recognizedEntityObjectMap,
      framesBySeconds,
      currentMediaPlayerTime,
      onSelectEntity
    } = this.props;

    return (
      <div className={styles.facesByFrame}>
        {framesBySeconds[
          currentMediaPlayerTime - currentMediaPlayerTime % 1000
        ] ? (
          <div>
            {Object.keys(
              framesBySeconds[
                currentMediaPlayerTime - currentMediaPlayerTime % 1000
              ]
            ).map((k, i) => {
              return (
                <FaceFrameContainer
                  key={`frame-container-${k}`}
                  faceFrame={
                    framesBySeconds[
                      currentMediaPlayerTime - currentMediaPlayerTime % 1000
                    ][k]
                  }
                  recognizedEntityObjectMap={recognizedEntityObjectMap}
                  onSelectEntity={onSelectEntity}
                />
              );
            })}
          </div>
        ) : (
          <NoFacesFound />
        )}
      </div>
    );
  }
}

export default FacesByFrame;
