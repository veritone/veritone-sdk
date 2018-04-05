import React, { Component } from 'react';
import { number, objectOf, shape, string, func, arrayOf } from 'prop-types';

import NoFacesFound from '../NoFacesFound';
import FaceFrameContainer from '../FaceFrameContainer';

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
          endTimeMs: number,
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
    mediaPlayerPosition: number,
    onSelectEntity: func
  };
  render() {
    let {
      recognizedEntityObjectMap,
      framesBySeconds,
      mediaPlayerPosition,
      onSelectEntity
    } = this.props;

    return (
      <div>
        {framesBySeconds[mediaPlayerPosition - mediaPlayerPosition % 1000] ? (
          <div>
            {Object.keys(
              framesBySeconds[mediaPlayerPosition - mediaPlayerPosition % 1000]
            ).map((k, i) => {
              return (
                <FaceFrameContainer
                  key={'frame-container-' + k}
                  faceFrame={
                    framesBySeconds[
                      mediaPlayerPosition - mediaPlayerPosition % 1000
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
