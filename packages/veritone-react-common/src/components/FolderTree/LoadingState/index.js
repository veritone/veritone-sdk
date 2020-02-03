import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../styles';

const useStyles = makeStyles(theme => ({
  ...styles
})); 

export default function NullState() {
  const classes = useStyles();
  return (
    <div className={classes.loading}>
      <CircularProgress />
    </div>
    );
}
