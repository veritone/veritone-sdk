import React, { Component } from 'react';
import { string, number, func, bool } from 'prop-types';

import classNames from 'classnames';

import styles from './styles.scss';

const SnippetFragment = ({
  className,
  active,
  value,
  onClick
}) => (
  <span
    onClick={onClick}
    className={classNames(styles.transcriptSnippet, styles.read, className, {
      [styles.highlight]: active
    })}
  >
    {value}
  </span>
);

SnippetFragment.propTypes = {
  value: string,
  active: bool,
  onClick: func,
  className: string,
  startTimeMs: number.isRequired,
  stopTimeMs: number.isRequired
};

export default SnippetFragment;