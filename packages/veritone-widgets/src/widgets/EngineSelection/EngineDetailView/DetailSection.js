import React from 'react';
import { bool, func } from 'prop-types';
import { capitalize } from 'lodash';

import styles from './styles.scss';

export default ({ section }) => (
  <div className={styles.section}>
    <div className={styles.sectionTitle}>{capitalize(section[0])}</div>
    {section[1].map(detail => (
      <div className={styles.detail}>
        <div className={styles.detailTitle}>{detail.title}</div>
        <div className={styles.detailValue}>{detail.value}</div>
      </div>
    ))}
  </div>
);
