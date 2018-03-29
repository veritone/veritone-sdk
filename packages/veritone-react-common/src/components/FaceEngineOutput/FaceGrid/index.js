import React, { Component } from 'react';
import { arrayOf, shape, number, string, bool, func } from 'prop-types';

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
    enableEditMode: bool,
    onAddNewEntity: func,
    onEditFaceDetection: func,
    onFaceOccurrenceClicked: func,
    onRemoveFaceDetection: func,
    onSearchForEntities: func
  };

  handleFaceClick = face => evt => {
    if (!this.props.enableEditMode) {
      this.props.onFaceOccurrenceClicked(face, evt);
    }
  };

  renderFaces(faces) {
    return faces.map((face, index) => {
      return (
        <FaceDetectionBox
          key={'face-' + face.startTimeMs + '-' + face.stopTimeMs + '-' + index}
          face={face}
          enableEdit={this.props.enableEditMode}
          addNewEntity={this.props.onAddNewEntity}
          searchResults={this.props.entitySearchResults}
          onEditFaceDetection={this.props.onEditFaceDetection}
          onRemoveFaceDetection={this.props.onRemoveFaceDetection}
          onClick={this.handleFaceClick(face)}
          onSearchForEntities={this.props.onSearchForEntities}
        />
      );
    });
  }

  render() {
    let { faces } = this.props;

    return <div className={styles.faceGrid}>{this.renderFaces(faces)}</div>;
  }
}

export default FaceGrid;
