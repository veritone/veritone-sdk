import React from 'react';
import cx from 'classnames';
import { string, number } from "prop-types";
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  progress: {
    textAlign: 'center'
  }
});
const FolderLoading = ({ message, size }) => {
  const classes = useStyles();
  return (
    <div className={cx(classes["progress"])}>
      <CircularProgress size={size} />
      <div>
        {message}
      </div>
    </div>
  )
}

FolderLoading.propTypes = {
  message: string,
  size: number
}

export default FolderLoading;
