import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import {
  shape,
  oneOfType,
  number,
  string,
  bool,
  arrayOf
} from 'prop-types';

import styles from '../styles.scss';
export default function FolderIcon({
  folder,
  highlightedIds,
  isRootFolder,
  isOpening,
  selectable
}) {
  const folderId = _.get(folder, 'id');
  if (isRootFolder) {
    const selected = _.includes(highlightedIds, folderId) ? styles['selected'] : null;
    return (
      <div className={cx([
        'icon-work',
        styles['folder-item'],
        selected
      ])} />
    )
  }
  const folderIcon = (
    (isOpening && folder.childs && folder.childs.length > 0)
    || (_.includes(highlightedIds, folderId) && !selectable))
    ? 'icon-open-folder'
    : folder.hasContent ? 'icon-full-folder' : 'icon-empty-folder'
  switch (folder.contentType) {
    case 'folder':
      return (
        <div className={cx([
          folderIcon,
          styles['folder-icon']
        ])} />
      );
    case 'collection':
      return (
        <div className={cx([
          'icon-collections2',
          styles['content-icon']
        ])} />);
    case 'watchlist':
      return (
        <div className={cx([
          'icon-watchlist',
          styles['content-icon']
        ])} />);
    case 'tdo':
      return (
        <div className={cx([
          'icon-applications',
          styles['content-icon']
        ])} />);
    default:
      return (
        <div className={cx([
          'icon-results',
          styles['content-icon']
        ])} />);
  }
}
FolderIcon.propTypes = {
  folder: shape(Object),
  highlightedIds: arrayOf(oneOfType([number, string])),
  isRootFolder: bool,
  isOpening: bool,
  selectable: bool,
}
