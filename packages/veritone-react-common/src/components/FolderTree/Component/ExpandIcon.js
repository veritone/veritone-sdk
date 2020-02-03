import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import {
  arrayOf,
  shape,
  func,
  oneOfType,
  number,
  string
} from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../styles';

const useStyles = makeStyles(theme => ({
  ...styles
})); 

export default function ExpandIcon({ folder, opening, onExpand }) {
  const classes = useStyles();
  const folderId = _.get(folder, 'id');
  const expanded = _.includes(opening, folderId);
  const expandStyle = expanded ? 'icon-sort-desc' : 'icon-caret-right';
  if (folder.contentType !== 'folder' || !folder.hasContent) {
    return (
      <div style={{
        width: 20,
        minWidth: 20
      }}
      />
    )
  }
  return (
    <div
      onClick={onExpand(folderId)}
      className={cx([
        expandStyle,
        classes.expandIcon
      ])}
    />
  )
}
ExpandIcon.propTypes = {
  folder: shape(Object),
  onExpand: func,
  opening: arrayOf(oneOfType([number, string]))
}
