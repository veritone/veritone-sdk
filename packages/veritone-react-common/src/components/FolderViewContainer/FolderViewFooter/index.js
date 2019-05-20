import React from 'react';
import Button from '@material-ui/core/Button';
import { bool, func, string } from 'prop-types';
import styles from './styles.scss';

const FolderViewFooter = ({ onCancel, onSubmit, title, disabled }) => (
  <div className={styles['folder-view-picker']}>
    <Button onClick={onCancel}>Cancel</Button>
    <Button
      variant="raised"
      disabled={disabled}
      color="primary"
      onClick={onSubmit}
    >
      {title}
    </Button>
  </div>
);

FolderViewFooter.propTypes = {
  disabled: bool,
  onCancel: func,
  onSubmit: func,
  title: string
};

FolderViewFooter.defaultProps = {
  title: 'OK'
};

export default FolderViewFooter;
