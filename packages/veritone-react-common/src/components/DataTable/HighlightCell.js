import React from 'react';
import cx from 'classnames';
// import {} from 'lodash';

import { children, oneOf } from 'prop-types';

import styles from './styles/highlightCell.scss';

const HighlightCell = ({ children, color }) => {
  return (
    <div className={cx(styles['container'], styles[color])}>{children}</div>
  );
};

HighlightCell.propTypes = {
  color: oneOf(['green', 'blue', 'orange', 'grey', 'red']),
  children
};

export default HighlightCell;
