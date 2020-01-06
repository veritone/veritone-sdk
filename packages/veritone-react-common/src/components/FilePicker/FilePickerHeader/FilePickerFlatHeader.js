import React from 'react';
import { string, number } from 'prop-types';

import Typography from '@material-ui/core/Typography';

import styles from './styles.scss';

const FilePickerFlatHeader = ({ title, fileCount, maxFiles }) => {
  return (
    <div className={styles.filePickerFlatHeader}>
      <Typography variant="h6">
        {title}
        &nbsp;<span className={styles.count}>
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
