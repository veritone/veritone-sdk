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
    const { currentMediaPlayerTime, onSelectEntity } = this.props;

    return this.props.recognizedEntityObjects.map(entityObject => {
      const entityCurrentlyInFrame = entityObject.timeSlots.find(time => {
        return (
          currentMediaPlayerTime >= time.startTimeMs &&
          currentMediaPlayerTime <= time.stopTimeMs
        );
      });
      if (entityCurrentlyInFrame) {
        return (
          <RecognizedFaceMatch
            key={`scene-view-recognized-entity-${entityObject.entityId}`}
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
    const { currentMediaPlayerTime, onSelectEntity } = this.props;

    const recognizedEntityObjects = this.props.recognizedEntityObjects.reduce((acc, entityObject) => {
      const entityCurrentlyInFrame = entityObject.timeSlots.find(time => {
        return (
          currentMediaPlayerTime >= time.startTimeMs &&
          currentMediaPlayerTime <= time.stopTimeMs
        );
      });

      if (entityCurrentlyInFrame) {
        acc.push(
          <RecognizedFaceMatch
            key={`scene-view-recognized-entity-${entityObject.entityId}`}
            entity={entityObject}
            confidence={entityCurrentlyInFrame.confidence}
            onViewDetailsClick={onSelectEntity}
          />
        );

      }
      return acc;
    }, []);

    return (
      <div className={styles.facesByScene}>
        {
          !recognizedEntityObjects.length
          ? <NoFacesFound />
          :
            <div>
              {recognizedEntityObjects}
            </div>
        }
      </div>
    );
  }
}

export default FacesByScene;
