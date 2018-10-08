import React, { Component } from 'react';
import { arrayOf, shape, number, string, bool, func } from 'prop-types';
import { pick, find } from 'lodash';

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
    selectedFaces: arrayOf(
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
    isSearchingEntities: bool,
    onFaceCheckboxClicked: func
  };

  // evt is mandatory here to avoid infinite call loop
  handleFaceClick = face => evt => {
    if (this.props.onFaceOccurrenceClicked) {
      this.props.onFaceOccurrenceClicked(face.startTimeMs, face.stopTimeMs);
    }
  };

  handleAddNewEntity = faceIdx => (face, entity) => {
    this.props.onAddNewEntity(face);
  };

  render() {
    const { faces, selectedFaces } = this.props;
    const detectionBoxProps = pick(this.props, [
      'onEditFaceDetection',
      'onRemoveFaceDetection',
      'onSearchForEntities',
      'isSearchingEntities'
    ]);

    return (
      <div className={styles.faceGrid}>
        {!faces.length ? (
          <NoFacesFound />
        ) : (
          faces.map((face, idx) => {
            const isSelected = find(selectedFaces, {guid: face.guid});
            return (
              <FaceDetectionBox
                key={`face-${face.guid}-${face.startTimeMs}-${face.stopTimeMs}-${
                  face.object.uri
                }`}
                isSelected={!!isSelected}
                onCheckboxClicked={this.props.onFaceCheckboxClicked}
                face={face}
                enableEdit={this.props.editMode}
                addNewEntity={this.handleAddNewEntity(idx)}
                searchResults={this.props.entitySearchResults}
                onClick={this.handleFaceClick(face)}
                {...detectionBoxProps}
              />
            );
          })
        )}
      </div>
    );
  }
}

export default FaceGrid;
