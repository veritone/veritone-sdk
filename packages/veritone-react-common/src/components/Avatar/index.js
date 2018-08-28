import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';

import { string, number, func } from 'prop-types';

import styles from './styles.scss';

const Avatar = ({ src, size = 85, label, onClick }) => {
  return (
    <ButtonBase centerRipple onClick={onClick} disabled={!onClick}>
      <div
        style={{
          backgroundImage: `url(${src})`,
          height: size,
          width: size,
          cursor: onClick ? 'pointer' : 'initial'
        }}
        className={styles.container}
      >
        {label && (
          <div className={styles.labelBackgroundContainer}>
            <div className={styles.labelContainer}>
              <span>{label}</span>
            </div>
          </div>
        )}
      </div>
    </ButtonBase>
  );
};

Avatar.propTypes = {
  src: string.isRequired,
  size: number,
  label: string,
  onClick: func
};

export default Avatar;
