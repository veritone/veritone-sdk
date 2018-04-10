import React from 'react';

import { string, number, func, bool } from 'prop-types';

import styles from './styles.scss';

const Image = ({
  src,
  height = 100,
  width = 100,
  type = 'cover',
  border,
  label,
  onClick
}) => {
  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        height: height,
        width: width,
        cursor: onClick ? 'pointer' : 'initial',
        border: border ? `1px solid #E4E4E4` : `none`
      }}
      className={
        type === 'cover' ? styles.containerCover : styles.containerContain
      }
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

Image.propTypes = {
  src: string.isRequired,
  height: number,
  width: number,
  type: string,
  onClick: func,
  border: bool,
  label: string
};

export default Image;
