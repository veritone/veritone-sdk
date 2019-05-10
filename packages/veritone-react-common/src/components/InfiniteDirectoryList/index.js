import React from 'react';
import { arrayOf, string, shape, func, node } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Folder,
  InsertDriveFile,
  KeyboardVoice,
  Videocam
} from '@material-ui/icons';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';

import classNames from 'classnames';

import InfiniteWrapper from '../InfiniteWrapper';
import infiniteWrapperShape from '../InfiniteWrapper/infiniteWrapperShape';

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
    cursor: 'pointer'
  },
  text: {
    paddingLeft: 12,
  },
  Folder: {
    color: 'rgba(0,0,0,0.87)',
    fontWeight: 500,
  },
  highlighted: {
    background: '#F0F0F0'
  },
  selected: {
    background: 'rgba(0,0,0,0.37)'
  }
});

const FILE_ICONS = {
  'Folder': Folder,
  'audio/mp3': KeyboardVoice,
  'video/mp4': Videocam,
  'doc': InsertDriveFile
}

const DEFAULT_THRESHOLD = 80;

const DefaultLoading = () => (
  <div className={styles['loading-container']}>
    <CircularProgress size={50} />
  </div>
)

function FilesTable(props) {
  const {
    classes,
    headers,
    files,
    onHighlightItem,
    onSelectItem,
    onMount,
    loadMore,
    finishedLoading,
    loadingComponent
  } = props;

  return (
    <div className={styles['table-container']}>
      <InfiniteWrapper
        finishedLoading={finishedLoading}
        threshold={DEFAULT_THRESHOLD}
        onMount={onMount}
        loadMore={loadMore}
        loadingComponent={loadingComponent}
      >
        <Table>
          <TableHead>
            <TableRow className={classes.tableHeadRow}>
              {
                headers.map((header) => (
                  <TableCell
                    key={header}
                    className={classNames(classes.tableRowHeadColumn, classes.tableRow)}
                    align="right"
                  >
                    {header}<div className={styles['table-row-text']}>{header}</div>
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody className={classes.tablebody}>
            {files.map(({ id, type, name, date, selected }) => {
              const FileIcon = FILE_ICONS[type]
              return (
                <TableRow
                  className={classNames({ [classes.selected]: selected })}
                  key={id}
                  data-id={id}
                  onClick={onHighlightItem}
                  onDoubleClick={onSelectItem}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    className={classes.tableRow}
                  >
                    <FileIcon />
                    <span className={classNames(classes.text, classes[type])} >{name}</span>
                  </TableCell>
                  <TableCell align="right" className={classes.tableRow}>{date}</TableCell>
                  <TableCell align="right" className={classes.tableRow}>{type}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </InfiniteWrapper>
    </div>
  )
}

FilesTable.propTypes = {
  headers: arrayOf(string),
  classes: shape(Object.keys(muiStyles).reduce(
    (classShape, key) => ({ classShape, [key]: string }), {})
  ),
  onHighlightItem: func,
  onSelectItem: func,
  files: arrayOf(shape({
    id: string,
    type: string,
    name: string,
    date: string
  })),
  loadingComponent: node,
  ...infiniteWrapperShape
}

FilesTable.defaultProps = {
  loadingComponent: <DefaultLoading />
}

export default withStyles(muiStyles)(FilesTable);
