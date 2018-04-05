import React from 'react';

import noFacesFound from 'images/null-state-face.svg';

import styles from './styles.scss';

const NoFacesFound = () => {
  return (
    <div className={styles.noFacesFound}>
      <img src={noFacesFound} />
      <div className={styles.noFaceMatchText}>No Face Matches Found</div>
    </div>
  );
};

export default NoFacesFound;
