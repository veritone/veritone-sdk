import React from 'react';
import { string } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import styles from './styles';

const useStyles = makeStyles(styles);
const SingleTabHeader = ({ tab }) => {
  const classes = useStyles();
  return <div className={classes.singleTabLabel}>{tab}</div>;
};

SingleTabHeader.propTypes = {
  tab: string.isRequired
};

export default SingleTabHeader;
