import React from 'react';
import { arrayOf, array } from 'prop-types';
import { capitalize } from 'lodash';

import styles from './styles.scss';

function DetailSection({ section }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{capitalize(section[0])}</div>
      {section[1].map((detail, i) => (
        <div key={i} className={styles.detail}>
          <div className={styles.detailTitle}>{detail.title}</div>
          <div className={styles.detailValue}>{detail.value}</div>
        </div>
      ))}
    </div>
  );
}

DetailSection.propTypes = {
  section: arrayOf(array)
};

export default DetailSection;
