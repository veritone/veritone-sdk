import React from 'react';
import cx from 'classnames';
// import {} from 'lodash';
import { makeStyles } from '@material-ui/styles';
import { children, oneOf } from 'prop-types';

import styles from './styles/highlightCell';

const useStyles = makeStyles(styles);
const HighlightCell = ({ children, color }) => {
  const classes = useStyles();
  return (
    <div className={cx(classes['container'], classes[color])}>{children}</div>
  );
};

HighlightCell.propTypes = {
  color: oneOf(['green', 'blue', 'orange', 'grey', 'red']),
  children
};

export default HighlightCell;
