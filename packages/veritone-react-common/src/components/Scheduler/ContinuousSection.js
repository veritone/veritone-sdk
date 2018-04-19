import React, { Fragment } from 'react';

import DateTimeSelector from './DateTimeSelector';
import styles from './styles.scss';

export default class ContinuousSection extends React.Component {
  render() {
    return (
      <Fragment>
        <div className={styles.formSectionRow}>
          <DateTimeSelector name="start" label="Starts" showIcon />
        </div>
        <div className={styles.formSectionRow}>
          <DateTimeSelector name="end" label="Ends" showIcon />
        </div>
      </Fragment>
    );
  }
}
