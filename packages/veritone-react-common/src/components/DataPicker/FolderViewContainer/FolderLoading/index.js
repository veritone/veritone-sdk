import React from 'react';
import cx from 'classnames';
import { string, number } from "prop-types";
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './styles.scss'


const FolderLoading = ({ message, size }) => {
  return (
    <div className={cx(styles["progress"])}>
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
