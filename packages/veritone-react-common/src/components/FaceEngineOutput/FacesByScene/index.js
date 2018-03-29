import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import { compact } from 'lodash';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import RecognizedFaceMatch from '../RecognizedFaceMatch';

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

  renderRecognizedEntityObjects = () => {
    let { mediaPlayerPosition, onSelectEntity } = this.props;
    return this.props.recognizedEntityObjects.map(entityObject => {
      let entityCurrentlyInFrame = entityObject.timeSlots.find(time => {
        return (
          mediaPlayerPosition >= time.startTimeMs &&
          mediaPlayerPosition <= time.stopTimeMs
        );
      });
      if (entityCurrentlyInFrame) {
        return (
          <RecognizedFaceMatch
            key={'scene-view-recognized-entity-' + entityObject.entityId}
            entity={entityObject}
            confidence={entityCurrentlyInFrame.confidence}
            onViewDetailsClick={onSelectEntity}
          />
        );
      }
      return null;
    });
  };

  render() {
    let recognizedEntityObjects = this.renderRecognizedEntityObjects();
    return (
      <div className={styles.facesByScene}>
        {!compact(recognizedEntityObjects).length ? (
          <div>No Face Matches Found</div>
        ) : (
          recognizedEntityObjects
        )}
      </div>
    );
  }
}

export default FacesByScene;
