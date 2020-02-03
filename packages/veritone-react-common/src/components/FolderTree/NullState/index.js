import React from 'react';
import { string } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../styles';

const useStyles = makeStyles(theme => ({
  ...styles
})); 

export default function NullState({ message }) {
  const classes = useStyles();
  return (
    <div className={classes.loading}>
      {message}
    </div>
  );
}
NullState.propTypes = {
  message: string
}
