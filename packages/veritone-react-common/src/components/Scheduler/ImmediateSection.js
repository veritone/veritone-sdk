import React, { Fragment } from 'react';

import TimePeriodSelector from './TimePeriodSelector';
import DateTimeSelector from './DateTimeSelector';
import styles from './styles.scss';

export default class ImmediateSection extends React.Component {
  render() {
    return (
      <Fragment>
        <div className={styles.formSectionRow}>
          <TimePeriodSelector name="repeat-interval" label="Repeat every" />
        </div>
        <div className={styles.formSectionRow}>
          <DateTimeSelector name="start" label="Starts" />
        </div>
        <div className={styles.formSectionRow}>
          <DateTimeSelector name="end" label="Ends" />
        </div>
        <div className={styles.formSectionRow}>
          <TimePeriodSelector name="max-segment" label="Max segment" />
        </div>
      </Fragment>
    );
  }
}
