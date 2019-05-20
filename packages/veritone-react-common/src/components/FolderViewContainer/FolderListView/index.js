import React from 'react';
import { get } from 'lodash';
import { arrayOf, string, shape, func, objectOf, bool } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Folder,
  InsertDriveFile,
  KeyboardVoice,
  Videocam
} from '@material-ui/icons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';

import cx from 'classnames';

import itemShape from '../itemShape';
import styles from './styles.scss';

const muiStyles = () => ({
  tableHeadRow: {
    height: 0,
    padding: 0,
  },
  tableRowHeadColumn: {
    height: 0,
    lineHeight: 0,
    visibility: 'hidden',
    whiteSpace: 'nowrap',
    padding: 0
  },
  tableRow: {
    borderBottom: 0,
    color: 'rgba(0,0,0,0.54)',
    cursor: 'pointer',
    userSelect: 'none'
  },
  tableRowFirstColumn: {
    display: 'flex',
    alignItems: 'center'
  },
  selected: {
    background: 'rgba(0,0,0,0.37)'
  }
});

const FILE_ICONS = {
  'folder': Folder,
  'audio': KeyboardVoice,
  'video': Videocam,
  'doc': InsertDriveFile
}

const FolderListView = ({
  classes,
  items,
  highlightedItems,
  onHighlightItem,
  onSelectItem
}) => {
  const headers = ['Name', 'Created Date Time', 'Modified Date Time', 'Type'];
    return (
      <Table>
        <TableHead>
          <TableRow className={classes.tableHeadRow}>
            {
              headers.map((header) => (
                <TableCell
                  key={header}
                  className={cx(
                    classes.tableRowHeadColumn,
                    classes.tableRow
                  )}
                  align="right"
                >
                  {header}
                  <div className={styles['table-row-text']}>
                    {header}
                  </div>
                </TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(({
            id,
            type,
            name,
            primaryAsset,
            createdDateTime,
            modifiedDateTime
          }, index) => {
            const FileIcon = type === 'folder' ? Folder :
              FILE_ICONS[
              get(primaryAsset, 'contentType', 'doc').split('/')[0]
              ];
            return (
              <TableRow
                className={cx({
                  [classes.selected]: highlightedItems[id]
                })}
                id={id}
                key={id}
                data-id={id}
                data-index={index}
                onClick={onHighlightItem}
                onDoubleClick={onSelectItem}
              >
                <TableCell
                  // component="th"
                  scope="row"
                  className={cx(
                    classes.tableRow,
                    classes.tableRowFirstColumn
                  )}
                >
                  <FileIcon />
                  <span className={
                    cx(styles['table-first-column--text'], {
                      [styles['table-first-column--folder']]: type === 'folder'
                    })
                  }
                  >
                    {name}
                  </span>
                </TableCell>
                <TableCell align="right" className={classes.tableRow}>
                  {createdDateTime}
                </TableCell>
                <TableCell align="right" className={classes.tableRow}>
                  {modifiedDateTime}
                </TableCell>
                <TableCell align="right" className={classes.tableRow}>
                  {type}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }

FolderListView.propTypes = {
  classes: shape(Object.keys(muiStyles).reduce(
    (classShape, key) => ({ classShape, [key]: string }), {})
  ),
  onSelectItem: func,
  items: arrayOf(itemShape),
  onHighlightItem: func,
  highlightedItems: objectOf(bool),
}

export default withStyles(muiStyles)(FolderListView);
