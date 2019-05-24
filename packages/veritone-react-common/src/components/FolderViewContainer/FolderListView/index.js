import React from 'react';
import { get } from 'lodash';
import { arrayOf, func, objectOf, bool } from 'prop-types';
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

const FILE_ICONS = {
  'folder': Folder,
  'audio': KeyboardVoice,
  'video': Videocam,
  'doc': InsertDriveFile
}

const FolderListView = ({
  items,
  highlightedItems,
  onHighlightItem,
  onSelectItem
}) => {
  const headers = ['Name', 'Created Date Time', 'Modified Date Time', 'Type'];
    return (
      <Table>
        <TableHead>
          <TableRow className={styles['table-row-head']}>
            {
              headers.map((header) => (
                <TableCell
                  key={header}
                  className={cx(
                    styles['table-row-head--hidden'],
                    styles['table-row']
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
              FILE_ICONS[get(primaryAsset, 'contentType', 'doc').split('/')[0]];
            return (
              <TableRow
                className={cx({
                  [styles.selected]: highlightedItems[id]
                })}
                id={id}
                key={id}
                data-id={id}
                data-index={index}
                data-type={type}
                onClick={onHighlightItem}
                onDoubleClick={onSelectItem}
              >
                <TableCell
                  scope="row"
                  className={styles['table-row']}
                >
                <div className={cx(styles['table-first-column'])}>
                  <FileIcon className={styles['table-icon']}/>
                    <span className={
                      cx(styles['table-first-column--text'],
                      {
                        [styles['table-first-column--folder']]: type === 'folder'
                      })
                    }
                    >
                      {name}
                    </span>
                  </div>
                </TableCell>
                <TableCell align="right" className={styles['table-row']}>
                  {createdDateTime}
                </TableCell>
                <TableCell align="right" className={styles['table-row']}>
                  {modifiedDateTime}
                </TableCell>
                <TableCell align="right" className={styles['table-row']}>
                  {
                    type === 'folder' ?
                    'folder' :
                    get(primaryAsset, 'contentType', 'doc')
                  }
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }

FolderListView.propTypes = {
  onSelectItem: func,
  items: arrayOf(itemShape),
  onHighlightItem: func,
  highlightedItems: objectOf(bool),
}

export default FolderListView;
