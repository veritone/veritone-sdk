import React from 'react';
import { bool, string } from 'prop-types';
import cx from 'classnames';
import styles from './styles.scss';
function FolderItem({ opening, hasContent, folderName }) {

  const folderIcon = opening ? 'icon-open-folder' : hasContent ? 'icon-full-folder' : 'icon-empty-folder'
  return (
    <div className={cx(styles['folder-item-container'])}>
      <div className={cx([
        folderIcon,
        styles['folder-icon']
      ])} />
      <span>{folderName}</span>

    </div>
  )
}

FolderItem.propTypes = {
  opening: bool,
  hasContent: bool,
  folderName: string
}

export default FolderItem;
