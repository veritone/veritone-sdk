import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import cx from 'classnames';
import { compact } from 'lodash';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

@withMuiThemeProvider
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
        timeSlots: arrayOf(
          shape({
            startTimeMs: number,
            stopTimeMs: number,
            originalImage: string,
            confidence: number
          })
        )
      })
    ),
    mediaPlayerPosition: number.isRequired,
    onSelectEntity: func
  };

  handleViewDetailsClick = (entityObject) => (evt) => {
    this.props.onSelectEntity(entityObject);
  }

  renderRecognizedEntityObjects = () => {
    let { mediaPlayerPosition } = this.props;
    return this.props.recognizedEntityObjects.map((entityObject) => {
      let entityCurrentlyInFrame = entityObject.timeSlots.find(time => {
        return mediaPlayerPosition >= time.startTimeMs && mediaPlayerPosition <= time.stopTimeMs;
      })
      if (entityCurrentlyInFrame) {
        let confidenceColor = Math.round(entityCurrentlyInFrame.confidence * 100) >= 90 ? styles.greenBackground : styles.orangeBackground;
        return <div key={'entity-by-scene-' + entityObject.entityId} className={styles.recognizedMatchBox}>
          <div>
            <img className={styles.entityImage} src={entityObject.profileImage} />
            <div className={styles.entityFullName}>{entityObject.fullName}</div>
          </div>
          <div>
            <div className={cx(styles.timeSlotConfidence, confidenceColor)}>{Math.round(entityCurrentlyInFrame.confidence * 100)}% Match</div>
            <div className={styles.viewDetailsLink} onClick={this.handleViewDetailsClick(entityObject)}>
                View Details
            </div>
          </div>
        </div>
      }
      return null;
    });
  };

  render() {
    let recognizedEntityObjects = this.renderRecognizedEntityObjects();
    return (
      <div className={styles.facesByScene}>
        { !compact(recognizedEntityObjects).length ?
          <div>No Face Matches Found</div>:
          recognizedEntityObjects
        }
      </div>
    );
  }
}

export default FacesByScene;
