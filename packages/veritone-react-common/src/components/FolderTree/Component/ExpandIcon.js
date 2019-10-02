import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import {
  arrayOf,
  shape,
  func,
  oneOfType,
  number,
  string,
  bool
} from 'prop-types';

import styles from '../styles.scss';

export default function ExpandIcon({ folder, opening, onExpand, isEnableShowingContent }) {
  const folderId = _.get(folder, 'id');
  const expanded = _.includes(opening, folderId);
  const expandStyle = expanded ? 'icon-sort-desc' : 'icon-caret-right';
  if (!folder.childs || folder.childs.length === 0) {
    return (
      <div style={{
        width: 30,
        minWidth: 30
      }}
      />
    )
  }
  if (
    !isEnableShowingContent &&
    folder.contentType === 'folder' &&
    folder.subfolders.length === 0
  ) {
    return (
      <div style={{
        width: 30,
        minWidth: 30
      }}
      />
    )
  }
  return (
    <div
      onClick={onExpand(folderId)}
      className={cx([
        expandStyle,
        styles['expand-icon']
      ])}
    />
  )
}
ExpandIcon.propTypes = {
  folder: shape(Object),
  onExpand: func,
  opening: arrayOf(oneOfType([number, string])),
  isEnableShowingContent: bool
}