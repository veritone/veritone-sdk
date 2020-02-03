import React from 'react';
import { string, number } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';

import styles from './styles';
const useStyles = makeStyles(styles);
const FilePickerFlatHeader = ({ title, fileCount, maxFiles }) => {
  const classes = useStyles();
  return (
    <div className={classes.filePickerFlatHeader}>
      <Typography variant="h6">
        {title}
        &nbsp;<span className={classes.count}>
          {fileCount}/{maxFiles}
        </span>
      </Typography>
    </div>
  );
};

FilePickerFlatHeader.propTypes = {
  title: string,
  fileCount: number,
  maxFiles: number
};

FilePickerFlatHeader.defaultProps = {
  title: 'Uploaded',
  fileCount: 0,
  maxFiles: 1
};

export default FilePickerFlatHeader;
