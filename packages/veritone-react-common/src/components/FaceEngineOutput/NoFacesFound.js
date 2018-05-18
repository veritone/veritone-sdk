import React from 'react';

import noFacesFoundSvg from 'images/null-state-face.svg';

import styles from './styles.scss';

const NoFacesFound = () => {
  return (
    <div className={styles.noFacesFound}>
      <img src={noFacesFoundSvg} />
      <div className={styles.noFaceMatchText}>No Face Matches Found</div>
    </div>
  );
};

export default NoFacesFound;
