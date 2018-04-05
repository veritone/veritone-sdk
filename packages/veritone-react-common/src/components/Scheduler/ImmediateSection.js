import React, { Fragment } from 'react';

import TimePeriodSelector from './TimePeriodSelector';
import styles from './styles.scss';

export default class ImmediateSection extends React.Component {
  render() {
    return (
      <Fragment>
        <div className={styles.formSectionRow}>
          <TimePeriodSelector name="maxSegment" label="Max segment" />
        </div>
      </Fragment>
    );
  }
}
