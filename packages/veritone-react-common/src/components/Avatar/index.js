import React from 'react';

import { string, number, func } from 'prop-types';

import styles from './styles.scss';

const Avatar = ({ src, size = 85, label, onClick }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        height: size,
        width: size,
        cursor: onClick ? 'pointer' : 'initial'
      }}
      className={styles.container}
      onClick={onClick}
    >
      {label && (
        <div className={styles.labelBackgroundContainer}>
          <div className={styles.labelContainer}>
            <span>{label}</span>
          </div>
        </div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: string.isRequired,
  size: number,
  label: string,
  onClick: func
};

export default Avatar;
