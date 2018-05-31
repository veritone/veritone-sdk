import React, { Component } from 'react';
import { arrayOf, shape, number, string, bool, func } from 'prop-types';
import { pick } from 'lodash';

import NoFacesFound from '../NoFacesFound';
import FaceDetectionBox from '../FaceDetectionBox';

import styles from './styles.scss';

class FaceGrid extends Component {
  static propTypes = {
    faces: arrayOf(
      shape({
        startTimeMs: number,
        endTimeMs: number,
        object: shape({
          label: string,
          originalImage: string
        })
      })
    ),
    entitySearchResults: arrayOf(
      shape({
        entityName: string,
        libraryName: string,
        profileImageUrl: string
      })
    ),
    editMode: bool,
    onAddNewEntity: func,
    onEditFaceDetection: func,
    onFaceOccurrenceClicked: func,
    onRemoveFaceDetection: func,
    onSearchForEntities: func,
    isSearchingEntities: bool
  };

  handleFaceClick = face => evt => {
    if (!this.props.editMode) {
      this.props.onFaceOccurrenceClicked(face.startTimeMs, face.stopTimeMs);
    }
  };

  handleAddNewEntity = (faceIdx) => (face, entity) => {
    this.props.onAddNewEntity(face);
  }

  render() {
    const { faces } = this.props;
    const detectionBoxProps = pick(this.props, [
      'onEditFaceDetection',
      'onRemoveFaceDetection',
      'onSearchForEntities',
      'isSearchingEntities'
    ])

    return (
      <div className={styles.faceGrid}>
        {!faces.length
          ? <NoFacesFound />
          : faces.map((face, idx) => {
            return (
                  // ${face.object.label}-${face.object.originalImage}`
              <FaceDetectionBox
                key={
                  `face-${face.startTimeMs}-${face.stopTimeMs}-${face.object.uri}`
                }
                face={face}
                enableEdit={this.props.editMode}
                addNewEntity={this.handleAddNewEntity(idx)}
                searchResults={this.props.entitySearchResults}
                onClick={this.handleFaceClick(face)}
                {...detectionBoxProps}
              />
            );
          })
        }
      </div>
    );
  }
}

export default FaceGrid;
