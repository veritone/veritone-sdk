import React, { Component } from 'react';
import { arrayOf, shape, number, string, bool } from 'prop-types';

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
    enableEditMode: bool
  };

  drawFaces(faces) {
    return faces.map((face, index) => {
      return <FaceDetectionBox 
        key={'face-' + index} 
        face={face} 
        enableEdit={this.props.enableEditMode}
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