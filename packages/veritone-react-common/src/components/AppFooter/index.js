import React from 'react';
import Paper from '@material-ui/core/Paper';
import { node, number, oneOf } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import styles from './styles';

export const appFooterHeightShort = 40;
export const appFooterHeightTall = 65;

const useStyles = makeStyles(styles);

const AppFooter = ({
  children,
  elevation = 2,
  leftOffset = 0,
  height = 'short'
}) => {
  const classes = useStyles();
  const footerHeight = {
    short: appFooterHeightShort,
    tall: appFooterHeightTall
  }[height];

  return (
    <Paper
      component="footer"
      square
      elevation={elevation}
      className={classes.container}
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
