import React from 'react';
import Paper from 'material-ui/es/Paper';
import { node, number, oneOf } from 'prop-types';

import styles from './styles.scss';

export const appFooterHeightShort = 40;
export const appFooterHeightTall = 65;
const AppFooter = ({
  children,
  elevation = 2,
  leftOffset = 0,
  height = 'short'
}) => {
  const footerHeight = {
    short: appFooterHeightShort,
    tall: appFooterHeightTall
  }[height];

  return (
    <Paper
      component="footer"
      square
      elevation={elevation}
      className={styles.container}
      style={{ height: footerHeight, marginLeft: leftOffset }}
    >
      {children}
    </Paper>
  );
};

AppFooter.propTypes = {
  children: node,
  elevation: number,
  leftOffset: number,
  height: oneOf(['short', 'tall'])
};

export default AppFooter;
