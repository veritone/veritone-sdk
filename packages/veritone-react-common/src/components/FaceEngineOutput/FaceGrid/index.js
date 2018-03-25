import React, { Component } from 'react';
import { arrayOf, shape, number, string, bool, func } from 'prop-types';

import FaceDetectionBox from '../FaceDetectionBox';

import styles from './styles.scss';

class FaceGrid extends Component {
  static propTypes = {
    faces: arrayOf(shape({
      startTimeMs: number,
      endTimeMs: number,
      object: shape({
        label: string,
        uri: string
      })
    })),
    entitySearchResults: arrayOf(shape({
      entityName: string,
      libraryName: string,
      profileImageUrl: string
    })),
    enableEditMode: bool,
    onAddNewEntity: func
  };

  drawFaces(faces) {
    return faces.map((face, index) => {
      return <FaceDetectionBox 
        key={'face-' + face.startTimeMs + '-' + face.endTimeMs + '-' + index} 
        face={face} 
        enableEdit={this.props.enableEditMode}
        addNewEntity={this.props.onAddNewEntity}
        searchResults={this.props.entitySearchResults}
      />
    })
  }

  render() {
    let { faces } = this.props;

    return (
      <div className={styles.faceGrid}>
        {this.drawFaces(faces)}
      </div>
    )
  }
}

export default FaceGrid;