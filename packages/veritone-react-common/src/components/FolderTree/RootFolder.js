import React from 'react';
import { bool, string } from 'prop-types';
import cx from 'classnames';
import styles from './styles.scss';
function RootFolderItem({ selecting, folderName }) {
  const selected = selecting ? styles['root-folder-icon'] : null;
  return (
    <div className={cx(styles['folder-item-container'])}>
      <div className={cx([
        'icon-work',
        styles['folder-item'],
        selected
      ])} />
      <span>{folderName}</span>

    </div>
  )
}

RootFolderItem.propTypes = {
  selecting: bool,
  folderName: string
}

export default RootFolderItem;
