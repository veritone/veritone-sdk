import React from 'react';
import { bool, func } from 'prop-types';
import { capitalize } from 'lodash';

import styles from './styles.scss';


export default ({ section }) => (
  <div className={styles['section']}>
    <div className={styles['section-title']}>
      {capitalize(section[0])}
    </div>
    {section[1].map(detail => (
      <div className={styles['detail']}>
        <div className={styles['detail-title']}>
          {detail.title}
        </div>
        <div className={styles['detail-value']}>
          {detail.value}
        </div>
      </div>
    ))}
  </div>
);
