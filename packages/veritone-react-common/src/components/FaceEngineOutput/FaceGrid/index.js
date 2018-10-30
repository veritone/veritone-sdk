import React, { Component } from 'react';
import { arrayOf, shape, number, string, bool, func } from 'prop-types';
import { pick, find } from 'lodash';

import NoFacesFound from '../NoFacesFound';
import FaceInfoBox from '../FaceInfoBox';

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
    onRemoveFace: func,
    onSearchForEntities: func,
    isSearchingEntities: bool,
    onFaceCheckboxClicked: func,
    hideEntityLabels: bool
  };

  // evt is mandatory here to avoid infinite call loop
  handleFaceClick = face => evt => {
    if (this.props.onFaceOccurrenceClicked) {
      this.props.onFaceOccurrenceClicked(face.startTimeMs, face.stopTimeMs);
    }
  };

  handleAddNewEntity = (face, inputValue) => {
    this.props.onAddNewEntity([face], inputValue);
  };

  render() {
    const {
      faces,
      selectedFaces,
      hideEntityLabels,
      onFaceCheckboxClicked,
      editMode,
      entitySearchResults
    } = this.props;
    const detectionBoxProps = pick(this.props, [
      'onEditFaceDetection',
      'onRemoveFace',
      'onSearchForEntities',
      'isSearchingEntities'
    ]);

    return (
      <div className={styles.faceGrid}>
        {!faces.length ? (
          <NoFacesFound />
        ) : (
          faces.map((face, idx) => {
            const selectedFace = find(selectedFaces, { guid: face.guid });
            return (
              <FaceInfoBox
                key={`face-${face.guid}-${face.startTimeMs}-${
                  face.stopTimeMs
                }-${face.object.uri}`}
                isSelected={!!selectedFace}
                onCheckboxClicked={onFaceCheckboxClicked}
                face={face}
                enableEdit={editMode}
                addNewEntity={this.handleAddNewEntity}
                searchResults={entitySearchResults}
                onClick={this.handleFaceClick(face)}
                hideEntityLabel={hideEntityLabels}
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
