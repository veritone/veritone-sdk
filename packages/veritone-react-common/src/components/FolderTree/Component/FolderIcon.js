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
import { makeStyles } from '@material-ui/core/styles';
import styles from '../styles';

const useStyles = makeStyles(theme => ({
  ...styles
})); 
export default function FolderIcon({
  folder,
  highlightedIds,
  isRootFolder,
  isOpening,
  selectable
}) {
  const classes = useStyles();
  const folderId = _.get(folder, 'id');
  if (isRootFolder) {
    const selected = _.includes(highlightedIds, folderId) ? classes.selected : null;
    return (
      <div className={cx([
        'icon-work',
        classes.folderItem,
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
          classes.folderIcon
        ])} />
      );
    case 'collection':
      return (
        <div className={cx([
          'icon-collections2',
          classes.contentIcon
        ])} />);
    case 'watchlist':
      return (
        <div className={cx([
          'icon-watchlist',
          classes.contentIcon
        ])} />);
    case 'tdo':
      return (
        <div className={cx([
          'icon-applications',
          classes.contentIcon
        ])} />);
    default:
      return (
        <div className={cx([
          'icon-results',
          classes.contentIcon
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
