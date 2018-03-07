import React from 'react';
import { string, bool } from 'prop-types';
import classNames from 'classnames';

import styles from './styles.scss';

const Snippet = ({
  text,
  boldText
}) => {
  return <span className={classNames(boldText && styles.boldText)}>{text} </span>
};

Snippet.propTypes = {
  text: string,
  boldText: bool
};

export default Snippet;