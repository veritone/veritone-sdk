import React, { Component } from 'react';
import { number, string, arrayOf, shape, objectOf, func } from 'prop-types';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import cx from 'classnames';

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

  expandContainer = () => {
    this.setState({
      expanded: true
    });
  };

  render() {
    let { faceFrame, recognizedEntityObjectMap, onSelectEntity } = this.props;
    let faceFrameEntities = faceFrame.entities;
    if (!this.state.expanded && faceFrameEntities.length > 3) {
      faceFrameEntities = faceFrameEntities.slice(0, 3);
    }
    return (
      <div className={styles.frameContainer}>
        <div className={styles.sourceAndImageContainer}>
          {faceFrame.originalImage && (
            <div className={styles.recognizedFaceContainer}>
              <img
                src={faceFrame.originalImage}
                className={styles.sourceImage}
              />
              <div className={styles.sourceImageTimestamp}>
                {msToReadableString(faceFrame.startTimeMs)} -{' '}
                {msToReadableString(faceFrame.stopTimeMs)}
              </div>
              <div className={styles.sourceImageSubtitle}>Source Image</div>
            </div>
          )}
          <div className={styles.recognizedMatches}>
            {faceFrameEntities.map(entity => {
              return (
                <RecognizedFaceMatch
                  key={`frame-view-recognized-entity-${entity.entityId}-${
                    entity.confidence
                  }`}
                  entity={recognizedEntityObjectMap[entity.entityId]}
                  confidence={entity.confidence}
                  onViewDetailsClick={onSelectEntity}
                />
              );
            })}
          </div>
        </div>
        {!this.state.expanded &&
          faceFrame.entities.length > 3 && (
            <div className={styles.showMoreMatches}>
              <Button
                className={styles.showMoreButton}
                onClick={this.expandContainer}
              >
                <span>view all {faceFrame.entities.length} matches found</span>
                <Icon
                  className={cx('icon-expand_more', styles.expandMoreIcon)}
                />
              </Button>
            </div>
          )}
      </div>
    );
  }
}

export default FaceFrameContainer;
