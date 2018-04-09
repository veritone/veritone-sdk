import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import { compact } from 'lodash';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import RecognizedFaceMatch from '../RecognizedFaceMatch';
import NoFacesFound from '../NoFacesFound';

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
    currentMediaPlayerTime: number.isRequired,
    onSelectEntity: func
  };

  renderRecognizedEntityObjects = () => {
    let { currentMediaPlayerTime, onSelectEntity } = this.props;
    return this.props.recognizedEntityObjects.map(entityObject => {
      let entityCurrentlyInFrame = entityObject.timeSlots.find(time => {
        return (
          currentMediaPlayerTime >= time.startTimeMs &&
          currentMediaPlayerTime <= time.stopTimeMs
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
          <NoFacesFound />
        ) : (
          recognizedEntityObjects
        )}
      </div>
    );
  }
}

export default FacesByScene;
