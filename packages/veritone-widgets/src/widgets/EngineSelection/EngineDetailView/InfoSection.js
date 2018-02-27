import React from 'react';
import { bool, func } from 'prop-types';
import { capitalize } from 'lodash';

import { Lozenge, Price, Ellipsis, StarRating } from 'veritone-react-common';
import ToggleButton from '../ToggleButton';
import cjisLogo from '../images/CJIS_logo.png';
import fedrampLogo from '../images/fedramp_logo.png';
import networkIsolatedLogo from '../images/networkisolated_logo.png';

import styles from './styles.scss';


export default ({ engine }) => {
  return (
    <div className={styles['info']}>
      <div className={styles['info-avatar']}>
        <img src={"http://www.crimsy.com/images/100x100.PNG"} />
      </div>
      <div className={styles['info-container']}>
        <div className={styles['info-primary']}>
          <div className={styles['info-title']}>{engine.name}</div>
          <div className={styles['info-subTitle']}>Subtitle</div>
          <div className={styles['info-info']}>
            <Lozenge type="transcription" />
            <StarRating rating={engine.rating} />
          </div>
          <div className={styles.logos}>
            <div className={styles.logo}>
              <img src={cjisLogo} />
            </div>
            <div className={styles.logo}>
              <img src={fedrampLogo} />
            </div>
            <div className={styles.logo}>
              <img src={networkIsolatedLogo} />
            </div>
          </div>
        </div>
        <div className={styles['info-secondary']}>
          <div className={styles['info-price']}>
            <Price />
          </div>
          <div className={styles['info-button']}>
            <ToggleButton />
          </div>
        </div>
      </div>
    </div>
  )
};
