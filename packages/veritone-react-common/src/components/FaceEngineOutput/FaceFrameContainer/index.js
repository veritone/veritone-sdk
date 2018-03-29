import React, { Component } from 'react';
import { number, string, arrayOf, shape, objectOf, func } from 'prop-types';

import { msToReadableString } from 'helpers/time';
import RecognizedFaceMatch from '../RecognizedFaceMatch';

import styles from './styles.scss';

class FaceFrameContainer extends Component {
  static propTypes = {
    faceFrame: shape({
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
    }),
    recognizedEntityObjectMap: objectOf(
      shape({
        count: number,
        entityId: string,
        fullName: string,
        profileImage: string,
        stopTimeMs: number
      })
    ),
    onSelectEntity: func
  };

  state = {
    expanded: false
  };

  render() {
    let { faceFrame, recognizedEntityObjectMap, onSelectEntity } = this.props;
    
    return (
      <div className={styles.frameContainer}>
        {faceFrame.originalImage && (
          <div className={styles.recognizedFaceContainer}>
            <img src={faceFrame.originalImage} className={styles.sourceImage} />
            <div className={styles.sourceImageTimestamp}>
              {msToReadableString(faceFrame.startTimeMs)} -{' '}
              {msToReadableString(faceFrame.stopTimeMs)}
            </div>
            <div className={styles.sourceImageSubtitle}>Source Image</div>
          </div>
        )}
        <div className={styles.recognizedMatches}>
          {faceFrame.entities.map((entity, i) => {
            return (
              <RecognizedFaceMatch
                key={'frame-view-recognized-entity-' + entity.entityId}
                entity={recognizedEntityObjectMap[entity.entityId]}
                confidence={entity.confidence}
                onViewDetailsClick={onSelectEntity}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default FaceFrameContainer;
