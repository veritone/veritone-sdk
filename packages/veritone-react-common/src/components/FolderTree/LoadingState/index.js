import React from 'react';
import cx from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from '../styles.scss';

export default function NullState() {
  return (
    <div className={cx(styles['loading'])}>
      <CircularProgress />
    </div>
    );
}
