import React, { Component } from 'react';
import cx from 'classnames';
import { number, func, shape } from 'prop-types';

import styles from './styles.scss';

class RecognizedFaceMatch extends Component {
  static propTypes = {
    entity: shape({}),
    onViewDetailsClick: func,
    confidence: number
  };

  handleViewDetailsClick = entityId => evt => {
    this.props.onViewDetailsClick(entityId);
  };

  render() {
    let { entity, confidence } = this.props;
    let confidenceColor =
      Math.round(confidence * 100) >= 90
        ? styles.greenBackground
        : styles.orangeBackground;
    return (
      <div className={styles.recognizedMatchBox}>
        <div className={styles.entityImageContainer}>
          <img className={styles.entityImage} src={entity.profileImage} />
          <div className={styles.entityFullName}>{entity.fullName}</div>
        </div>
        <div>
          <div className={cx(styles.timeSlotConfidence, confidenceColor)}>
            {Math.round(confidence * 100)}% Match
          </div>
          <div
            className={styles.viewDetailsLink}
            onClick={this.handleViewDetailsClick(entity.entityId)}
          >
            View Details
          </div>
        </div>
      </div>
    );
  }
}

export default RecognizedFaceMatch;
