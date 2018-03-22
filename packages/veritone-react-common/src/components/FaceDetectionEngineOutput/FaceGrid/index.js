import React, { Component } from 'react';
import { arrayOf, shape, number, string } from 'prop-types';

import styles from './styles.scss';

import FaceDetectionBox from '../FaceDetectionBox';

class FaceGrid extends Component {
  static propTypes = {
    faces: arrayOf(shape({
      startTimeMs: number,
      endTimeMs: number,
      object: shape({
        label: string,
        uri: string
      })
    }))
  };

  render() {
    let { faces } = this.props;

    return (
      <div className={styles.faceGrid}>
        {this.drawFaces(faces)}
      </div>
    )
  }

  drawFaces(faces) {
    return faces.map((face, index) => {
      return <FaceDetectionBox key={'face-' + index} face={face} />
    })
  }
}

export default FaceGrid;