import React, { Component } from 'react';
import { arrayOf, shape, number, string, bool, func } from 'prop-types';
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
    onSearchForEntities: func
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

    return (
      <div className={styles.faceGrid}>
        {!faces.length
          ? <NoFacesFound />
          : faces.map((face, idx) => {
            return (
              <FaceDetectionBox
                key={
                  `face-${face.startTimeMs}-${face.stopTimeMs}-
                  ${face.object.label}-${face.object.originalImage}`
                }
                face={face}
                enableEdit={this.props.editMode}
                addNewEntity={this.handleAddNewEntity(idx)}
                searchResults={this.props.entitySearchResults}
                onEditFaceDetection={this.props.onEditFaceDetection}
                onRemoveFaceDetection={this.props.onRemoveFaceDetection}
                onClick={this.handleFaceClick(face)}
                onSearchForEntities={this.props.onSearchForEntities}
              />
            );
          })
        }
      </div>
    );
  }
}

export default FaceGrid;
