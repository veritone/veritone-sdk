import React from 'react';
import { string } from 'prop-types';
import cx from 'classnames';

import styles from '../styles.scss';

export default function NullState({ message }) {
  return (
    <div className={cx(styles['loading'])}>
      {message}
    </div>
  );
}
NullState.propTypes = {
  message: string
}
