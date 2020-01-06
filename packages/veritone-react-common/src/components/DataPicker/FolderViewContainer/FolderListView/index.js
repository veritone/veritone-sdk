import React from 'react';
import { get } from 'lodash';
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { arrayOf, func, objectOf, bool } from 'prop-types';
import Folder from '@material-ui/icons/Folder';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import KeyboardVoice from '@material-ui/icons/KeyboardVoice';
import Videocam from '@material-ui/icons/Videocam';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Hidden from '@material-ui/core/Hidden';

import cx from 'classnames';

import itemShape from '../itemShape';
import styles from './styles.scss';

const FILE_ICONS = {
  'folder': Folder,
  'audio': KeyboardVoice,
  'video': Videocam,
  'doc': InsertDriveFile
}

const formatDateString = date => {
  return format(parseISO(date), 'MMM d, yyyy h:mm a..aaa');
};
const useHideWrap = (children, key) => (
  <Hidden key={key} initialWidth="md" smDown>
    {children}
  </Hidden>);

const FolderListView = ({
  items,
  highlightedItems,
  onHighlightItem,
  onSelectItem,
  isAcceptedType
}) => {
  const headers = ['Name', 'Created Date Time', 'Modified Date Time', 'Type'];
  const hiddenIndices = [1, 2];
  function handleDoubleClick(event) {
    const id = event.currentTarget.getAttribute('id');
    const type = event.currentTarget.getAttribute('type');
    onSelectItem && onSelectItem([{ id, type }]);
  };
  return (
    <Table>
      <TableHead>
        <TableRow className={styles['table-row-head']}>
          {
            headers.map((header, index) => {
              const content = (
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
              );
              return hiddenIndices.includes(index)
                ? useHideWrap(content, header)
                : content;
            })
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
          const iconCategory = get(primaryAsset, 'contentType', 'doc').split('/')[0];
          const FileIcon = type === 'folder' ? Folder :
            (FILE_ICONS[iconCategory] || FILE_ICONS['doc']);
          const isSupported = isAcceptedType && isAcceptedType({ primaryAsset });
          return (
            <TableRow
              data-veritone-element="folder-list-item"
              className={cx({
                [styles.selected]: highlightedItems[id],
                [styles.unsupported]: !isSupported && type !== 'folder'
              })}
              id={id}
              key={id}
              type={type}
              data-id={id}
              data-index={index}
              data-type={type}
              onClick={onHighlightItem}
              onDoubleClick={handleDoubleClick}
            >
              <TableCell
                scope="row"
                className={styles['table-row']}
              >
                <div className={cx(styles['table-first-column'])}>
                  <FileIcon className={styles['table-icon']} />
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
              {
                useHideWrap(
                  <TableCell align="right" className={styles['table-row']}>
                    {formatDateString(createdDateTime)}
                  </TableCell>
                )
              }
              {
                useHideWrap(
                  <TableCell align="right" className={styles['table-row']}>
                    {formatDateString(modifiedDateTime)}
                  </TableCell>
                )
              }
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
  );
};

FolderListView.propTypes = {
  onSelectItem: func,
  items: arrayOf(itemShape),
  onHighlightItem: func,
  highlightedItems: objectOf(bool),
  isAcceptedType: func
}

export default FolderListView;
